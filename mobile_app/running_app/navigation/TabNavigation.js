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
import { getUserDataFromAsyncStorage } from '../utils/AsyncStorageUtils';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  const [messageCount, setMessageCount] = React.useState(0);
  const [userData, setUserData] = React.useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const getMessageCount = async () => {
      try {
        const userInfo = await getUserDataFromAsyncStorage();
        setUserData(userInfo.data);
        const accessToken = await AsyncStorage.getItem('MyAccessToken');
        if (accessToken !== null) {
          try {
            const response = await axios({
              method: 'get',
              url: `${settings.MONGO_API_URL}/Users/${encodeURIComponent(userInfo?.data.id)}/messages/count`,
              params: {
                read: false
              },
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            });
            setMessageCount(response.data.count);
          } catch (error) {
            if (error.response.status === 401) {
              navigation.navigate("Login");
            } else {
              throw error;
            }
          }
        }
      } catch (e) {
        // error reading value
      }
    }
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

