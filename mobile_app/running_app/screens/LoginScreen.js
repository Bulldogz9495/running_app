// src/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { settings } from '../utils/settings';
import { setUserDataInAsyncStorage } from '../utils/AsyncStorageUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sampleData from '../utils/sample_data';
import { v4 as uuidv4 } from 'uuid';
import styles from '../styles';

const LoginScreen = ({ navigation }) => {
    const [error, setError] = useState('');
    const [username, setUsername] = useState('user1@example.com');
    const [password, setPassword] = useState('test password');

    const handleCreateUser = async () => {
        try {
            const response = await axios({
                method: 'post',
                url: `${settings.MONGO_API_URL}/Users`,
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    email: username,
                    password: password,
                    id: uuidv4(),
                }),
                validateStatus: () => true
            });
            handleLogin();
            console.log(response.data);
        } catch (error) {
            if (error.response.status === 409) {
                setError('Email already used');
            } else {
                setError('Failed to create user');
            }
            console.log(error);
        }
    }

    const handleLogin = async () => {
        try {
            const response = await axios({
                method: 'post',
                url: `${settings.MONGO_API_URL}/token`,
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
                validateStatus: () => true,
            });
            const accessToken = response.data.access_token;
            console.log("User ", username, " logged in ")
            await AsyncStorage.setItem('MyAccessToken', accessToken)
                .then(() => console.log("Access token saved to AsyncStorage"))
                .catch(error => console.log("Error saving access token to AsyncStorage: ", error));
            const userData = await axios({
                method: 'get',
                url: `${settings.MONGO_API_URL}/Users/${encodeURIComponent(username)}`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log("userData ", userData.data, " data retrieved")
            // console.log(userData.data)
            await setUserDataInAsyncStorage(userData);
            navigation.navigate('main'); // Navigate to Challenge Run screen after successful login
        } catch (error) {
            if (error.response.status >= 500) {
                console.log(error);
                navigation.navigate('main'); // Navigate to Challenge Run screen after successful login
            } else {
                setError('Invalid username or password');
                console.error(error);
                await setUserDataInAsyncStorage({"data": sampleData.user})
            }
        }
    };

    return (
        <View style={styles.loginContainer}>
            <View style={styles.topLoginContainer}>
                <Text style={styles.loginLabel}>Email:</Text>
                <TextInput
                    style={styles.inputLogin}
                    onChangeText={(text) => setUsername(text)}
                    defaultValue="user1@example.com"
                />
                <Text style={styles.loginLabel}>Password:</Text>
                <TextInput
                    style={styles.inputLogin}
                    onChangeText={(text) => setPassword(text)}
                    defaultValue='test password'
                    secureTextEntry={true}
                />
            </View>
            {error ? <Text style={styles.errorLogin}>{error}</Text> : null}
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                <Button title="Login" onPress={handleLogin} />
                <Button title="Create New Account" onPress={handleCreateUser} />
            </View>
        </View>
    );
};

export default LoginScreen;
