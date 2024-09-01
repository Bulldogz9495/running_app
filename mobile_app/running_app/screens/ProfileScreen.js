import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import CalendarPicker from "react-native-calendar-picker";
import { settings } from '../utils/settings';
import { useContext } from 'react';
import { UserContext } from '../utils/createContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';


const ProfileScreen = ({navigation}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = user;
        if (!userInfo) {
          navigation.navigate('login');
          throw new Error('User not logged in');
        }
        setUser(userInfo);
        setEditedData(userInfo);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  const handleEdit = () => {
    setEditMode(true);
    setEditedData( user ); // Initialize editedData with the current userData
  };

  const handleSave = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('MyAccessToken');
      await axios.patch(`${settings.MONGO_API_URL}/Users/username/${encodeURIComponent(editedData?.email)}`, 
      data=editedData,
      {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      setUser(editedData); // Update userData with editedData
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleCancel = () => {
    setEditedData(user); // Revert editedData to originalData
    setEditMode(false); // Exit edit mode
  };

  const handleChange = (field, value) => {
    setEditedData((editedData) => {
      const newEditedData = editedData;
      newEditedData[field] = value;
      return newEditedData;
    });
  };

  return (
    <View style={styles.profileContainer}>
      <View style={styles.editButton}>
        {!editMode ? (
          <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
            <Button title="Edit" onPress={handleEdit} color="blue" />
            <Button title="Subscribe" onPress={() => navigation.navigate('Payment')} style={{}} color="blue"/>
          </View>
        ) : (
          <>
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" onPress={handleCancel} />
          </>
        )}
      </View>
      <ScrollView style={styles.userDataContainer}>
        <>
          <Text style={styles.userText}>Email: </Text>{editMode ? // Set to False until new email can be done
          ( <TextInput
              placeholder="Enter new Email"
              defaultValue={editedData?.email}
              value={Text}
              onChangeText={(text) => handleChange('email', text)}
              style={styles.userInput}
            />
          ) : (
            <Text style={styles.userProfileInfo}>{editedData?.email}</Text>
          )}
        </>
        <><Text style={styles.userText}>Name: </Text>{editMode ? 
          ( <>
              <TextInput
                placeholder="Enter new First Name"
                defaultValue={editedData?.first_name}
                value={Text}
                onChangeText={(text) => handleChange('first_name', text)}
                style={styles.userInput}
              />
              <TextInput
                placeholder="Enter new Middle Name"
                defaultValue={editedData?.middle_name}
                value={Text}
                onChangeText={(text) => handleChange('middle_name', text)}
                style={styles.userInput}
              />
              <TextInput
                placeholder="Enter new Last Name"
                defaultValue={editedData?.last_name}
                value={Text}
                onChangeText={(text) => handleChange('last_name', text)}
                style={styles.userInput}
              />
            </>
          ) : (
            <Text style={styles.userProfileInfo}>{editedData?.first_name} {editedData?.middle_name} {editedData?.last_name}</Text>
          )}
        </>
        <><Text style={styles.userText}>Motto: </Text>{editMode ? 
          ( <TextInput
              placeholder="Enter new motto"
              defaultValue={editedData?.motto}
              value={Text}
              onChangeText={(text) => handleChange('motto', text)}
              style={styles.userInput}
            />
          ) : (
            <Text style={styles.userProfileInfo}>{editedData?.motto}</Text>
          )}
        </>
        <><Text style={styles.userText}>Height: </Text>{editMode ? 
          ( <>
              <TextInput
                placeholder="Enter new Height"
                defaultValue={editedData?.height_feet ? editedData.height_feet.toString() : ''}
                value={Text}
                onChangeText={(text) => handleChange('height_feet', text)}
                style={styles.userInput}
              />
              <Text>'</Text>
              <TextInput
                placeholder="Enter new Height"
                defaultValue={editedData?.height_inches ? editedData.height_inches.toString() : ''}
                value={Text}
                onChangeText={(text) => handleChange('height_inches', text)}
                style={styles.userInput}
              /><Text>"</Text>
            </>
          ) : (
            <Text style={styles.userProfileInfo}>{`${editedData?.height_feet}' ${editedData?.height_inches}"`}</Text>
          )}
        </>
        <><Text style={styles.userText}>Birthday: </Text>{editMode ?
          (
            <CalendarPicker 
            defaultValue={editedData?.birthday}
            value={Text}
            onDateChange={(date) => {
              year = date.getFullYear();
              month =  String(date.getMonth() + 1).padStart(2, '0');
              day = String(date.getDate()).padStart(2, '0');
              text = `${year}-${month}-${day}`;
              handleChange('birthday', text);
              }
            }
            width={375}
            ></CalendarPicker>
          ) : (
            <Text style={styles.userProfileInfo}>{editedData?.birthday === null ? '' : editedData?.birthday.split('T')[0]}</Text>
          )
        }
        </>
        <>
          <Text style={ styles.userText }>Weight: </Text>{editMode ? 
          ( <>
              <TextInput
                placeholder="Enter new Weight"
                defaultValue={editedData?.weight_lbs ? editedData.weight_lbs.toString() : ''}
                value={Text}
                onChangeText={(text) => handleChange('weight_lbs', text)}
                style={styles.userInput}
              />
              <Text style={styles.userText}>lbs</Text>
              <TextInput
                placeholder="Enter new Weight"
                defaultValue={editedData?.weight_ounces ? editedData.weight_ounces.toString() : ''}
                value={Text}
                onChangeText={(text) => handleChange('weight_ounces', text)}
                style={styles.userInput}
              /><Text style={styles.userText}>oz</Text>
            </>
          ) : (
            <Text style={styles.userProfileInfo}>{`${editedData?.weight_lbs} lbs ${editedData?.weight_ounces} oz`}</Text>
          )}
        </>
      </ScrollView>
    </View>
  );
};

// const styles = StyleSheet.create({
//   profileContainer: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'flex-start',
//     padding: 20,
//     backgroundColor: 'lightgreen',
//   },
//   editButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//     color: 'blue',
//   },
//   userDataContainer: {
//     alignSelf: 'flex-start',
//   },
//   userText: {
//     fontSize: 20
//   },
//   userInput: {
//     borderColor: 'blue',
//     borderWidth: 2,
//     borderRadius: 25,
//     margin: 5,
//     padding: 15,
//     color: 'black',
//     width: '80%'
//   }
// });

export default ProfileScreen;
