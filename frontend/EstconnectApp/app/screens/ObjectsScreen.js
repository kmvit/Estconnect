import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import ObjectCard from '../components/ObjectCard';
import apiClient from '../api/client';
import { COLORS, commonStyles, objectsStyles as styles } from '../styles';

const ObjectsScreen = ({ navigation }) => {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState({
    country: '',
    developer: '',
    price_from: '',
    price_to: '',
    price_currency: 'THB',
    object_type: '',
    beach_distance_from: '',
    beach_distance_to: '',
    beach_distance_unit: 'Метров'
  });
  const [sortBy, setSortBy] = useState('default');
  // Добавляем состояние для отслеживания активных фильтров
  const [activeFilters, setActiveFilters] = useState({});
  const [activeSortBy, setActiveSortBy] = useState('default');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  useEffect(() => {
    loadObjects();
  }, []); // Убираем зависимости filters и sortBy

  const loadObjects = async (customFilters = null, customSortBy = null, customSearchQuery = null) => {
    try {
      setLoading(true);
      const params = {
        ...(customFilters || activeFilters),
        sort_by: customSortBy || activeSortBy
      };
      
      // Добавляем поисковый запрос если есть
      const searchText = customSearchQuery !== null ? customSearchQuery : activeSearchQuery;
      if (searchText.trim()) {
        params.name = searchText.trim();
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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadObjects();
    setRefreshing(false);
  };

  const handleToggleFavourite = async (objectId) => {
    try {
      const response = await apiClient.toggleFavourite(objectId);
      
      // Обновляем состояние объекта в списке
      setObjects(prevObjects => 
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

  const clearFilters = () => {
    setFilters({
      country: '',
      developer: '',
      price_from: '',
      price_to: '',
      price_currency: 'THB',
      object_type: '',
      beach_distance_from: '',
      beach_distance_to: '',
      beach_distance_unit: 'Метров'
    });
    setSearchQuery('');
    // Очищаем активные фильтры и перезагружаем данные
    setActiveFilters({});
    setActiveSortBy('default');
    setActiveSearchQuery('');
    loadObjects({}, 'default', '');
  };

  // Функция для выполнения поиска
  const performSearch = () => {
    setActiveFilters(filters);
    setActiveSortBy(sortBy);
    setActiveSearchQuery(searchQuery);
    loadObjects(filters, sortBy, searchQuery);
  };

  const renderObjectCard = ({ item }) => (
    <ObjectCard
      object={item}
      onPress={(object) => navigation.navigate('ObjectDetail', { objectId: object.id })}
      onToggleFavourite={handleToggleFavourite}
      showFavouriteButton={true}
    />
  );

  const renderSearchForm = () => {
    if (!showSearch) return null;
    
    return (
      <View style={styles.estateSearch}>
        <Text style={styles.estateSearchTitle}>Поиск недвижимости</Text>
        
        <View style={styles.estateSearchFormItems}>
          {/* Местонахождение объекта */}
          <View style={styles.estateSearchFormItem}>
            <Text style={styles.estateSearchFormItemSubtitle}>Местонахождение объекта</Text>
            <TextInput
              style={styles.input}
              placeholder="Введите страну или регион"
              value={filters.country}
              onChangeText={(text) => setFilters(prev => ({ ...prev, country: text }))}
            />
          </View>

          {/* Поиск по названию */}
          <View style={styles.estateSearchFormItem}>
            <Text style={styles.estateSearchFormItemSubtitle}>Поиск по названию</Text>
            <TextInput
              style={styles.input}
              placeholder="Введите название объекта"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Расширенные поля поиска */}
          {showAdvancedSearch && (
            <>
              {/* Поиск по названию застройщика */}
              <View style={styles.estateSearchFormItem}>
                <Text style={styles.estateSearchFormItemSubtitle}>Поиск по названию застройщика</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Введите название застройщика"
                  value={filters.developer}
                  onChangeText={(text) => setFilters(prev => ({ ...prev, developer: text }))}
                />
              </View>

              {/* Цена */}
              <View style={styles.estateSearchFormItem}>
                <Text style={styles.estateSearchFormItemSubtitle}>Цена</Text>
                <View style={styles.estateSearchFormItemPrice}>
                  <TextInput
                    style={[styles.input, styles.priceInput]}
                    placeholder="От"
                    value={filters.price_from}
                    onChangeText={(text) => setFilters(prev => ({ ...prev, price_from: text }))}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.input, styles.priceInput]}
                    placeholder="До"
                    value={filters.price_to}
                    onChangeText={(text) => setFilters(prev => ({ ...prev, price_to: text }))}
                    keyboardType="numeric"
                  />
                  <View style={styles.searchDropdown}>
                    <TouchableOpacity style={styles.searchDropdownButtonWrapper}>
                      <Text style={styles.searchDropdownButton}>{filters.price_currency}</Text>
                      <Ionicons name="chevron-down" size={16} color={COLORS.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Тип объекта */}
              <View style={styles.estateSearchFormItem}>
                <Text style={styles.estateSearchFormItemSubtitle}>Тип объекта</Text>
                <View style={styles.searchDropdown}>
                  <TouchableOpacity style={styles.searchDropdownButtonWrapper}>
                    <Text style={styles.searchDropdownButton}>
                      {filters.object_type || '- выберите -'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={COLORS.text} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* До пляжа */}
              <View style={styles.estateSearchFormItem}>
                <Text style={styles.estateSearchFormItemSubtitle}>До пляжа</Text>
                <View style={styles.estateSearchFormItemPrice}>
                  <TextInput
                    style={[styles.input, styles.priceInput]}
                    placeholder="От"
                    value={filters.beach_distance_from}
                    onChangeText={(text) => setFilters(prev => ({ ...prev, beach_distance_from: text }))}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.input, styles.priceInput]}
                    placeholder="До"
                    value={filters.beach_distance_to}
                    onChangeText={(text) => setFilters(prev => ({ ...prev, beach_distance_to: text }))}
                    keyboardType="numeric"
                  />
                  <View style={styles.searchDropdown}>
                    <TouchableOpacity style={styles.searchDropdownButtonWrapper}>
                      <Text style={styles.searchDropdownButton}>{filters.beach_distance_unit}</Text>
                      <Ionicons name="chevron-down" size={16} color={COLORS.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>

        <View style={styles.estateSearchFormActions}>
          <TouchableOpacity 
            style={styles.estateSearchAdvancedOpen}
            onPress={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            <Ionicons 
              name={showAdvancedSearch ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={COLORS.primary} 
            />
            <Text style={styles.estateSearchAdvancedOpenText}>
              {showAdvancedSearch ? 'Компактный поиск' : 'Расширенный поиск'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.estateSearchFormActionsButtons}>
            <TouchableOpacity 
              style={styles.platformButtonOne}
              onPress={performSearch}
            >
              <Text style={styles.platformButtonOneText}>Найти</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.platformButtonTwo}
              onPress={clearFilters}
            >
              <Text style={styles.platformButtonTwoText}>Очистить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderActionBar = () => (
    <View style={styles.actionBar}>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => setShowSearch(!showSearch)}
      >
        <Ionicons 
          name={showSearch ? "close" : "search"} 
          size={20} 
          color={COLORS.primary} 
        />
        <Text style={styles.actionButtonText}>
          {showSearch ? 'Закрыть' : 'Поиск'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => {
          const sortOptions = ['default', 'alphabet', 'region'];
          const currentIndex = sortOptions.indexOf(sortBy);
          const nextIndex = (currentIndex + 1) % sortOptions.length;
          const newSortBy = sortOptions[nextIndex];
          setSortBy(newSortBy);
          // Обновляем активную сортировку и перезагружаем данные
          setActiveSortBy(newSortBy);
          loadObjects(activeFilters, newSortBy, activeSearchQuery);
        }}
      >
        <Ionicons name="swap-vertical" size={20} color={COLORS.primary} />
        <Text style={styles.actionButtonText}>
          {sortBy === 'default' ? 'По умолчанию' : 
           sortBy === 'alphabet' ? 'По алфавиту' : 'По региону'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => {
          navigation.navigate('ObjectsMap', {
            filters: activeFilters,
            sortBy: activeSortBy,
            searchQuery: activeSearchQuery
          });
        }}
      >
        <Ionicons name="map" size={20} color={COLORS.primary} />
        <Text style={styles.actionButtonText}>На карте</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
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
        {renderSearchForm()}
        {renderActionBar()}
        
        <FlatList
          data={objects}
          renderItem={renderObjectCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.objectsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="home-outline" size={64} color={COLORS.gray} />
              <Text style={styles.emptyText}>Объекты не найдены</Text>
              <Text style={styles.emptySubtext}>
                Попробуйте изменить параметры поиска
              </Text>
            </View>
          }
        />
      </View>
      
      <BottomNavigation navigation={navigation} activeTab="view" />
    </View>
  );
};

export default ObjectsScreen;
