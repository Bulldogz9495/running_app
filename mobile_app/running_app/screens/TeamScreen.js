import { View, Text, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from '../styles';
import { useContext } from 'react';
import { UserContext } from '../utils/createContext';
import { TeamInfo, TeamInfoInput } from '../components/teamComponent';
import { useNavigation } from '@react-navigation/native';
import { leaveTeam, deleteTeam } from '../utils/api';


const TeamAsOwnerScreen = ({ team, onSubmit, onCancel}) => {
    const navigation = useNavigation();
    return (
        <>
            <View>
                <Pressable style={styles.pressableArea} onPress={() => onCancel(navigation)}>
                    <Text style={styles.pressableText}>Go Back</Text>
                </Pressable>
                <TeamInfoInput team={team} onChangeName={value => team=({...team, name: value})} onChangeMotto={value => team=({...team, motto: value})} />
                <Pressable style={styles.pressableArea} onPress={() => {onCancel(navigation); navigation.navigate('inviteMembers', { team_id: team.id, team_name: team.name });}}>
                    <Text style={styles.pressableText}>Invite New Team Members!</Text>
                </Pressable>
                <Pressable style={styles.pressableArea} onPress={() => onSubmit(team, navigation)}>
                    <Text style={styles.pressableText}>Save Changes</Text>
                </Pressable>
            </View>
            <View style={{ flex: 1 }}/>
            <View style={{bottom: 40}}>
                <Pressable style={styles.pressableArea} onPress={() => deleteTeam(team.id)}>
                    <Text style={styles.pressableText}>Delete Team</Text>
                </Pressable>
            </View>
        </>
    )
}

const userLeavesTeam = async (team_id, user_id, teams, setTeams) => {
    await leaveTeam(team_id, user_id);
    setTeams(teams.filter(team => team.id !== team_id));
  };

const TeamAsMemberScreen = ({ team, onCancel}) => {
    return (
        <View>
            <Pressable style={styles.pressableArea} onPress={() => onCancel(navigation)}>
                <Text style={styles.pressableText}>Go Back</Text>
            </Pressable>
            <TeamInfo team={team} />
            <Pressable style={styles.pressableArea} onPress={() => userLeavesTeam(team.id, user.id, teams, setTeams)}>
                <Text style={styles.pressableText}>Leave Team</Text>
            </Pressable>
        </View>
    )
}

export const TeamScreen = ({ team, onSubmit, onCancel}) => {
    const [owned, setOwned] = useState(false);
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        setOwned(user.id === team.owner);
    }, [user, team]);

    return (
        <>
            {
                owned ? (
                    TeamAsOwnerScreen({ team, onSubmit, onCancel })
                ) : (
                    TeamAsMemberScreen({ team, onCancel })
                )
            }
        </>
    );
};