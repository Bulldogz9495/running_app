import { ScrollView, View, Text, Pressable, FlatList, Button, TextInput, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { UserContext } from '../utils/createContext';
import { settings } from '../utils/settings';

const TeamInput = ({ label, defaultValue, onChangeText}) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ marginRight: 10 }}>{label}</Text>
      <TextInput
        style={styles.teamInput}
        onChangeText={onChangeText}
        defaultValue={defaultValue}
      />
    </View>
  );

const leaveTeam = async (team_id, user_id) => {
  const response = await fetch(`${settings.MONGO_API_URL}/Teams/${team_id}/members/${user_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const data = await response.json();
  console.log(data);
  navigation.goBack();
};

export const TeamForm = ({ team, onSubmit, onCancel }) => {
  const [selectedSearch, setSelectedSearch] = useState('Email');
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);
  const owned = user.id === team.owner;

  return (
    <>
      {owned ? (
          <View>
            <TeamInput
              label="Team Name"
              defaultValue={team.name}
              onChangeText={value => team=({...team, name: value})}
            />
            <TeamInput label="Motto" defaultValue={team.motto} onChangeText={value => team=({...team, motto: value})} />
            <Button title="Invite New Team Members!" style={{fontSize: 20}} color="blue" onPress={() => navigation.navigate('inviteMembers', { team_id: team.id, team_name: team.name })}></Button>
            <Button title="Save Team" onPress={() => onSubmit(team, navigation)} color="blue"/>
            <Button title="Cancel" onPress={() => onCancel(navigation)} color="red"/>
          </View>
        ) : (
          <View>
            <Pressable style={styles.pressableArea} onPress={() => onCancel(navigation)}>
              <Text style={styles.pressableText}>Go Back</Text>
            </Pressable>
            <Text style={styles.userProfileInfo}>Team: {team.name}</Text>
            <Text style={styles.userProfileInfo}>Motto: {team.motto}</Text>
            <Pressable style={styles.pressableArea} onPress={() => leaveTeam(team.id, user.id)}>
              <Text style={styles.pressableText}>Leave Team</Text>
            </Pressable>
          </View>
        )
      }
    </>
  );
};
