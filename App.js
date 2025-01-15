import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './Screens/AuthScreen';
import FavoritesScreen from './Screens/FavoritesScreen';
import AddVideoScreen from './Screens/AddVideoScreen';
import VideoDetailsScreen from './Screens/VideoDetailsScreen';
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
            options={{ headerShown: false, animation: 'fade' }} 
          />
          <Stack.Screen 
            name="FavoritesScreen" 
            component={FavoritesScreen} 
            options={{ headerShown: false, animation: 'fade' }} 
          />
          <Stack.Screen 
            name="AddVideoScreen" 
            component={AddVideoScreen} 
            options={{ headerShown: false, animation: 'fade' }} 
          />
          <Stack.Screen 
            name="VideoDetailsScreen" 
            component={VideoDetailsScreen} 
            options={{ headerShown: false, animation: 'fade' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}


