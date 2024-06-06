import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_URL } from '../utils/settings';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';

const InviteMembers = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [searchTerm, setSearchTerm] = useState('email');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  const handleSearch = () => {
    if (searchTerm === 'name') {
        url = `${API_URL}/api/users/search/first_name/${searchValue}/last_name/${searchValue2}`
    } else {
        url = `${API_URL}/api/users/search/${searchTerm}/${searchValue}`
    }
    axios.get(url)
      .then(response => {
        setSearchResults(response.data);
      })
      .catch(error => {
        console.log(error);
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
          placeholder="Search"
          style={styles.inputLogin}
        />
      )}
      <Button title="Search" onPress={handleSearch} />
      <Text>Search Results:</Text>
      {searchResults.map(result => (
        <Text key={result.id}>{result.email}, {result.first_name} {result.last_name}</Text>
      ))}
      <Button title="Back to team page" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default InviteMembers;