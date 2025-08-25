import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';
import FontLoader from './app/components/FontLoader';
import { COLORS } from './app/styles/colors';

export default function App() {
  return (
    <FontLoader>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
          <AppNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </FontLoader>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});