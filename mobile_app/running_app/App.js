import React, { createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';

import LoginScreen from './screens/LoginScreen';
import TabNavigation from './navigation/TabNavigation';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const { userData, setUserData } = useContext(UserContextProvider);

  return (
    <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRouteName}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="main" component={TabNavigation} />
          </Stack.Navigator>
        </NavigationContainer>
    </PaperProvider>
  );
}
