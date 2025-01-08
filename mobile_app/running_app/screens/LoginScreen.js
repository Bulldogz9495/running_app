// src/LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { settings } from '../utils/settings';
import { useContext } from 'react';
import { UserContext } from '../utils/createContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sampleData from '../utils/sample_data';
import { v4 as uuidv4 } from 'uuid';
import styles from '../styles';
import Purchases from 'react-native-purchases';
import { patchUserInformation } from '../utils/api';

const LoginScreen = ({ navigation }) => {
    const { user, setUser } = useContext(UserContext);
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
                    messages: [],
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
                data: `grant_type=password&username=${encodeURIComponent(username.toLowerCase())}&password=${encodeURIComponent(password)}`,
                validateStatus: () => true,
            });
            const accessToken = response.data.access_token;
            console.log("User ", username, " logged in ")
            await AsyncStorage.setItem('MyAccessToken', accessToken)
                .then(() => console.log("Access token saved to AsyncStorage"))
                .catch(error => console.log("Error saving access token to AsyncStorage: ", error));
            const userData = await axios({
                method: 'get',
                url: `${settings.MONGO_API_URL}/Users/${encodeURIComponent(username.toLowerCase())}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const userDataTrimmed = userData.data;
            // console.log("userData ", userDataTrimmed, " data retrieved")
            const key = process.env.EXPO_PUBLIC_APPLE_REVENUE_CAT;
            Purchases.configure({ apiKey: key, appUserId: user.id });
            customerInfo = await Purchases.getCustomerInfo();
            userDataTrimmed.customerInfo = customerInfo;
            console.log("customerinfo ---", customerInfo)
            await setUser(userDataTrimmed);
            await patchUserInformation(user.id, {subscription_level: customerInfo?.activeSubscriptions[0]});
        } catch (error) {
            if (error.response.status >= 500) {
                console.log(error);
                if (settings.disable_auth) {
                    console.log("Auth is disabled. Logging in user automatically.")
                    setUser({"data": {"id": "1234567890", "email": "test@example.com", "first_name": "Test", "last_name": "User", "password": "test_password"}});
                    navigation.navigate('main'); // Navigate to Challenge Run screen after successful login
                    return;
                }
            } else {
                setError('Invalid username or password');
                console.error(error);
                await setUser({"data": sampleData.user})
            }
        }
    };

    useEffect(() => {
        if (Object.keys(user).length > 0) {
            // console.log("User data retrieved: ", user)
            navigation.navigate('main'); // Navigate to Challenge Run screen after successful login
        }
    }, [user]);

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
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '20%'}}>
                <Button title="Login" onPress={handleLogin} color='blue'/>
                <Button title="Create New Account" onPress={handleCreateUser} color='blue' />
            </View>
        </View>
    );
};

export default LoginScreen;
