import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/Users/933d1bba-aa0b-485f-8e10-95697fb86bd2');
        setUserData(response.data);
        setOriginalData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
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
      await axios.patch('http://127.0.0.1:8000/Users/933d1bba-aa0b-485f-8e10-95697fb86bd2', editedData);
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
        <Text>Email: {userData?.email}</Text>
        <Text>Name: {`${userData?.first_name} ${userData?.middle_name} ${userData?.last_name}`}</Text>
        {editMode ? (
          <>
            <TextInput
              placeholder="Enter new motto"
              value={editedData?.motto}
              onChangeText={(text) => handleChange('motto', text)}
            />
            {/* Add more TextInput components for other editable fields */}
          </>
        ) : (
          <Text>Motto: {userData?.motto}</Text>
        )}
        <Text>Height: {`${userData?.height_feet}' ${userData?.height_inches}"`}</Text>
        <Text>Birthday: {userData?.birthday}</Text>
        <Text>Weight: {`${userData?.weight_lbs} lbs ${userData?.weight_ounces} oz`}</Text>
        <Text>Created: {userData?.created}</Text>
        <Text>Updated: {userData?.updated}</Text>
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
