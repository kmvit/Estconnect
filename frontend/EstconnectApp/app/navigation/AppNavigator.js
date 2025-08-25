import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ObjectsScreen from '../screens/ObjectsScreen';
import ObjectDetailScreen from '../screens/ObjectDetailScreen';
import ObjectsMapScreen from '../screens/ObjectsMapScreen';
import FinanceScreen from '../screens/FinanceScreen';
import CatalogScreen from '../screens/CatalogScreen';
import ProfileDetailScreen from '../screens/ProfileDetailScreen';
import SupportScreen from '../screens/SupportScreen';
import CreateTicketScreen from '../screens/CreateTicketScreen';
import TicketDetailScreen from '../screens/TicketDetailScreen';
import { COLORS } from '../styles/colors';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.white }
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Objects" component={ObjectsScreen} />
      <Stack.Screen name="ObjectDetail" component={ObjectDetailScreen} />
      <Stack.Screen name="ObjectsMap" component={ObjectsMapScreen} />
      <Stack.Screen name="Finance" component={FinanceScreen} />
      <Stack.Screen name="Catalog" component={CatalogScreen} />
      <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="CreateTicket" component={CreateTicketScreen} />
      <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
    </Stack.Navigator>
  );
}
