import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FavouriteButton from './FavouriteButton';
import { COLORS, objectCardStyles as styles } from '../styles';

const { width } = Dimensions.get('window');

const ObjectCard = ({ 
  object, 
  onPress, 
  onToggleFavourite, 
  showFavouriteButton = true,
  compact = false 
}) => {
  const getFirstImage = () => {
    if (object.images && object.images.length > 0) {
      return object.images[0].image_url || object.images[0].image;
    }
    return require('../../assets/images/placeholder-img.png');
  };

  const formatPrice = (price, currency = 'THB') => {
    if (!price) return 'Цена не указана';
    return `${price} ${currency}/м²`;
  };

  const formatCompletionDate = (date) => {
    if (!date) return 'Не указан';
    return new Date(date).getFullYear().toString();
  };

  const formatLocation = () => {
    if (object.address) {
      return object.address;
    }
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

  const handleFavouritePress = () => {
    if (onToggleFavourite) {
      onToggleFavourite(object.id);
    }
  };

  const cardStyle = compact ? { width: width * 0.8 } : {};

  return (
    <TouchableOpacity 
      style={[styles.card, cardStyle]}
      onPress={() => onPress && onPress(object)}
    >
      <View style={styles.cardImage}>
        <Image
          source={typeof getFirstImage() === 'string' ? { uri: getFirstImage() } : getFirstImage()}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Счетчик фотографий */}
        {object.images && object.images.length > 0 && (
          <View style={styles.photoCount}>
            <Ionicons name="camera" size={16} color="#000" />
            <Text style={styles.photoCountText}>{object.images.length}</Text>
          </View>
        )}

        {/* Кнопка избранного */}
        {showFavouriteButton && (
          <FavouriteButton
            isFavourite={object.is_favourite}
            onPress={handleFavouritePress}
          />
        )}
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>
          {object.name}
        </Text>
        
        <View style={styles.location}>
          <Ionicons name="location" size={16} color={COLORS.breadcrumbs} />
          <Text style={styles.locationText} numberOfLines={1}>
            {formatLocation()}
          </Text>
        </View>
        
        <Text style={styles.price}>
          {formatPrice(object.price_per_sqm)}
        </Text>
        
        <View style={styles.info}>
          <View style={styles.infoItem}>
            <Ionicons name="key" size={16} color="#000" />
            <Text style={styles.infoText}>
              {formatCompletionDate(object.completion_date)}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="business" size={16} color="#000" />
            <Text style={styles.infoText}>
              {object.floors || 'Не указано'}
            </Text>
          </View>
        </View>
        
        {object.description && (
          <Text style={styles.description} numberOfLines={3}>
            {object.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ObjectCard;
