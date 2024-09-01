import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons from expo vector icons
import { useNavigation } from '@react-navigation/native';

import ChallengeRunScreen from '../screens/ChallengeRunScreen';
import MyActivityScreen from '../screens/MyActivityScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { View, TouchableOpacity } from 'react-native';
import { Badge } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { UserContext } from '../utils/createContext';
import { settings } from '../utils/settings';

import axios from 'axios';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  const [messageCount, setMessageCount] = React.useState(0);
  const { user, setUser } = useContext(UserContext);

  const navigation = useNavigation();

  const getMessageCount = async () => {
    const accessToken = await AsyncStorage.getItem('MyAccessToken');
    const response = await axios({
      method: 'get',
      url: `${settings.MONGO_API_URL}/Users/${encodeURIComponent(user.id)}/messages/count?read=false`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log("Message Count: ", response.data.count);
    setMessageCount(response.data.count);
  }

  // Fetch message count every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getMessageCount();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getMessageCount();
  }, []);

  return (
    <>
      <TouchableOpacity 
        style={{position: 'absolute', top: 50, right: 10, zIndex: 1, backgroundColor: 'lightgreen', padding: 5, borderRadius: 15}} 
        onPress={() => {console.log("Navigating to messages"); navigation.navigate("messages")}}
      >
          <FontAwesomeIcon icon={faInbox} size={32} color="blue" />
          {messageCount > 0 && <Badge value={messageCount} containerStyle={{position: 'absolute', top: 0, right: 0, zIndex: 1}}/>}
      </TouchableOpacity>
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
    </>
  );
}

