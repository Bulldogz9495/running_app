import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { settings } from '../utils/settings';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserDataFromAsyncStorage } from '../utils/AsyncStorageUtils';
import { v4 as uuidv4 } from 'uuid';


const InviteMembersScreen = ( route ) => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('email');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  const handleSearch = async () => {
    const urlParams = new URLSearchParams();
    if (searchTerm === 'name') {
        urlParams.append('first_name', first_name);
        urlParams.append('last_name', last_name);
    } else {
        urlParams.append('email', email);
    }
    const url = `${settings.MONGO_API_URL}/search/Users?${urlParams.toString()}`;
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

    {/* Handle invitation logic */}
    {/* TODO: Pass the user id and team id to the server to create an invitation */}
    {/* TODO: Display a success message if the invitation is successful */}
    {/* TODO: Display an error message if the invitation fails */}
    {/* TODO: Clear the search results after invitation is sent */}
    {/* TODO: Clear the search inputs */}

    {/* Helper function to handle invitation */}
    const handleInvite = async (user) => {
    try {
        const invitation_id = uuidv4();
        const accessToken = await AsyncStorage.getItem('MyAccessToken');
        const userInfo = await getUserDataFromAsyncStorage();
        const teamId = route?.route?.params?.team_id;
        const encodedInvitationId = encodeURIComponent(invitation_id);
        const response1 = await axios.post(`${settings.MONGO_API_URL}/Teams/${teamId}/invitations/${user.id}?invitation_id=${encodedInvitationId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        console.log(response1.data);
        const userIdent = (userInfo.data?.last_name !== undefined) ? (userInfo.data?.first_name + " " + userInfo.data?.last_name) : (userInfo.data?.email);
        const response2 = await axios.post(`${settings.MONGO_API_URL}/Users/${user.id}/messages`,  {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            data: JSON.stringify({
                "id": uuidv4(),
                "created_by": userInfo.data.id,
                "message": "You are invited to join team " + route?.route?.params?.team_name + " by " + userIdent,
                "created": new Date().toISOString(),
                "updated": new Date().toISOString(),
                "read": true,
                "message_type": "invitation",
                "metadata": {
                  "team_id": route?.route?.params?.team_id, 
                  "team_name": route?.route?.params?.team_name,
                  "user_id": userInfo.data?.id, 
                  "user_email": userInfo.data?.id,
                  "user_name": userIdent,
                  "invitation_id": invitation_id
                }
            })
        })
        console.log(response2.data);
        setSearchResults([]);
        setFirstName('');
        setLastName('');
        setEmail('');
    } catch (error) {
        console.log(error);
    }
    }

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
            value={first_name}
            onChangeText={setFirstName}
            placeholder="First Name"
            style={styles.inputLogin}
          />
          <TextInput
            value={last_name}
            onChangeText={setLastName}
            placeholder="Last Name"
            style={styles.inputLogin}
          />
        </View>
      ) : (
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          style={styles.inputLogin}
        />
      )}
      <Button title="Search" onPress={handleSearch} />
      <Text style={styles.loginLabel}>Search Results:</Text>
      {searchResults.map(result => (
        <View key={result.id} style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>{result.email} - {result.first_name} {result.last_name}</Text>
          <TouchableOpacity onPress={() => handleInvite(result)} style={{marginLeft: 10}} color="blue">
            <Text style={{color: 'blue'}}>Invite</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button title="Back to team page" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default InviteMembersScreen;