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
import TextMessageComponent from '../components/textMessageComponent';
import InvitationMessageComponent from '../components/invitationMessageComponent';
import { markMessageRead } from '../utils/api';


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
    // console.log("Item: ", item)
    setSelectedMessage(item);
    setIndividualMessageModalShow(true);
    markMessageRead(item.id, user.id);
  }

  const renderMessage = ({ item }) => {
    // console.log("Item Flatlist: ", item);
    // if (item.read) {return (<></>)}
    if (item.message_type === "invitation") {
      return (
        <InvitationMessageComponent item={item} changeSelectedMessage={changeSelectedMessage} />
      );
    } else {
      return (
        <TextMessageComponent item={item} changeSelectedMessage={changeSelectedMessage} />
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
      />
    </View>
  );
};

export default MessageScreen;
