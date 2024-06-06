import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_URL } from '../utils/settings';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InviteMembers = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [searchTerm, setSearchTerm] = useState('email');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (searchTerm === 'name') {
        const encodedFirstName = encodeURIComponent(searchValue);
        const encodedLastName = encodeURIComponent(searchValue2);
        url = `${API_URL}/api/users/search/?first_name=${encodedFirstName}&last_name=${encodedLastName}`
    } else {
        const encodedEmail = encodeURIComponent(searchValue);
        url = `${API_URL}/api/users/search/?email=${encodedEmail}`
    }
    AsyncStorage.getItem('MyAccessToken').then(accessToken => {
        axios.get(url, {
        headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then(response => {
            setSearchResults(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    });
  };

  const handleSearchTermChange = (selectedItem) => {
    setSearchTerm(selectedItem);
  };

  return (
    <View style={{flex: 1, justifyContent: 'flex-start', paddingTop: 50, backgroundColor: 'lightgreen'}}>
      <Picker
        selectedValue={searchTerm}
        onValueChange={handleSearchTermChange}
      >
        <Picker.Item label="Email" value="email" />
        <Picker.Item label="Name" value="name" />
      </Picker>
      {searchTerm === 'name' ? (
        <View>
          <TextInput
            value={searchValue}
            onChangeText={setSearchValue}
            placeholder="First Name"
            style={styles.inputLogin}
          />
          <TextInput
            value={searchValue}
            onChangeText={setSearchValue2}
            placeholder="Last Name"
            style={styles.inputLogin}
          />
        </View>
      ) : (
        <TextInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Email"
          style={styles.inputLogin}
        />
      )}
      <Button title="Search" onPress={handleSearch} />
      <Text style={styles.loginLabel}>Search Results:</Text>
      {searchResults.map(result => (
        <Text key={result.id}>{result.email}, {result.first_name} {result.last_name}</Text>
      ))}
      <Button title="Back to team page" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default InviteMembers;