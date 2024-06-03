import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { settings } from './utils/settings';
import { styles } from './styles';
import { View } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import PaymentScreen from './screens/PaymentScreen';
import TabNavigation from './navigation/TabNavigation';
import LoadingScreen from './screens/LoadingScreen';
import { ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

const initialRouteName = "Loading";

export default function App() {
  const [initialRoute, setInitialRoute] = useState(initialRouteName);

  useEffect(() => {
    const getInitialRoute = async () => {
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
              setInitialRoute('Login');
            } else {
              throw error;
            }
          }
          setInitialRoute('main');
        }
      } catch (e) {
        // error reading value
      }
      setInitialRoute('Login');
    }
    getInitialRoute();
  }, []);

  if (initialRoute === 'Loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          headerTintColor: 'black', 
          headerStyle: { backgroundColor: 'darkgreen' } 
        }}
        initialRouteName={initialRoute} 
        styles={{styles}}
      >
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="main" component={TabNavigation}/>
        <Stack.Screen name="payment" component={PaymentScreen}/>
        <Stack.Screen name="loading" component={LoadingScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

