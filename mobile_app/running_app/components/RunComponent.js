import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { settings } from '../utils/settings';
import { getUserDataFromAsyncStorage } from '../utils/AsyncStorageUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default RunComponent = () => {
    const [runs, setRuns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const userData = await getUserDataFromAsyncStorage();
            const accessToken = await AsyncStorage.getItem('MyAccessToken');
            url = `${settings.MONGO_API_URL}/Runs/user_id/` + encodeURIComponent(userData?.data.id);
            const response = await axios.get(
                url=url,
                {
                    params: {
                        "skip": 0,
                        "limit": 10
                    },
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                }
            );
            setRuns(response.data);
            setLoading(false);
        })().catch(error => {
            console.log(error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{ fontSize: 25 }}>Run History</Text>
            {runs.map(run => (
                <View key={run.id} style={{ flexDirection: 'column', marginBottom: 20 }}>
                    <Text style={{ fontSize: 20 }}>Date: {new Date(run.start_datetime).toLocaleDateString()}</Text>
                    <Text style={{ fontSize: 20 }}>Score: {run.score}</Text>
                    <Text style={{ fontSize: 20 }}>Duration: {Math.round(run.duration / 60)} min
                        {run.duration > 0 && <Text> (Pace: {Math.round(run.distance)} miles at {run.pace} min/mile)</Text>}
                    </Text>
                    <Text style={{ fontSize: 20 }}>Distance: {Math.round(100*run.distance, 2)/100} miles</Text>
                </View>
            ))}
        </View>
    );
};


