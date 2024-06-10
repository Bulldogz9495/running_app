import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserDataFromAsyncStorage } from '../utils/AsyncStorageUtils';
import { settings } from '../utils/settings';

const MessageScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(async () => {
    const userInfo = await getUserDataFromAsyncStorage();
    const fetchMessages = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('MyAccessToken');
        const response = await fetch(`${settings.MONGO_API_URL}/user_id/${userInfo.data.id}/messages`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        response = await response.json();
        setMessages(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching messages');
        setLoading(false);
        console.error(error);
      }
    };
    fetchMessages();
  }, []);

  const renderMessage = ({ item }) => (
    <View style={styles.message}>
      <Text>{item.text}</Text>
    </View>
  );

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
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginVertical: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default MessageScreen;
