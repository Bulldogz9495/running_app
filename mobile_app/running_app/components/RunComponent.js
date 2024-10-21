import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, RefreshControl, Pressable } from 'react-native';
import { settings } from '../utils/settings';
import { useContext } from 'react';
import { UserContext } from '../utils/createContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { sampleData } from '../utils/sample_data';
import moment from 'moment';
import { DisplayTime } from './displayTime';
import { useNavigation } from '@react-navigation/native';



export const RunComponent = ({ navigation, run }) => {
    return (
        <View key={run.id} style={ styles.listItem }>
            <Pressable onPress={() => navigation.navigate('run', { run: run })}>
                <Text style={{ fontSize: 20 }}>Score: {run.score.toFixed(1)}</Text>
                <Text style={{ fontSize: 20 }}>Distance: {run.distance.toFixed(1)} miles</Text>
                <Text style={{ fontSize: 20 }}>Duration: {Math.round(run.duration / 60)} min
                    {run.duration > 0 && <Text> ({Math.round(run.distance)} miles at {<DisplayTime totalTimeSeconds={run.pace*60} additionalStyles={{fontSize: 20, fontWeight: 'normal'}}/>} min/mile)</Text>}
                </Text>
                <Text style={{ fontSize: 20 }}>Date: {moment(run.start_datetime).format('l')}</Text>
            </Pressable>
        </View>
    )
}

export const UserRunComponent = () => {
    const [runs, setRuns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const { user, setUser } = useContext(UserContext);
    const navigation = useNavigation();

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchRuns().then(() => setRefreshing(false));
    }, [fetchRuns]);

    const fetchRuns = async () => {
        const userData = user;
        const accessToken = await AsyncStorage.getItem('MyAccessToken');
        url = `${settings.MONGO_API_URL}/Runs/user_id/` + encodeURIComponent(userData.id);
        try {
            const response = await axios.get(
                url=url,
                {
                    params: {
                        "skip": 0,
                        "limit": 10,
                        "include_geopoints": false,
                        "sort_datetime": 'desc',
                    },
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                }
            );
            console.log("Runs Data: ", response.data);
            setRuns(response.data);
        } catch (error) {
            console.log(error);
            setRuns(sampleData.runs);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRuns();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView 
            style={{ flex: 1, flexDirection: 'column' }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Text style={styles.titleText}>Run History</Text>
            {runs.map(run => ( <RunComponent navigation={navigation} run={run} key={run.id} />))}
        </ScrollView>
    );
};
