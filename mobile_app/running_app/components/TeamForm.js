import { ScrollView, View, Text, Pressable, FlatList, Button, TextInput, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { settings } from '../utils/settings';
import styles from '../styles';
import { sampleData } from '../utils/sample_data';
import { v4 as uuidv4 } from 'uuid';
import { getUserDataFromAsyncStorage } from '../utils/AsyncStorageUtils';
import { useNavigation } from '@react-navigation/native';

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

export const TeamForm = ({ team, onSubmit, onCancel }) => {
  const [selectedSearch, setSelectedSearch] = useState('Email');
  const navigation = useNavigation();

  return (
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
  );
};
