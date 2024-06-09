import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const MessageScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = route.params.userId;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('MyAccessToken');
        const response = await axios.get(`${settings.MONGO_API_URL}/Messages/user_id/${userId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setMessages(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching messages');
        setLoading(false);
        console.error(error);
      }
    };
    fetchMessages();
  }, [userId]);

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
