import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserDataFromAsyncStorage } from '../utils/AsyncStorageUtils';
import { settings } from '../utils/settings';
import styles from '../styles';

const MessageScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
      const fetchMessages = async () => {
        try {
          const userInfo = await getUserDataFromAsyncStorage();
          const accessToken = await AsyncStorage.getItem('MyAccessToken');
          const response = await fetch(`${settings.MONGO_API_URL}/Users/${userInfo.data.id}/messages`, {
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
      fetchMessages();
    }, []);

  const renderMessage = ({ item }) => {
    const date = new Date(item.updated);
    const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()} @ ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
    if (item.message_type === "invitation") {
      return (
        <View style={styles.message}>
          <Text>Invitation from {item.sender_name}</Text>
          <Text>Join {item.group_name}</Text>
          <Button title="Accept Invitation" onPress={() => acceptInvitation(item)} />
          <Text>Sent: {formattedDate}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.message}>
          <Text>{item.message}</Text>
          <Text>Sent: {formattedDate}</Text>
        </View>
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
    </View>
  );
};

export default MessageScreen;
