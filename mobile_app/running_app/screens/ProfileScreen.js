import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import CalendarPicker from "react-native-calendar-picker";
import { useUser } from '../navigation/userContext'

const ProfileScreen = () => {
  const { userData, setUserData } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  user_data_id = '933d1bba-aa0b-485f-8e10-95697fb86bd2'
  mongo_api_url = 'http://127.0.0.1:8000'

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${mongo_api_url}/Users/${user_data_id}`);
        setUserData(response.data);
        setOriginalData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // setUserData({
        //   "email": "test@test.com"
        // });
      }
    };
    fetchUserData();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  const handleEdit = () => {
    setEditMode(true);
    setEditedData({ ...userData }); // Initialize editedData with the current userData
  };

  const handleSave = async () => {
    try {
      await axios.patch(`${mongo_api_url}/Users/${user_data_id}`, editedData);
      setUserData(editedData); // Update userData with editedData
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleCancel = () => {
    setEditedData({ ...originalData }); // Revert editedData to originalData
    setEditMode(false); // Exit edit mode
  };

  const handleChange = (field, value) => {
    setEditedData((prevState) => ({ ...prevState, [field]: value }));
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
        <Text>Email: {editMode ? 
          ( <TextInput
              placeholder="Enter new Email"
              value={editedData?.email}
              onChangeText={(text) => handleChange('email', text)}
            />
          ) : (
            <Text>{userData?.email}</Text>
          )}
        </Text>
        <Text>Name: {editMode ? 
          ( <>
              <TextInput
                placeholder="Enter new First Name"
                value={editedData?.first_name}
                onChangeText={(text) => handleChange('first_name', text)}
              />
              <TextInput
                placeholder="Enter new Middle Name"
                value={editedData?.middle_name}
                onChangeText={(text) => handleChange('middle_name', text)}
              />
              <TextInput
                placeholder="Enter new Last Name"
                value={editedData?.last_name}
                onChangeText={(text) => handleChange('last_name', text)}
              />
            </>
          ) : (
            <Text>{userData?.first_name} {userData?.middle_name} {userData?.last_name}</Text>
          )}
        </Text>
        <Text>Motto: {editMode ? 
          ( <TextInput
              placeholder="Enter new motto"
              value={editedData?.motto}
              onChangeText={(text) => handleChange('motto', text)}
            />
          ) : (
            <Text>{userData?.motto}</Text>
          )}
        </Text>
        <Text>Height: {editMode ? 
          ( <>
              <TextInput
                placeholder="Enter new Height"
                value={editedData?.height_feet}
                onChangeText={(text) => handleChange('height_feet', text)}
              />
              <Text>'</Text>
              <TextInput
                placeholder="Enter new Height"
                value={editedData?.height_inches}
                onChangeText={(text) => handleChange('height_inches', text)}
              /><Text>"</Text>
            </>
          ) : (
            <Text>{`${userData?.height_feet}' ${userData?.height_inches}"`}</Text>
          )}
        </Text>
        <Text>Birthday: {editMode ?
          (
            <CalendarPicker 
            initialDate={userData?.birthday} 
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
            <Text>{userData?.birthday}</Text>
          )
        }
        </Text>
        <Text>Weight: {editMode ? 
          ( <>
              <TextInput
                placeholder="Enter new Weight"
                value={editedData?.weight_lbs}
                onChangeText={(text) => handleChange('weight_lbs', text)}
              />
              <Text>lbs</Text>
              <TextInput
                placeholder="Enter new Weight"
                value={editedData?.weight_ounces}
                onChangeText={(text) => handleChange('weight_ounces', text)}
              /><Text>oz</Text>
            </>
          ) : (
            <Text>{`${userData?.weight_lbs} lbs ${userData?.weight_ounces} oz`}</Text>
          )}
        </Text>
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
