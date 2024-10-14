import React from 'react';
import { useEffect } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl, Modal, Dimensions, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowUpWideShort, faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';
import SwitchButton from '../components/switch_button';
import { useContext } from 'react';
import { UserContext } from '../utils/createContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { settings } from '../utils/settings';
import styles from '../styles';
import { sampleData } from '../utils/sample_data';
import { TeamScreen } from './TeamScreen';
import { CreateTeamScreen } from '../screens/CreateTeamScreen';
import { fetchStateChallenges, } from '../utils/api';
import { icon } from '@fortawesome/fontawesome-svg-core';


const ChallengeRunScreen = (navigation) => {
  const [teams, setTeams] = React.useState([]);
  const [newTeam, setNewTeam] = React.useState({});
  const [expandedTeam, setExpandedTeam] = React.useState(null);
  const { user, setUser } = useContext(UserContext);
  const [refreshingTeams, setRefreshingTeams] = React.useState(false);
  const [refreshingChallenges, setRefreshingChallenges] = React.useState(false);
  const [createModalVisible, setCreateModalVisible] = React.useState(false);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [challengeOrTeamSwtich, setChallengeOrTeamSwtich] = React.useState("Challenge");
  const [challenges, setChallenges] = React.useState([]);
  const [challengeOrder, setChallengeOrder] = React.useState("scoreDesc");

  
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

  const onRefreshTeams = React.useCallback(() => {
    setRefreshingTeams(true);
    fetchTeams()
    setRefreshingTeams(false)
  }, []);

  const onRefreshChallenges = React.useCallback(() => {
    setRefreshingChallenges(true);
    fetchStateChallenges(51, 0, true).then(challenges => setChallenges(challenges));
    setRefreshingChallenges(false);
  }, []);
  
  React.useEffect(() => {
    fetchTeams();
    fetchStateChallenges(51, 0, true).then(challenges => setChallenges(challenges));
  }, []);

  React.useEffect(() => {
    if (challengeOrder === "scoreDesc") {
      setChallenges(challenges.sort((a, b) => b.last_challenge_score - a.last_challenge_score));
    } else if (challengeOrder === "scoreAsc") {
      setChallenges(challenges.sort((a, b) => a.last_challenge_score - b.last_challenge_score));
    } else if (challengeOrder === "nameAsc") {
      setChallenges(challenges.sort((a, b) => a.name.localeCompare(b.name)));
    } else if (challengeOrder === "nameDesc") {
      setChallenges(challenges.sort((a, b) => b.name.localeCompare(a.name)));
    }
  }, [challengeOrder]);

  const onLeaving = (team_id) => {
    setTeams(teams.filter(team => team.id !== team_id))
  }

  React.useEffect(() => {
    if (challengeOrder === "scoreDesc") {
      setChallenges(challenges.sort((a, b) => b.last_challenge_score - a.last_challenge_score));
    } else if (challengeOrder === "scoreAsc") {
      setChallenges(challenges.sort((a, b) => a.last_challenge_score - b.last_challenge_score));
    } else if (challengeOrder === "nameAsc") {
      setChallenges(challenges.sort((a, b) => a.name.localeCompare(b.name)));
    } else if (challengeOrder === "nameDesc") {
      setChallenges(challenges.sort((a, b) => b.name.localeCompare(a.name)));
    }
  }, [challengeOrder]);

  const TeamListItemComponent = ({ item, index }) => {
    const isExpanded = item?.id === expandedTeam?.id;
    return (
      <View key={index} style={styles.listItem}>
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
          renderItem={TeamListItemComponent}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshingTeams} onRefresh={onRefreshTeams} />
          }
        />
      </View>
    );
  };

  const ChallengeListItemComponent = ({ challenge }) => {
      return (
        <View style={styles.listItem}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{challenge.title}</Text>
          <Text style={{ fontSize: 20 }}>{challenge.score ? challenge.score : '0'} points</Text>
          <Text>{(challenge.runs).length} Runs Completed</Text>
          {challenge.score ? <Text>{(challenge.runs).length / challenge.score} Average Points per run</Text> : null}
        </View>
      );
    };


  const ChallengeComponent = () => {
    return (
      <View style={{ flex: 1, width: '100%' }}>
        <View style={{ justifyContent: 'flex-start', margin: 10, flexDirection: 'row' }}>
          <Image 
            source={require('../assets/us-map.png')}
            style={{ width: 32, height: 32 }}
          />
          <Text style={styles.titleText}>State Challenges</Text>
          <Image 
            source={require('../assets/us-map.png')}
            style={{ width: 32, height: 32 }}
          />
          <Pressable 
            onPress={() => setChallengeOrder(challengeOrder === "sortAsc" ? "sortDesc" : "sortAsc")} 
            style={challengeOrder === "sortAsc" ? styles.iconStyleSelected : styles.iconStyle}
          >
            <FontAwesomeIcon icon={challengeOrder === "sortAsc" ? faArrowUpWideShort : faArrowDownWideShort} size={20} color="blue"/>
          </Pressable>
        </View>
        <FlatList
          data={challenges}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => {
            return (
              <ChallengeListItemComponent challenge={item} />
            )
          }}
          refreshControl={
            <RefreshControl refreshing={refreshingChallenges} onRefresh={onRefreshChallenges} />
          }
        />
      </View>
    );
  };
  
  return (
    <View style={{ flex: 1 , backgroundColor: 'lightgreen', justifyContent: 'flex-start'}}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', width: '100%', paddingTop: 10}}>
        <SwitchButton
          handleValueChange={(value) => setChallengeOrTeamSwtich(value)}
          switchWidth={Dimensions.get('window').width}
          switchBackgroundColor="green"
          switchBorderColor="blue"
          btnBorderColor="blue"
          btnBackgroundColor="blue"
          fontColor="lightyellow"
          text1 = 'Challenge'
          text2 = 'Teams'
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 20 }}>
          {
            challengeOrTeamSwtich === "Challenge" ? 
            <ChallengeComponent /> 
            : 
            <TeamsComponent teams={teams} />
          }
      </View>
      <Modal visible={createModalVisible} animationType="slide" styles={styles.modal} >
        <View style={styles.modal}>
          <CreateTeamScreen 
            team={newTeam}
            teams={teams}
            onHideModal={() => {setCreateModalVisible(false); setTimeout(() => {fetchTeams();}, 500)}} 
          />
        </View>
      </Modal>
      <Modal visible={editModalVisible} animationType="slide" styles={styles.modal}>
        <View style={styles.modal}>
          <TeamScreen 
            team={newTeam} 
            onSubmit={editTeams} 
            onCancel={() =>{setEditModalVisible(false); setTimeout(() => {fetchTeams();}, 500)}}
            onLeaving={() => {onLeaving()}}
          />
        </View>
      </Modal>
    </View>
  );
};

export default ChallengeRunScreen;
