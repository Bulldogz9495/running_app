import React from 'react';
import { useEffect } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl, Modal } from 'react-native';
import { useContext } from 'react';
import { UserContext } from '../utils/createContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { settings } from '../utils/settings';
import styles from '../styles';
import { sampleData } from '../utils/sample_data';
import { TeamScreen } from './TeamScreen';
import { CreateTeamScreen } from '../screens/CreateTeamScreen';


const ChallengeRunScreen = (navigation) => {
  const [teams, setTeams] = React.useState([]);
  const [newTeam, setNewTeam] = React.useState({});
  const [expandedTeam, setExpandedTeam] = React.useState(null);
  const { user, setUser } = useContext(UserContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const [createModalVisible, setCreateModalVisible] = React.useState(false);
  const [editModalVisible, setEditModalVisible] = React.useState(false);


  
  const fetchTeams = async () => {
    try {
      console.log("User Info from ChallengeRunScreen: ", user);
      const userInfo = user;
      console.log("USERINFO: ", userInfo);
      const accessToken = await AsyncStorage.getItem('MyAccessToken');
      const url = `${settings.MONGO_API_URL}/Teams/user_id/${encodeURIComponent(userInfo.id)}`;
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchTeams().then(() => setRefreshing(false));
  }, [fetchTeams]);
  
  React.useEffect(() => {
    fetchTeams();
  }, []);

  const renderTeam = ({ item, index }) => {
    const isExpanded = item?.id === expandedTeam?.id;
    return (
      <View key={index} style={{ borderWidth: 1, padding: 10, borderWidth: 2.0, borderColor: 'blue'  }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pressable onPress={() => setExpandedTeam(item)}>
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
              <Text>Team Size: {item.size}</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => {console.log("ITEM: ", item); setNewTeam(item); setEditModalVisible(true)}}>
            <Text>View Team</Text>
          </Pressable>
        </View>
        {isExpanded && (
          <FlatList
            data={item.members_info}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <Text key={index}>
                {expandedTeam.owner === item.id && <Text style={{fontWeight: 'bold'}}>Team Leader: </Text>}
                {item.first_name} {item.last_name}
              </Text>
            )}
          />
        )}
      </View>
    );
  };

const editTeams = async (team) => {
    console.log("Editing TEAM");
    console.log("NEW TEAM: ", team);
    delete team.members_info;
    const accessToken = await AsyncStorage.getItem('MyAccessToken');
    try {
        const res = await fetch(`${settings.MONGO_API_URL}/Teams/id/${team.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(team)
        });
        const data = await res.json();
        console.log(data);
        const newTeams = teams.map(t => t.id === data.id ? data : t);
        setTeams(newTeams);
        setEditModalVisible(false);
    } catch (error) {
        console.error(error);
    }
    setCreateTeam(false);
  };

  const TeamsComponent = ({ teams }) => {
    return (
      <View style={{ flex: 1 }}>
        <Pressable style={styles.pressableArea} onPress={() => setCreateModalVisible(true)}>
            <Text style={styles.pressableText}>Create New Team</Text>
        </Pressable>
        <FlatList
          data={teams}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderTeam}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    );
  };
  
  return (
    <View style={{ flex: 1 , backgroundColor: 'lightgreen'}}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ margin: 10, fontSize: 20 }}>Your teams</Text>
      </View>
      <View style={{ flex: 1 }}>
          <TeamsComponent teams={teams} />
      </View>
      <Modal visible={createModalVisible} animationType="slide" styles={styles.modal} >
        <View style={styles.modal}>
          <CreateTeamScreen 
            team={newTeam}
            teams={teams}
            onHideModal={() => setCreateModalVisible(false)}
          />
        </View>
      </Modal>
      <Modal visible={editModalVisible} animationType="slide" styles={styles.modal}>
        <View style={styles.modal}>
          <TeamScreen 
            team={newTeam} 
            onSubmit={editTeams} 
            onCancel={() =>setEditModalVisible(false)} 
          />
        </View>
      </Modal>
    </View>
  );
};

export default ChallengeRunScreen;
