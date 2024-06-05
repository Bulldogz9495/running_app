import { View, Text, Pressable, FlatList, Button, TextInput } from 'react-native';
import { settings } from '../utils/settings';
import styles from '../styles';
import { sampleData } from '../utils/sample_data';
import { v4 as uuidv4 } from 'uuid';
import { getUserDataFromAsyncStorage } from '../utils/AsyncStorageUtils';


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

export const TeamForm = ({ team, onSubmit, onCancel }) => (
    <View>
        <TeamInput
        label="Team Name"
        defaultValue={team.name}
        onChangeText={value => {
            console.log("Team name changed to: ", value);
            team=({...team, name: value})
        }}
        />
        <TeamInput label="Motto" defaultValue={team.motto} onChangeText={value => team=({...team, motto: value})} />
        <Button title="Save Team" onPress={() => onSubmit(team)} />
        <Button title="Cancel" onPress={onCancel} />
    </View>
);

