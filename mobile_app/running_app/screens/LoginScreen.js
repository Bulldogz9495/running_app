// src/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { settings } from '../utils/settings';
import { setUserDataInAsyncStorage } from '../utils/AsyncStorageUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [error, setError] = useState('');
    const [username, setUsername] = useState('user1@example.com');
    const [password, setPassword] = useState('test password');

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
            console.log("User ", username, " logged in")
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
            console.log("userData ", userData.data.email, " data retrieved")
            // console.log(userData.data)
            await setUserDataInAsyncStorage(userData);

            navigation.navigate('main'); // Navigate to Challenge Run screen after successful login
        } catch (error) {
            setError('Invalid username or password');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setUsername(text)}
                    defaultValue="user1@example.com"
                />
                <Text style={styles.label}>Password:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setPassword(text)}
                    defaultValue='test password'
                    secureTextEntry={true}
                />
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    topContainer: {
        width: '100%',
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default LoginScreen;
