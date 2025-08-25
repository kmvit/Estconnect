import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import apiClient from '../api/client';
import { COLORS, commonStyles, objectsMapStyles as styles } from '../styles';

const ObjectsMapScreen = ({ navigation, route }) => {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [webViewRef, setWebViewRef] = useState(null);
  const [filters, setFilters] = useState(route.params?.filters || {});
  const [sortBy, setSortBy] = useState(route.params?.sortBy || 'default');
  const [searchQuery, setSearchQuery] = useState(route.params?.searchQuery || '');

  useEffect(() => {
    loadObjects();
  }, []);

  const loadObjects = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        sort_by: sortBy
      };
      
      if (searchQuery.trim()) {
        params.name = searchQuery.trim();
      }
      
      const data = await apiClient.getObjects(params);
      setObjects(data);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить объекты');
      console.error('Failed to load objects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getObjectsWithCoordinates = (objects) => {
    return objects.filter(obj => 
      obj.latitude && obj.longitude && 
      obj.latitude !== 0 && obj.longitude !== 0
    );
  };



  const centerMapOnMarkers = () => {
    if (!webViewRef || mapMarkers.length === 0) return;

    const validMarkers = mapMarkers.filter(marker => 
      marker.lat !== 13.7563 || marker.lng !== 100.5018
    );

    if (validMarkers.length === 0) return;

    // Вычисляем центр
    const centerLat = validMarkers.reduce((sum, marker) => sum + marker.lat, 0) / validMarkers.length;
    const centerLng = validMarkers.reduce((sum, marker) => sum + marker.lng, 0) / validMarkers.length;

    // Центрируем карту
    webViewRef.injectJavaScript(`
      window.centerMap(${centerLat}, ${centerLng}, 6);
    `);
  };

  const loadObjectsOnMap = () => {
    if (!webViewRef || objects.length === 0) return;

    setMapLoading(true);
    setMapMarkers([]);

    // Получаем объекты с координатами
    const objectsWithCoordinates = getObjectsWithCoordinates(objects);
    
    if (objectsWithCoordinates.length === 0) {
      setMapLoading(false);
      return;
    }

    // Добавляем маркеры для каждого объекта
    const validMarkers = [];
    
    objectsWithCoordinates.forEach((object) => {
      const name = object.name || 'Объект недвижимости';
      const address = object.address || '';
      const price = object.price_per_sqm ? `от ${object.price_per_sqm} THB/м²` : 'Цена не указана';

      const markerData = {
        lat: object.latitude,
        lng: object.longitude,
        name: name,
        address: address,
        price: price,
        objectId: object.id
      };

      // Добавляем маркер на карту через WebView
      webViewRef.injectJavaScript(`
        window.addMarker(
          ${object.latitude}, 
          ${object.longitude}, 
          '${name.replace(/'/g, "\\'")}', 
          '${address.replace(/'/g, "\\'")}', 
          '${price.replace(/'/g, "\\'")}', 
          ${object.id}
        );
      `);

      validMarkers.push(markerData);
    });

    setMapMarkers(validMarkers);
    setMapLoading(false);
    
    // Центрируем карту по маркерам
    if (validMarkers.length > 0) {
      setTimeout(() => {
        centerMapOnMarkers();
      }, 500);
    }
  };



    const getMapHtml = () => {
    // Создаем базовую карту
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; }
            #map { width: 100%; height: 100vh; }
            .leaflet-control-attribution { display: none; }
            .leaflet-popup-content-wrapper {
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .leaflet-popup-content {
              margin: 0;
              border-radius: 8px;
            }
          </style>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        </head>
        <body>
          <div id="map"></div>
          <script>
            const map = L.map('map').setView([13.7563, 100.5018], 5);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            // Функция для добавления маркера
            window.addMarker = function(lat, lng, name, address, price, objectId) {
              const marker = L.marker([lat, lng]).addTo(map);
              
              const popup = L.popup()
                .setLatLng([lat, lng])
                .setContent('<div style="padding: 10px; min-width: 200px;"><h3 style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold;">' + name + '</h3><p style="margin: 0 0 5px 0; font-size: 14px; color: #666;">' + address + '</p><p style="margin: 0; font-size: 14px; color: #007AFF; font-weight: bold;">' + price + '</p></div>');
              
              marker.bindPopup(popup);
              
              marker.on('click', function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'object_click',
                  objectId: objectId
                }));
              });
              
              return marker;
            };
            

            
            // Функция для центрирования карты
            window.centerMap = function(lat, lng, zoom = 6) {
              map.setView([lat, lng], zoom);
            };
            
            // Функция для подгонки карты под маркеры
            window.fitBounds = function(markers) {
              if (markers.length > 0) {
                const group = L.featureGroup(markers);
                map.fitBounds(group.getBounds().pad(0.1));
              }
            };
          </script>
        </body>
      </html>
    `;
  };

  const handleObjectClick = (objectId) => {
    navigation.navigate('ObjectDetail', { objectId });
  };



  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'object_click') {
        handleObjectClick(data.objectId);

    }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };



  if (loading) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={commonStyles.loadingText}>Загрузка объектов...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.content}>
        {/* Заголовок */}
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>Объекты на карте</Text>
          <Text style={styles.headerSubtitle}>
            {objects.length > 0 
              ? (() => {
                  const objectsWithCoordinates = getObjectsWithCoordinates(objects);
                  const objectsWithoutCoordinates = objects.length - objectsWithCoordinates.length;
                  
                  if (objectsWithCoordinates.length === 0) {
                    return 'Нет объектов с координатами на карте';
                  }
                  
                  let subtitle = `Найдено ${objectsWithCoordinates.length} ${objectsWithCoordinates.length === 1 ? 'объект' : objectsWithCoordinates.length < 5 ? 'объекта' : 'объектов'} на карте`;
                  
                  if (objectsWithoutCoordinates > 0) {
                    subtitle += ` (${objectsWithoutCoordinates} без координат)`;
                  }
                  
                  if (mapLoading) {
                    subtitle += ' • Загрузка карты...';
                  }
                  
                  return subtitle;
                })()
              : 'Объекты не найдены'
            }
          </Text>
        </View>

        {/* Карта */}
        <View style={styles.mapContainer}>
          {mapLoading && (
            <View style={styles.mapLoadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.mapLoadingText}>Загрузка карты...</Text>
            </View>
          )}
          
          {objects.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons 
                name="map-outline" 
                size={64} 
                color={COLORS.gray} 
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>Объекты не найдены</Text>
              <Text style={styles.emptySubtext}>
                Попробуйте изменить параметры поиска
              </Text>
            </View>
          ) : (
            <WebView
              ref={setWebViewRef}
              style={styles.map}
              source={{ html: getMapHtml() }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              onLoadStart={() => setMapLoading(true)}
              onLoadEnd={() => {
                setMapLoading(false);
                // После загрузки карты начинаем добавлять маркеры
                loadObjectsOnMap();
              }}
              onMessage={handleWebViewMessage}
            />
          )}
        </View>
      </View>
      
      <BottomNavigation navigation={navigation} activeTab="view" />
    </View>
  );
};

export default ObjectsMapScreen;
