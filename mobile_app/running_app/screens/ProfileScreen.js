import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import CalendarPicker from "react-native-calendar-picker";
import { settings } from '../utils/settings';
import { getUserDataFromAsyncStorage } from '../utils/AsyncStorageUtils';


const ProfileScreen = () => {
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = await getUserDataFromAsyncStorage();
        if (!userInfo) {
          navigation.navigate('login');
          throw new Error('User not logged in');
        }
        setUserData(userInfo);
        setEditedData(userInfo);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  const handleEdit = () => {
    setEditMode(true);
    setEditedData( userData ); // Initialize editedData with the current userData
  };

  const handleSave = async () => {
    try {
      await axios.patch(`${mongo_api_url}/Users/${userData?.data.email}`, editedData);
      setUserData(editedData); // Update userData with editedData
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleCancel = () => {
    setEditedData(userData); // Revert editedData to originalData
    setEditMode(false); // Exit edit mode
  };

  const handleChange = (field, value) => {
    setEditedData((editedData) => {
      const newEditedData = editedData;
      newEditedData.data[field] = value;
      return newEditedData;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.editButton}>
        {!editMode ? (
          <Button title="Edit" onPress={handleEdit} />
        ) : (
          <>
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" onPress={handleCancel} />
          </>
        )}
      </View>
      <View style={styles.userDataContainer}>
        <>
          <Text>Email: </Text>{editMode ? 
          ( <TextInput
              placeholder="Enter new Email"
              defaultValue={editedData?.data?.email}
              value={Text}
              onChangeText={(text) => handleChange('email', text)}
            />
          ) : (
            <Text>{editedData?.data?.email}</Text>
          )}
        </>
        <><Text>Name: </Text>{editMode ? 
          ( <>
              <TextInput
                placeholder="Enter new First Name"
                defaultValue={editedData?.data?.first_name}
                value={Text}
                onChangeText={(text) => handleChange('first_name', text)}
              />
              <TextInput
                placeholder="Enter new Middle Name"
                defaultValue={editedData?.data?.middle_name}
                value={Text}
                onChangeText={(text) => handleChange('middle_name', text)}
              />
              <TextInput
                placeholder="Enter new Last Name"
                defaultValue={editedData?.data?.last_name}
                value={Text}
                onChangeText={(text) => handleChange('last_name', text)}
              />
            </>
          ) : (
            <Text>{editedData?.data?.first_name} {editedData?.data?.middle_name} {editedData?.data?.last_name}</Text>
          )}
        </>
        <><Text>Motto: </Text>{editMode ? 
          ( <TextInput
              placeholder="Enter new motto"
              defaultValue={editedData?.data?.motto}
              value={Text}
              onChangeText={(text) => handleChange('motto', text)}
            />
          ) : (
            <Text>{editedData?.data?.motto}</Text>
          )}
        </>
        <><Text>Height: </Text>{editMode ? 
          ( <>
              <TextInput
                placeholder="Enter new Height"
                defaultValue={editedData?.data?.height_feet.toString()}
                value={Text}
                onChangeText={(text) => handleChange('height_feet', text)}
              />
              <Text>'</Text>
              <TextInput
                placeholder="Enter new Height"
                defaultValue={editedData?.data?.height_inches.toString()}
                value={Text}
                onChangeText={(text) => handleChange('height_inches', text)}
              /><Text>"</Text>
            </>
          ) : (
            <Text>{`${editedData?.data?.height_feet}' ${editedData?.data?.height_inches}"`}</Text>
          )}
        </>
        <><Text>Birthday: </Text>{editMode ?
          (
            <CalendarPicker 
            defaultValue={editedData?.data?.birthday}
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
            <Text>{editedData?.data?.birthday}</Text>
          )
        }
        </>
        <><Text>Weight: </Text>{editMode ? 
          ( <>
              <TextInput
                placeholder="Enter new Weight"
                defaultValue={editedData?.data?.weight_lbs.toString()}
                value={Text}
                onChangeText={(text) => handleChange('weight_lbs', text)}
              />
              <Text>lbs</Text>
              <TextInput
                placeholder="Enter new Weight"
                defaultValue={editedData?.data?.weight_ounces.toString()}
                value={Text}
                onChangeText={(text) => handleChange('weight_ounces', text)}
              /><Text>oz</Text>
            </>
          ) : (
            <Text>{`${editedData?.data?.weight_lbs} lbs ${editedData?.data?.weight_ounces} oz`}</Text>
          )}
        </>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  },
  editButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userDataContainer: {
    alignSelf: 'flex-start',
  },
});

export default ProfileScreen;
