import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import Button from '../components/Button';
import { COLORS } from '../styles/colors';
import { commonStyles } from '../styles/components/common';
import { catalogStyles as styles } from '../styles/screens/catalog';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/client';

const CatalogScreen = ({ navigation, route }) => {
  const [catalogData, setCatalogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  
  const { user } = useAuth();
  
  // Определяем тип каталога в зависимости от роли пользователя
  // Если пользователь агент - показываем застройщиков, если застройщик - показываем агентов
  const catalogType = user?.role === 'agent' ? 'developers' : 'agents';

  // Определяем заголовки в зависимости от типа каталога
  const getCatalogInfo = () => {
    if (catalogType === 'agents') {
      return {
        title: 'Каталог агентов',
        searchTitle: 'Поиск агентов',
        searchPlaceholder: 'Введите название агента',
        emptyText: 'Агенты не найдены'
      };
    } else {
      return {
        title: 'Каталог застройщиков',
        searchTitle: 'Поиск застройщиков',
        searchPlaceholder: 'Введите название застройщика',
        emptyText: 'Застройщики не найдены'
      };
    }
  };

  const catalogInfo = getCatalogInfo();

  // Опции сортировки
  const sortOptions = [
    { value: 'name_asc', label: 'от А до Я' },
    { value: 'name_desc', label: 'от Я до А' },
    { value: 'date_asc', label: 'от старых пользователей к новым' },
    { value: 'date_desc', label: 'от новых пользователей к старым' }
  ];

  // Страны для фильтра
  const countries = [
    { value: 'thailand', label: 'Таиланд' },
    { value: 'vietnam', label: 'Вьетнам' },
    { value: 'cambodia', label: 'Камбоджа' },
    { value: 'indonesia', label: 'Индонезия' },
    { value: 'malaysia', label: 'Малайзия' },
  ];

  useEffect(() => {
    loadCatalogData();
  }, [catalogType]);

  useEffect(() => {
    // Загружаем данные при изменении типа каталога
    if (catalogType) {
      loadCatalogData();
    }
  }, [catalogType]);

  const loadCatalogData = async () => {
    try {
      setLoading(true);
      
      // Используем методы API клиента в зависимости от типа каталога
      const data = catalogType === 'agents' 
        ? await apiClient.getAgents()
        : await apiClient.getDevelopers();
      
      const results = data.results || data;
      setCatalogData(results);
      setFilteredData(results);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные каталога');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortData = async () => {
    try {
      setLoading(true);
      
      // Строим параметры запроса
      const params = {};
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      if (countryFilter) {
        const selectedCountry = countries.find(c => c.value === countryFilter);
        if (selectedCountry) {
          params.country = selectedCountry.label;
        }
      }
      
      if (sortOption !== 'default') {
        params.sort = sortOption;
      }
      
      // Используем методы API клиента
      const data = catalogType === 'agents' 
        ? await apiClient.getAgents(params)
        : await apiClient.getDevelopers(params);
      
      setFilteredData(data.results || data);
    } catch (error) {
      console.error('Ошибка при фильтрации данных:', error);
      Alert.alert('Ошибка', 'Не удалось применить фильтры');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    // Вызываем фильтрацию с небольшой задержкой для оптимизации
    setTimeout(() => filterAndSortData(), 500);
  };

  const handleCountryFilter = (countryValue) => {
    setCountryFilter(countryValue);
    setTimeout(() => filterAndSortData(), 100);
  };

  const handleSort = (sortValue) => {
    setSortOption(sortValue);
    setShowSortDropdown(false);
    setTimeout(() => filterAndSortData(), 100);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCountryFilter('');
    setSortOption('default');
    setTimeout(() => filterAndSortData(), 100);
  };

  const handleToggleFavourite = async (itemId) => {
    try {
      // Используем методы API клиента
      const data = catalogType === 'agents' 
        ? await apiClient.toggleAgentFavourite(itemId)
        : await apiClient.toggleDeveloperFavourite(itemId);
      
      // Обновляем состояние в зависимости от ответа API
      setCatalogData(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, is_favourite: data.is_favourite }
            : item
        )
      );
    } catch (error) {
      console.error('Ошибка при добавлении/удалении из избранного:', error);
      Alert.alert('Ошибка', 'Не удалось обновить избранное');
    }
  };

  const handleItemPress = (item) => {
    // Навигация к детальной странице
    navigation.navigate('ProfileDetail', { 
      userId: item.id, 
      type: catalogType 
    });
  };

  const renderCatalogItem = ({ item }) => {
    // Форматируем дату
    const formatDate = (dateString) => {
      if (!dateString) return 'Не указана';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      } catch (error) {
        return 'Не указана';
      }
    };

    // Форматируем локацию
    const formatLocation = () => {
      const country = item.country_name || item.country;
      const city = item.city_name || item.city;
      
      if (!country && !city) return 'Не указана';
      if (country && city) return `${country}, ${city}`;
      if (country) return country;
      if (city) return city;
      return 'Не указана';
    };

    // Получаем описание
    const getDescription = () => {
      if (item.description) return item.description;
      if (item.role === 'agent') return 'Профессиональный агент недвижимости';
      if (item.role === 'developer') return 'Застройщик недвижимости';
      return 'Описание не указано';
    };

    return (
      <TouchableOpacity 
        style={styles.catalogItem}
        onPress={() => handleItemPress(item)}
      >
        <View style={styles.itemImageContainer}>
          <Image 
            source={item.profile_photo 
              ? { uri: item.profile_photo } 
              : require('../../assets/images/person-card-img.png')
            }
            style={styles.itemImage}
          />
          <TouchableOpacity 
            style={styles.favouriteButton}
            onPress={() => handleToggleFavourite(item.id)}
          >
            <Image 
              source={item.is_favourite 
                ? require('../../assets/icons/favourites-icon.png')
                : require('../../assets/icons/favourites-icon-outline.png')
              }
              style={styles.favouriteIcon}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>
            {item.company_name || item.username || 'Название не указано'}
          </Text>
          
          <View style={styles.itemLocation}>
            <Ionicons name="location" size={16} color={COLORS.breadcrumbs} />
            <Text style={styles.locationText}>
              {formatLocation()}
            </Text>
          </View>
          
          <View style={styles.itemInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar" size={16} color={COLORS.text} style={{ marginRight: 8 }} />
              <Text style={styles.infoText}>
                {formatDate(item.date_joined)}
              </Text>
            </View>
          </View>
          
          <Text style={styles.itemDescription} numberOfLines={3}>
            {getDescription()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortOption);
    return option ? option.label : 'По умолчанию';
  };

  if (loading) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={commonStyles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{catalogInfo.title}</Text>
        </View>

        {/* Поиск */}
        <View style={styles.searchSection}>
          <Text style={styles.searchTitle}>{catalogInfo.searchTitle}</Text>
          
          <View style={styles.searchForm}>
            <View style={styles.searchRow}>
              <View style={styles.searchField}>
                <Text style={styles.fieldLabel}>Страна</Text>
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => {
                    Alert.alert(
                      'Выберите страну',
                      '',
                      countries.map(country => ({
                        text: country.label,
                        onPress: () => handleCountryFilter(country.value)
                      })).concat([
                        { text: 'Все страны', onPress: () => handleCountryFilter('') },
                        { text: 'Отмена', style: 'cancel' }
                      ])
                    );
                  }}
                >
                  <Text style={[
                    styles.dropdownButtonText,
                    { color: countryFilter ? COLORS.text : COLORS.gray }
                  ]}>
                    {countryFilter 
                      ? countries.find(c => c.value === countryFilter)?.label 
                      : 'Таиланд'
                    }
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.searchField}>
                <Text style={styles.fieldLabel}>Поиск по названию</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder={catalogInfo.searchPlaceholder}
                  placeholderTextColor={COLORS.gray}
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
              </View>
            </View>
            
            <View style={styles.searchButtons}>
              <Button 
                title="Найти"
                onPress={() => {}} // Фильтрация происходит автоматически
                style={styles.searchButton}
              />
              {(searchQuery || countryFilter) && (
                <Button 
                  title="Сбросить"
                  onPress={handleResetFilters}
                  style={styles.resetButton}
                />
              )}
            </View>
          </View>
        </View>

        {/* Сортировка */}
        <View style={styles.sortSection}>
          <View style={styles.sortDropdownWrapper}>
            <View style={styles.sortDropdown}>
              <View style={styles.sortDropdownHeader}>
                <Text style={styles.sortDropdownHeaderTitle}>Сортировать</Text>
                <TouchableOpacity 
                  style={styles.sortDropdownButtonWrapper}
                  onPress={() => setShowSortDropdown(!showSortDropdown)}
                >
                  <Text style={styles.sortDropdownButton}>{getSortLabel()}</Text>
                  <Image 
                    source={require('../../assets/icons/arrow-bottom-icon.svg')}
                    style={[styles.sortDropdownIcon, showSortDropdown && styles.sortDropdownIconActive]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              
              {showSortDropdown && (
                <View style={styles.sortDropdownContent}>
                  {sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.sortDropdownOption}
                      onPress={() => handleSort(option.value)}
                    >
                      <Text style={styles.sortDropdownOptionText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Список элементов */}
        <View style={styles.catalogList}>
          {filteredData.length > 0 ? (
            <FlatList
              data={filteredData}
              renderItem={renderCatalogItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>{catalogInfo.emptyText}</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <BottomNavigation navigation={navigation} activeTab="catalog" />
    </View>
  );
};

export default CatalogScreen;
