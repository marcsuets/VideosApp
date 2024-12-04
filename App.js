import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './Screens/AuthScreen';
import FavoritesScreen from './Screens/FavoritesScreen';
import AddVideoScreen from './Screens/AddVideoScreen';
import { AuthProvider } from './AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="AuthScreen">
          <Stack.Screen 
            name="AuthScreen" 
            component={AuthScreen} 
            options={{ headerShown: false, animation: 'none' }} 
          />
          <Stack.Screen 
            name="FavoritesScreen" 
            component={FavoritesScreen} 
            options={{ headerShown: false, animation: 'none' }} 
          />
          <Stack.Screen 
            name="AddVideoScreen" 
            component={AddVideoScreen} 
            options={{ headerShown: false, animation: 'none' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}


