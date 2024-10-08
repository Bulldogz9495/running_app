import { useContext } from 'react';
import { UserContext } from '../utils/createContext';
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
        console.log(data);
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
