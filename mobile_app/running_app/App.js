import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screens/LoginScreen';
import TabNavigation from './navigation/TabNavigation';

const Stack = createStackNavigator();

const initialRouteName = "Login";

export default function App() {
  const getInitialRouteName = async () => {
    try {
      const value = await AsyncStorage.getItem('MyAccessToken');
      if (value !== null) {
        return 'main';
      }
    } catch (e) {
      // error reading value
    }
    return initialRouteName;
  }

  return (
    <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={getInitialRouteName()}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="main" component={TabNavigation} />
          </Stack.Navigator>
        </NavigationContainer>
    </PaperProvider>
  );
}
