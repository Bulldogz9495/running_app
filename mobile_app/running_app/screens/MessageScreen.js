import React, { useState, useEffect } from 'react';
import { View, Text, Modal, FlatList, ActivityIndicator, Pressable, Button } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { UserContext } from '../utils/createContext';
import { settings } from '../utils/settings';
import styles from '../styles';
import { useFocusEffect } from '@react-navigation/native';
import { formatDate } from '../utils/display_utils';
import IndividualMessageModal from '../components/individualMessageModal';


const MessageScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [individualMessageModalShow, setIndividualMessageModalShow] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState({});
  const { user } = useContext(UserContext);


  const fetchMessages = async () => {
    try {
      const userInfo = user;
      const accessToken = await AsyncStorage.getItem('MyAccessToken');
      const response = await fetch(`${settings.MONGO_API_URL}/Users/${userInfo.id}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const responseData = await response.json();
      setMessages(responseData);
      setLoading(false);
    } catch (error) {
      setError('Error fetching messages');
      setLoading(false);
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Rerender the page when it comes into focus
      fetchMessages(); // or any other action you want to perform
    }, [])
  );

  useEffect(() => {
    fetchMessages();
  }, []);

  const changeSelectedMessage = (item) => {
    console.log("Item: ", item)
    setSelectedMessage(item);
    setIndividualMessageModalShow(true);
  }


  const acceptInvitation = async (item, accepted) => {
    try {
      const userInfo = user;
      const accessToken = await AsyncStorage.getItem('MyAccessToken');
      const response1 = await fetch(`${settings.MONGO_API_URL}/Teams/${item?.metadata?.team_id}/invitations/${item?.metadata?.invitation_id}?accepted=${accepted}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })
      const response2 = await fetch(`${settings.MONGO_API_URL}/Users/${userInfo.id}/messages/${item.id}?read=true`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const responseData = await response2.json();
      setMessages(prevMessages => prevMessages.map(message => {
        if (message.id === item.id) {
          return {...message, "read": true}; // Update with the new data
        }
        return message; // Return unchanged items
      }));
      console.log(responseData);
      navigation.navigate('Challenge Run');
    } catch (error) {
      console.error(error);
    }
  };

  const renderMessage = ({ item }) => {
    const date = new Date(item.updated);
    const formattedDate = formatDate(date);
    if (item.read) {return (<></>)}
    if (item.message_type === "invitation") {
      return (
        <Pressable onPress={() => changeSelectedMessage(item)}>
          <View style={styles.message}>
            <Text>Invitation from {item.metadata.user_name}</Text>
            <Text>Join {item.metadata.team_name}</Text>
            <Button title="Accept Invitation" onPress={() => acceptInvitation(item, true)} />
            <Button title="Deny Invitation" onPress={() => acceptInvitation(item, false)} />
            <Text>Sent: {formattedDate}</Text>
          </View>
        </Pressable>
      );
    } else {
      return (
        <Pressable onPress={() => changeSelectedMessage(item)}>
          <View style={styles.message}>
            <Text>{item.message}</Text>
            <Text>Sent: {formattedDate}</Text>
          </View>
        </Pressable>
      );
    };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Pressable style={styles.pressableArea} onPress={() => navigation.goBack()}>
          <Text style={styles.pressableText}>Go Back</Text>
        </Pressable>
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
      />
      <IndividualMessageModal 
        selectedMessage={selectedMessage} 
        individualMessageModalShow={individualMessageModalShow} 
        setIndividualMessageModalShow={setIndividualMessageModalShow}
        acceptInvitation={acceptInvitation}
      />
    </View>
  );
};

export default MessageScreen;
