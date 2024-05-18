import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { settings } from './utils/settings';
import { styles } from './styles';

import LoginScreen from './screens/LoginScreen';
import PaymentScreen from './screens/PaymentScreen';
import TabNavigation from './navigation/TabNavigation';

const Stack = createStackNavigator();

const initialRouteName = "Login";

export default function App() {
  const getInitialRouteName = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('MyAccessToken');
      if (accessToken !== null) {
        try {
          const response = await axios({
            method: 'get',
            url: `${settings.MONGO_API_URL}/Users/${encodeURIComponent(username)}`,
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
        } catch (error) {
          if (error.response.status === 401) {
            return 'Login';
          } else {
            throw error;
          }
        }
        return 'main';
      }
    } catch (e) {
      // error reading value
    }
    return 'Login';
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          headerTintColor: 'black', 
          headerStyle: { backgroundColor: 'darkgreen' } 
        }}
        initialRouteName={settings.disable_auth ? 'main' : getInitialRouteName()} 
        styles={{styles}}
      >
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="main" component={TabNavigation}/>
        <Stack.Screen name="Payment" component={PaymentScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
