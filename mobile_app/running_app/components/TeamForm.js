import { ScrollView, View, Text, Pressable, FlatList, Button, TextInput, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { UserContext } from '../utils/createContext';
import { leaveTeam } from '../utils/api';
import { TeamInfoInput, TeamInfo } from './teamComponent';



export const TeamForm = ({ team, onSubmit, onCancel, setEditTeam, teams, setTeams }) => {
  const [selectedSearch, setSelectedSearch] = useState('Email');
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);
  const owned = user.id === team.owner;

  return (
    <>
      {owned ? (
          <View>
            <Pressable style={styles.pressableArea} onPress={() => onCancel(navigation)}>
              <Text style={styles.pressableText}>Go Back</Text>
            </Pressable>
            <TeamInfoInput team={team} onChangeName={value => team=({...team, name: value})} onChangeMotto={value => team=({...team, motto: value})} />
            <Pressable style={styles.pressableArea} onPress={() => navigation.navigate('inviteMembers', { team_id: team.id, team_name: team.name })}>
              <Text style={styles.pressableText}>Invite New Team Members!</Text>
            </Pressable>
            <Pressable style={styles.pressableArea} onPress={() => onSubmit(team, navigation)}>
              <Text style={styles.pressableText}>Save Changes</Text>
            </Pressable>
          </View>
        ) : (
          <View>
            <Pressable style={styles.pressableArea} onPress={() => onCancel(navigation)}>
              <Text style={styles.pressableText}>Go Back</Text>
            </Pressable>
            <TeamInfo team={team} />
            <Pressable style={styles.pressableArea} onPress={() => userLeavesTeam(team.id, user.id, setEditTeam, teams, setTeams)}>
              <Text style={styles.pressableText}>Leave Team</Text>
            </Pressable>
          </View>
        )
      }
    </>
  );
};
