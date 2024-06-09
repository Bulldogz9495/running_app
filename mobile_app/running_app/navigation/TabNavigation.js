import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons from expo vector icons

import ChallengeRunScreen from '../screens/ChallengeRunScreen';
import MyActivityScreen from '../screens/MyActivityScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { View } from 'react-native';
import { Badge } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  const [messageCount, setMessageCount] = React.useState(0);

  useEffect(() => {
    const getMessageCount = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('MyAccessToken');
        if (accessToken !== null) {
          try {
            const response = await axios({
              method: 'get',
              url: `${settings.MONGO_API_URL}/Users/messages/count`,
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            });
            setMessageCount(response.data.count);
          } catch (error) {
            if (error.response.status === 401) {
              NavigationActions.navigate("Login");
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
      <View style={{position: 'absolute', top: 50, right: 10, zIndex: 1}}>
          <FontAwesomeIcon icon={faInbox} size={36} color="blue" onPress={() => NavigationActions.navigate("messages")}/>
          {messageCount > 0 && <Badge value={messageCount} containerStyle={{position: 'absolute', top: 0, right: 0, zIndex: 1}}/>}
        </View>
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

