import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';

import TabNavigation from './navigation/TabNavigation';
import { UserProvider } from './navigation/userContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider>
      <UserProvider>
        <NavigationContainer>
          <TabNavigation />
        </NavigationContainer>
      </UserProvider>
    </PaperProvider>
  );
}
