import React from 'react';
import { View, Text, Pressable, FlatList, Button, TextInput } from 'react-native';
import { getUserDataFromAsyncStorage } from '../utils/AsyncStorageUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { settings } from '../utils/settings';
import styles from '../styles';
import { sampleData } from '../utils/sample_data';
import { v4 as uuidv4 } from 'uuid';


const ChallengeRunScreen = () => {
  const [teams, setTeams] = React.useState([]);
  const [newTeam, setNewTeam] = React.useState({});
  const [expandedTeam, setExpandedTeam] = React.useState(null);
  const [createTeam, setCreateTeam] = React.useState(false);

  React.useEffect(() => {
    const fetchTeams = async () => {
      try {
        const userInfo = await getUserDataFromAsyncStorage();
        console.log("USERINFO: ", userInfo);
        const accessToken = await AsyncStorage.getItem('MyAccessToken');
        const url = `${settings.MONGO_API_URL}/Teams/user_id/${encodeURIComponent(userInfo?.data.id)}`;
        const response = await fetch(url,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        const data = await response.json();
        console.log("Teams Data: ", data);
        setTeams(data);
      } catch (error) {
        console.error(error);
        setTeams(sampleData.teams);
      }
    };
    fetchTeams();
  }, []);

  const renderTeam = ({ item, index }) => {
    const isExpanded = item._id === expandedTeam;

    return (
      <View key={index} style={{ borderWidth: 1, padding: 10, borderWidth: 2.0, borderColor: 'blue'  }}>
        <Pressable onPress={() => setExpandedTeam(isExpanded ? null : item._id)}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            {item.name}
          </Text>
          <Text>
            Team Motto: {item.motto}
          </Text>
          <Text>
            Last Challenge Score: {item.last_challenge_score}
          </Text>
          <Text>
            Last Challenge Date: {item.last_challenge_date}
          </Text>
          <View>
            <Text>Team Size: {item.members.length}</Text>
          </View>
        </Pressable>
        {isExpanded && (
          <FlatList
            data={item.members_info}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <Text key={index}>
                {item.first_name} {item.last_name}
              </Text>
            )}
          />
        )}
      </View>
    );
  };

  const createTeams = async () => {
    console.log("CREATING TEAM");
    const userInfo = await getUserDataFromAsyncStorage();
    newTeam.members = [];
    newTeam.owner = userInfo.data.id
    newTeam.id = uuidv4();
    newTeam.size = 0;
    console.log(newTeam);
    const accessToken = await AsyncStorage.getItem('MyAccessToken');
    try {
      const res = await fetch(`${settings.MONGO_API_URL}/Teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(newTeam)
      });
      const data = await res.json();
      console.log(data);
      setTeams([...teams, data]);
      setNewTeam({});
    } catch (error) {
      console.error(error);
    }
    setCreateTeam(false);
  };


  return (
    <View style={{ flex: 1 , backgroundColor: 'lightgreen'}}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ margin: 10, fontSize: 20 }}>Your teams</Text>
        <Button title={createTeam ? "View Teams" : "Create New Team"} onPress={() => setCreateTeam(prev => !prev)} color="blue"/>
      </View>
      {!createTeam ? (
      <FlatList
        data={teams}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTeam}
        style={{ flex: 1 }}
      />
      ) : (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ marginRight: 10 }}>Team Name</Text>
            <TextInput
              style={styles.teamInput}
              onChangeText={(text) => setNewTeam({...newTeam, name: text})}
              value={newTeam.name}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ marginRight: 10 }}>Motto</Text>
            <TextInput
              style={styles.teamInput}
              onChangeText={(text) => setNewTeam({...newTeam, motto: text})}
              value={newTeam.motto}
              multiline
              numberOfLines={3}
            />
          </View>
          <Button title="Create Team" onPress={createTeams} />
        </>
      )}
    </View>
  );
};

export default ChallengeRunScreen;
