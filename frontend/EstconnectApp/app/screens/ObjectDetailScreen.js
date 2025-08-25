import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Linking
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import ObjectCard from '../components/ObjectCard';
import FileIcon from '../components/icons/FileIcon';
import ProcentIcon from '../components/icons/ProcentIcon';
import PhoneIcon from '../components/icons/PhoneIcon';
import ChatIcon from '../components/icons/ChatIcon';
import ClassIcon from '../components/icons/ClassIcon';
import BuildingIcon from '../components/icons/BuildingIcon';
import KeyIcon from '../components/icons/KeyIcon';
import LadderIcon from '../components/icons/LadderIcon';
import apiClient from '../api/client';
import { COLORS, commonStyles, objectDetailStyles as styles } from '../styles';



const ObjectDetailScreen = ({ navigation, route }) => {
  const { objectId } = route.params;
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mapCoordinates, setMapCoordinates] = useState({
    latitude: 13.7563, // Bangkok default
    longitude: 100.5018,
  });
  const [mapLoading, setMapLoading] = useState(true);
  const [otherObjects, setOtherObjects] = useState([]);
  const [otherObjectsLoading, setOtherObjectsLoading] = useState(false);

  useEffect(() => {
    loadObjectDetail();
  }, [objectId]);

  useEffect(() => {
    if (object && object.developer !== null && object.developer !== undefined) {
      loadOtherObjects();
    }
  }, [object]);

  const geocodeWithNominatim = async (address, country, city) => {
    try {
      // Формируем полный адрес с учетом страны и города
      let fullAddress = address;
      if (city) {
        fullAddress = `${address}, ${city}`;
      }
      if (country) {
        fullAddress = `${fullAddress}, ${country}`;
      }
      
      console.log('Geocoding address:', fullAddress);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`,
        {
          headers: {
            'User-Agent': 'EstconnectApp/1.0',
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      let data;
      try {
        data = await response.json();
        console.log('Nominatim API response:', JSON.stringify(data, null, 2));
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        console.log('Response text:', await response.text());
        throw new Error('Invalid JSON response from Nominatim API');
      }
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        console.log('Found coordinates:', lat, lon);
        setMapCoordinates({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      }
      
      // Если полный адрес не найден, попробуем найти по городу
      if (city && country) {
        console.log('Trying to geocode by city:', `${city}, ${country}`);
        const cityResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${city}, ${country}`)}&limit=1`,
          {
            headers: {
              'User-Agent': 'EstconnectApp/1.0',
              'Accept': 'application/json'
            }
          }
        );
        
        if (!cityResponse.ok) {
          throw new Error(`HTTP error! status: ${cityResponse.status}`);
        }
        
        let cityData;
        try {
          cityData = await cityResponse.json();
        } catch (jsonError) {
          console.error('JSON parse error for city:', jsonError);
          throw new Error('Invalid JSON response from Nominatim API for city');
        }
        
        if (cityData && cityData.length > 0) {
          const { lat, lon } = cityData[0];
          console.log('Found coordinates by city:', lat, lon);
          setMapCoordinates({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
          return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
        }
      }
      
      // Если геокодирование не удалось, используем координаты Бангкока
      console.log('Geocoding failed, using default coordinates');
      setMapCoordinates({ latitude: 13.7563, longitude: 100.5018 });
      return { latitude: 13.7563, longitude: 100.5018 };
    } catch (error) {
      console.error('Nominatim API error:', error);
      // В случае ошибки также используем координаты Бангкока
      setMapCoordinates({ latitude: 13.7563, longitude: 100.5018 });
      return { latitude: 13.7563, longitude: 100.5018 };
    }
  };

  const getMapHtml = () => {
    const { latitude, longitude } = mapCoordinates;
    const address = object?.address || '';
    const name = object?.name || 'Объект недвижимости';
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; }
            #map { width: 100%; height: 100vh; }
            .leaflet-control-attribution {
              display: none;
            }
          </style>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        </head>
        <body>
          <div id="map"></div>
          <script>
            const map = L.map('map').setView([${latitude}, ${longitude}], 15);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            const marker = L.marker([${latitude}, ${longitude}]).addTo(map);
            
            const popup = L.popup()
              .setLatLng([${latitude}, ${longitude}])
              .setContent('<div style="padding: 10px;"><h3 style="margin: 0 0 5px 0; font-size: 16px;">${name.replace(/'/g, "\\'")}</h3><p style="margin: 0; font-size: 14px; color: #666;">${address.replace(/'/g, "\\'")}</p></div>');
            
            marker.bindPopup(popup);
          </script>
        </body>
      </html>
    `;
  };

  const loadObjectDetail = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getObject(objectId);
      setObject(data);
      
      // Геокодируем адрес для карты с учетом страны и города
      if (data.address) {
        await geocodeWithNominatim(data.address, data.country_name, data.city_name);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить информацию об объекте');
      console.error('Failed to load object detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOtherObjects = async () => {
    try {
      setOtherObjectsLoading(true);
      const data = await apiClient.getOtherObjects(objectId);
      setOtherObjects(data);
    } catch (error) {
      // Не показываем ошибку пользователю, так как это не критично
    } finally {
      setOtherObjectsLoading(false);
    }
  };

  const handleToggleFavourite = async () => {
    try {
      const response = await apiClient.toggleFavourite(objectId);
      setObject(prev => ({ ...prev, is_favourite: response.is_favourite }));
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить избранное');
      console.error('Failed to toggle favourite:', error);
    }
  };

  const handleOpenDocumentation = () => {
    if (object.documentations_link) {
      // Здесь можно добавить открытие ссылки в браузере или встроенном просмотрщике
      Alert.alert('Информация', 'Открытие файлов застройщика будет добавлено позже');
    }
  };

  const handleOpenInMaps = async () => {
    try {
      const address = object.address;
      const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось открыть карту');
      console.error('Failed to open maps:', error);
    }
  };

  const handleOtherObjectPress = (otherObject) => {
    navigation.replace('ObjectDetail', { objectId: otherObject.id });
  };

  const handleOtherObjectToggleFavourite = async (objectId) => {
    try {
      const response = await apiClient.toggleFavourite(objectId);
      // Обновляем состояние объекта в списке других объектов
      setOtherObjects(prevObjects => 
        prevObjects.map(obj => 
          obj.id === objectId 
            ? { ...obj, is_favourite: response.is_favourite }
            : obj
        )
      );
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить избранное');
      console.error('Failed to toggle favourite:', error);
    }
  };

  const formatAddress = () => {
    const city = object.city_name || '';
    const country = object.country_name || '';
    if (city && country) {
      return `${city}, ${country}`;
    } else if (city) {
      return city;
    } else if (country) {
      return country;
    }
    return 'Местоположение не указано';
  };

  const renderImageCarousel = () => {
    if (!object?.images || object.images.length === 0) {
      return (
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/placeholder-img.png')}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>
      );
    }

    const screenWidth = Dimensions.get('window').width;

    return (
      <View style={styles.imageContainer}>
        <FlatList
          data={object.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={screenWidth}
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
            setCurrentImageIndex(index);
          }}
          getItemLayout={(data, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={{ width: screenWidth }}>
              <Image
                source={{ uri: item.image }}
                style={styles.mainImage}
                resizeMode="cover"
              />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        
        {/* Индикаторы изображений */}
        {object.images.length > 1 && (
          <View style={styles.imageIndicators}>
            {object.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.imageIndicator,
                  index === currentImageIndex && styles.imageIndicatorActive
                ]}
              />
            ))}
          </View>
        )}
        
        {/* Счетчик изображений */}
        <View style={styles.imageCounter}>
          <Ionicons name="camera" size={16} color={COLORS.white} />
          <Text style={styles.imageCounterText}>
            {currentImageIndex + 1} / {object.images.length}
          </Text>
        </View>
        
        {/* Кнопка добавить в закладки */}
        <TouchableOpacity 
          style={styles.favouriteButton}
          onPress={handleToggleFavourite}
        >
          <Ionicons 
            name={object.is_favourite ? "heart" : "heart-outline"} 
            size={24} 
            color={object.is_favourite ? COLORS.primary : COLORS.white} 
          />
        </TouchableOpacity>
      </View>
    );
  };



  if (loading) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={commonStyles.loadingText}>Загрузка объекта...</Text>
      </View>
    );
  }

  if (!object) {
    return (
      <View style={commonStyles.errorContainer}>
        <Text style={commonStyles.errorText}>Объект не найден</Text>
        <TouchableOpacity 
          style={commonStyles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={commonStyles.buttonText}>Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      


      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Основная информация */}
        <View style={styles.content}>
          {/* Заголовок и адрес */}
          <View style={styles.headerSection}>
            <Text style={styles.objectTitle}>{object.name}</Text>
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>
              <Ionicons name="location" size={16} color={COLORS.gray} />
                {formatAddress()}
              </Text>
            </View>
          </View>

          {/* Карусель изображений */}
          {renderImageCarousel()}

          {/* Цена */}
          <Text style={styles.priceText}>
            от {object.price_per_sqm} THB/м²
          </Text>

          {/* Основные характеристики */}
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Text style={styles.infoItemTitle}>Класс жилья:</Text>
              <Text style={styles.infoItemText}>{object.comfort_type || 'Не указан'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoItemTitle}>Тип дома:</Text>
              <Text style={styles.infoItemText}>{object.property_type || 'Не указан'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoItemTitle}>Срок сдачи:</Text>
              <Text style={styles.infoItemText}>{new Date(object.completion_date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoItemTitle}>Парковка:</Text>
              <Text style={styles.infoItemText}>{object.parking ? 'Есть' : 'Нет'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoItemTitle}>Этажность:</Text>
              <Text style={styles.infoItemText}>{object.floors}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoItemTitle}>Корпуса:</Text>
              <Text style={styles.infoItemText}>{object.corpus_count}</Text>
            </View>
          </View>

          {/* Действия */}
          <View style={styles.actionsSection}>
            {object.documentations_link && (
              <TouchableOpacity style={styles.actionButton} onPress={handleOpenDocumentation}>
                <FileIcon width={17} height={19} color={COLORS.primary} />
                <Text style={styles.actionButtonText}>Файлы застройщика</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionButton}>
              <ProcentIcon width={14} height={14} color={COLORS.primary} />
              <Text style={styles.actionButtonText}>Комиссии</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <PhoneIcon width={16} height={17} color={COLORS.primary} />
              <Text style={styles.actionButtonText}>Контакты</Text>
            </TouchableOpacity>
          </View>

          {/* Основная кнопка */}
          <TouchableOpacity style={styles.mainButton}>
            <ChatIcon width={17} height={17} color={COLORS.white} />
            <Text style={styles.mainButtonText}>Связаться со своим личным менеджером</Text>
          </TouchableOpacity>
        </View>

        {/* Местонахождение */}
        <View style={styles.informationSection}>
          <Text style={styles.sectionTitle}>Местонахождение</Text>
          <View style={styles.locationItems}>
            <View style={styles.locationItem}>
              <Text style={styles.locationItemTitle}>Страна</Text>
              <Text style={styles.locationItemText}>{object.country_name || 'Не указана'}</Text>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationItemTitle}>Город</Text>
              <Text style={styles.locationItemText}>{object.city_name || 'Не указан'}</Text>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationItemTitle}>Район</Text>
              <Text style={styles.locationItemText}>{object.district_name || 'Не указан'}</Text>
            </View>
          </View>
        </View>

        {/* Характеристики объекта */}
        <View style={styles.informationSection}>
          <Text style={styles.sectionTitle}>Характеристики объекта</Text>
                      <View style={styles.characteristicsItems}>
              <View style={styles.characteristicsItem}>
                <View style={styles.characteristicsIcon}>
                  <ClassIcon width={20} height={20} color={COLORS.primary} />
                </View>
                <View style={styles.characteristicsInfo}>
                  <Text style={styles.characteristicsTitle}>Класс</Text>
                  <Text style={styles.characteristicsText}>{object.comfort_type || 'Не указан'}</Text>
                </View>
              </View>
              <View style={styles.characteristicsItem}>
                <View style={styles.characteristicsIcon}>
                  <BuildingIcon width={20} height={20} color={COLORS.primary} />
                </View>
                <View style={styles.characteristicsInfo}>
                  <Text style={styles.characteristicsTitle}>Тип строения</Text>
                  <Text style={styles.characteristicsText}>{object.property_type || 'Не указан'}</Text>
                </View>
              </View>
              <View style={styles.characteristicsItem}>
                <View style={styles.characteristicsIcon}>
                  <KeyIcon width={20} height={20} color={COLORS.primary} />
                </View>
                <View style={styles.characteristicsInfo}>
                  <Text style={styles.characteristicsTitle}>Год сдачи</Text>
                  <Text style={styles.characteristicsText}>{new Date(object.completion_date).getFullYear()}</Text>
                </View>
              </View>
              <View style={styles.characteristicsItem}>
                <View style={styles.characteristicsIcon}>
                  <LadderIcon width={20} height={20} color={COLORS.primary} />
                </View>
                <View style={styles.characteristicsInfo}>
                  <Text style={styles.characteristicsTitle}>Кол-во этажей</Text>
                  <Text style={styles.characteristicsText}>{object.floors}</Text>
                </View>
              </View>
            </View>
        </View>

        {/* Описание */}
        {object.description && (
          <View style={styles.informationSection}>
            <Text style={styles.sectionTitle}>Описание</Text>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>{object.description}</Text>
              <Text style={styles.descriptionDate}>
                Обновлено: {new Date(object.updated_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}

        {/* Местонахождение на карте */}
        <View style={styles.informationSection}>
          <Text style={styles.sectionTitle}>Местонахождение на карте</Text>
          <View style={styles.mapLocation}>
            <Ionicons name="location" size={16} color={COLORS.gray} />
            <Text style={styles.mapLocationText}>{object.address}</Text>
          </View>
          <View style={styles.mapContainer}>
            {mapLoading && (
              <View style={styles.mapLoadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.mapLoadingText}>Загрузка карты...</Text>
              </View>
            )}
            <WebView
              style={styles.map}
              source={{ html: getMapHtml() }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              onLoadStart={() => setMapLoading(true)}
              onLoadEnd={() => setMapLoading(false)}
            />
            <TouchableOpacity 
              style={styles.openMapsButton}
              onPress={handleOpenInMaps}
            >
              <Ionicons name="navigate" size={20} color={COLORS.white} />
              <Text style={styles.openMapsButtonText}>Открыть в картах</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Еще от застройщика */}
        {object.developer && (
          <View style={styles.informationSection}>
            <Text style={styles.sectionTitle}>Еще от застройщика</Text>
            {otherObjectsLoading ? (
              <View style={styles.otherObjectsContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.otherObjectsPlaceholder}>
                  Загрузка других объектов...
                </Text>
              </View>
            ) : otherObjects.length > 0 ? (
              <View style={styles.otherObjectsList}>
                {otherObjects.map((item) => (
                  <ObjectCard
                    key={item.id.toString()}
                    object={item}
                    onPress={handleOtherObjectPress}
                    onToggleFavourite={handleOtherObjectToggleFavourite}
                    showFavouriteButton={true}
                    compact={false}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.otherObjectsContainer}>
                <Text style={styles.otherObjectsPlaceholder}>
                  Других объектов от этого застройщика пока нет
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      
      {/* Нижнее меню */}
      <BottomNavigation navigation={navigation} activeTab="view" />
    </View>
  );
};



export default ObjectDetailScreen;
