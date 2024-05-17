import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons from expo vector icons

import ChallengeRunScreen from '../screens/ChallengeRunScreen';
import MyActivityScreen from '../screens/MyActivityScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="ChallengeRunScreen"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Challenge Run') {
            iconName = focused ? 'directions-run' : 'directions-run';
          } else if (route.name === 'My Activity') {
            iconName = focused ? 'event' : 'event';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person';
          }

          // Return the appropriate icon component
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarOptions: {
          activeTintColor: 'lightgreen', // Change the active tab color here
          inactiveTintColor: 'gray', // Change the inactive tab color here
        },
        tabBarActiveBackgroundColor: 'lightgreen',
        tabBarStyle: {
          backgroundColor: 'darkgreen',
        },
        headerStyle: { backgroundColor: 'darkgreen', borderColor: 'darkgreen' },
      })
    }
    >
      <Tab.Screen name="Challenge Run" component={ChallengeRunScreen} />
      <Tab.Screen name="My Activity" component={MyActivityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

