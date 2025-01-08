import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { settings } from '../utils/settings';
import { useContext } from 'react';
import { UserContext } from '../utils/createContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking  from 'expo-linking';

export default function InvitationScreen({ navigation }) {
    const [team, setTeam] = useState([]);
    const [user, setUser] = useContext(UserContext);

  function splitUrlParams(url) {
    parts = url.replace(/:/g, '').split('/');
    const inviter_id = parts[0];
    const team_id = parts[1];
    const invitation_id = parts[2];
    return { inviter_id, team_id, invitation_id };
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = await Linking.getInitialURL();
        console.log("url: ", url);
        const params = Linking.parse(url);
        const { inviter_id, team_id } = splitUrlParams(params.path);
        const userInfo = user;
        // console.log("USERINFO: ", userInfo);
        const accessToken = await AsyncStorage.getItem('MyAccessToken');
        const response = await axios.get(`${settings.MONGO_API_URL}/Teams/${team_id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        console.log("Team Data: ", response.data);
        setTeam(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const goHome = () => {
    navigation.navigate('main');
  };

  const confirmInvitation = async () => {
    try {
      console.log("CONFIRMING INVITATION");
      const accessToken = await AsyncStorage.getItem('MyAccessToken');
      await axios.patch(
        `${settings.MONGO_API_URL}/Teams/${team_id}/invitations/${invitation_id}`,
        {
          "user_id": userInfo.id,
          "accepted": true
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      navigation.navigate('ChallengeRunScreen');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'left', justifyContent: 'space-between', backgroundColor: 'lightgreen', paddingTop: 60, paddingBottom: 60, padding: 20 }}>
        <Text style={styles.loginLabel}>
            {team.name}
        </Text>
        <Text style={styles.userText}>
            Team Motto: {team.motto}
        </Text>
        <Text style={styles.userText}>
            Last Challenge Score: {team.last_challenge_score}
        </Text>
        <Text style={styles.userText}>
            Last Challenge Date: {team.last_challenge_date}
        </Text>
        <View style={{paddingBottom:20}}>
            <Text style={styles.userText}>Team Size: {team.size}</Text>
        </View>
        <Text style={styles.loginLabel}>Members:</Text>
        <FlatList
            data={team?.members_info}
            keyExtractor={(item) => item?.email}
            renderItem={({ item }) => <Text style={{ marginVertical: 4 }}>{item?.first_name} {item?.last_name}</Text>}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
            <Button title="Join Team" onPress={confirmInvitation} color='blue'/>
            <Button title="Go Home" onPress={goHome} color='blue'/>
        </View>
    </View>
  );
}
