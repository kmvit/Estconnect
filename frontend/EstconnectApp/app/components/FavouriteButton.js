import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { StyleSheet } from 'react-native';

const FavouriteButton = ({ isFavourite, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.favouriteButton, style]}
      onPress={onPress}
    >
      <Image
        source={
          isFavourite
            ? require('../../assets/icons/favourites-icon.png')
            : require('../../assets/icons/favourites-icon-outline.png')
        }
        style={styles.favouriteIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  favouriteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 2,
    width: 32,
    height: 28,
  },
  favouriteIcon: {
    width: '100%',
    height: '100%',
  },
});

export default FavouriteButton;
