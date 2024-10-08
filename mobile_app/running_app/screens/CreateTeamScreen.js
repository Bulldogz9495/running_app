import { View, Text, Pressable } from 'react-native';
import styles from '../styles';
import { TeamInfoInput } from '../components/teamComponent';
import { createTeam } from '../utils/api';
import { useContext, useState } from 'react';
import { UserContext } from '../utils/createContext';
import { v4 as uuidv4 } from 'uuid';


export const formatCreateTeam = async (team, user) => {
    console.log("CREATING TEAM");
    const userInfo = user;
    team.members = [userInfo.id];
    team.owner = userInfo.id
    team.id = uuidv4();
    team.size = team.members.length;
    team.invitations = [];
    delete team.members_info;
    createTeam(team);
};


export const CreateTeamScreen = ({team, onHideModal, teams}) => {
    const { user, setUser } = useContext(UserContext);
    const [teamName, onChangeName] = useState(team.name);
    const [teamMotto, onChangeMotto] = useState(team.motto);
    return (
        <View>
            <Pressable style={styles.pressableArea} onPress={() => onHideModal()}>
                <Text style={styles.pressableText}>Go Back</Text>
            </Pressable>
            <TeamInfoInput team={team} onChangeName={onChangeName} onChangeMotto={onChangeMotto} />
            <Pressable style={styles.pressableArea} onPress={() => {formatCreateTeam({team, name: teamName, motto: teamMotto}, user); onHideModal()}}>
                <Text style={styles.pressableText}>Create Team</Text>
            </Pressable>
        </View>
    )
}