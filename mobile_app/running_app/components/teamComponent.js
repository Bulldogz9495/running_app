import { View, Text, TextInput } from 'react-native';
import styles from '../styles';


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


export const TeamInfoInput = ({ team, onChangeName, onChangeMotto }) => (
    <View>
      <TeamInput
        label="Team Name"
        defaultValue={team.name}
        onChangeText={onChangeName}
      />
      <TeamInput
        label="Motto"
        defaultValue={team.motto}
        onChangeText={onChangeMotto}
      />
    </View>
  );

export const TeamInfo = ({ team }) => (
    <View>
      <Text style={styles.teamInfoText}>Team Name: {team.name}</Text>
      <Text style={styles.teamInfoText}>Motto: {team.motto}</Text>
    </View>
  );