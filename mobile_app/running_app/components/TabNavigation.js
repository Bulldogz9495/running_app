// TabNavigation.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons from expo vector icons

import ChallengeRunScreen from '../screens/ChallengeRunScreen';
import MyActivityScreen from '../screens/MyActivityScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabelStyle: { color: 'green' }, // Set the font color to green
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Challenge Run') {
            iconName = focused ? 'directions-run' : 'directions-run';
          } else if (route.name === 'My Activity') {
            iconName = focused ? 'event' : 'event';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person';
          }

          // Return the appropriate icon component with inline styles
          return (
            <MaterialIcons
              name={iconName}
              size={size}
              color={focused ? 'green' : 'gray'} // Change the color based on focus
              style={{ marginBottom: -3 }} // Adjust the icon position if needed
            />
          );
        },
      })}
    >
      <Tab.Screen name="Challenge Run" component={ChallengeRunScreen}/>
      <Tab.Screen name="My Activity" component={MyActivityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigation;
