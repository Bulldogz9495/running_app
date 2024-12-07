import { settings } from '../utils/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const leaveTeam = async (team_id, user_id) => {
    try {
        const response = await fetch(`${settings.MONGO_API_URL}/Teams/${team_id}/members/${user_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Error leaving team: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

export const createTeam = async (team) => {
    console.log("NEW TEAM: ", team);
    const accessToken = await AsyncStorage.getItem('MyAccessToken');
    try {
        const res = await fetch(`${settings.MONGO_API_URL}/Teams`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(team)
        });
        const data = await res.json();
        // console.log(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
}


export const deleteTeam = async (team_id) => {
    try {
        const accessToken = await AsyncStorage.getItem('MyAccessToken');
        const response = await fetch(`${settings.MONGO_API_URL}/Teams/${team_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Error deleting team: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
      console.error(error);
      throw error;
    }
}

export const fetchStateChallenges = async (offset, limit, active) => {
    try {
        const accessToken = await AsyncStorage.getItem('MyAccessToken');
        const urlParams = new URLSearchParams({
            offset: 0,
            limit: 100,
            active: true,
            include_runs: true,
            include_users: true
        });
        const response = await fetch(`${settings.MONGO_API_URL}/GeographicChallenges?${urlParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            data.map(challenge => {
                challenge.score = challenge.runs.reduce((total, run) => total + run?.score, 0);
            });
            data.sort((a, b) => b.score - a.score)
            return data;
        } else {
            throw new Error(`Error Getting Challenges: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
      console.error(error);
      throw error;
    }
}


export const fetchRun = async (run_id) => {
    try {
        const accessToken = await AsyncStorage.getItem('MyAccessToken');
        const url = `${settings.MONGO_API_URL}/Runs/${run_id}`
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        const data = await response.json();
        return data
    } catch (error) {
      console.error(error);
      throw error;
    }
}

export const acceptInvitation = async (team_id, invitation_id, accepted) => {
    try {
        const accessToken = await AsyncStorage.getItem('MyAccessToken');
        const response1 = await fetch(`${settings.MONGO_API_URL}/Teams/${item?.metadata?.team_id}/invitations/${item?.metadata?.invitation_id}?accepted=${accepted}`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
            },
        })
        return await response1.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
}

export const markMessageRead = async (message_id, user_id) => {
    try {
        const accessToken = await AsyncStorage.getItem('MyAccessToken');
        const response = await fetch(`${settings.MONGO_API_URL}/Users/${user_id}/messages/${message_id}?read=true`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
            }
        })
        return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
}