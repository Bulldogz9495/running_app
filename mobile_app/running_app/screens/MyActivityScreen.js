import React, { useRef, useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import RunComponent from '../components/RunComponent';
import { View, Image, Button, Modal, Text } from 'react-native';
import * as Location from 'expo-location';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { settings } from '../utils/settings';
import { getUserDataFromAsyncStorage } from '../utils/AsyncStorageUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';

const MyActivityScreen = () => {
  const [locations, setLocations] = useState([]);
  const [recording, setRecording] = useState(false);
  const [totalDistanceMiles, setTotalDistanceMiles] = useState(0);
  const [averagePacePmin, setAveragePacePmin] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [currentPace, setCurrentPace] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);


  const stopRecording = () => {
    setShowModal(true);
  }

  const handleConfirm = () => {
    (async () => {
      const userData = await getUserDataFromAsyncStorage();
      // console.log("locations: ", locations);
      runData = {
        id: uuidv4(),
        user_id: userData.data.id,
        start_location: {"latitude": locations[0].location.latitude, "longitude": locations[0].location.longitude},
        end_location: {"latitude": locations[locations.length - 1].location.latitude, "longitude": locations[locations.length - 1].location.longitude},
        start_datetime: locations[0].datetime,
        end_datetime: locations[locations.length - 1].datetime,
        distance: totalDistanceMiles,
        duration: (new Date() - new Date(locations[0].datetime)) / 1000.0,
        pace: isNaN(averagePacePmin) ? 0 : averagePacePmin,
        score: totalScore, // totalDistanceMiles * Math.pow(2,((1500-(averagePacePmin*60))/140))
        geopoints: locations,
      }
      console.log("RunData: ", runData);
      const accessToken = await AsyncStorage.getItem('MyAccessToken');
      fetch(`${settings.MONGO_API_URL}/Runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(runData)
      }).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .then((responseData) => {
        console.log("RUN RESPONSE: ", responseData);
      })
      .catch((error) => {
        // resetState(); // Only use when deving and trying to always remove running data
        console.error(error);
      });
    });
    // Reset state and hide modal
    resetState();
    setShowModal(false);
    setRecording(false);
  };

  const handleCancel = () => {
    // Hide modal without resetting state
    setShowModal(false);
    setRecording(true);
  };

  const handleDelete = () => {
    resetState();
    setShowModal(false);
    setRecording(false);
  };

  const resetState = () => {
    setLocations([]);
    setRecording(false);
    setTotalDistanceMiles(0);
    setAveragePacePmin(0);
    setTotalScore(0);
  }

  useEffect(() => {
    if (locations.length > 1) {
      var R = 6371; // Radius of the earth in km
      var dLat = (locations[locations.length - 1].location.latitude - locations[locations.length - 2].location.latitude) * Math.PI / 180;
      var dLon = (locations[locations.length - 1].location.longitude - locations[locations.length - 2].location.longitude) * Math.PI / 180;
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(locations[locations.length - 2].location.latitude * Math.PI / 180) * Math.cos(locations[locations.length - 1].location.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
      var distance = d * 0.621371; // convert km to miles
      var pace2 =  5 / 60 / (distance); // minutes / miles - from distance
      var score = distance * Math.pow(2,((1500-(pace2*60))/140));
      // var score = Math.round((distance * Math.pow(2,((1500-(locations[locations.length - 1].pace*60))/140)))*10)/10);  // Uses gps speed instead of calculated distance
      const startDateTime = new Date(locations[0].datetime);
      const endDateTime = new Date(locations[locations.length - 1].datetime);
      setTotalTimeSeconds((endDateTime.getTime() - startDateTime.getTime()) / 1000);
      setCurrentPace(pace2);
      setTotalDistanceMiles(totalDistanceMiles + (Math.round((distance) * 100000) / 100000.0));
      setAveragePacePmin(totalTimeSeconds / (totalDistanceMiles) / 60);
      setTotalScore(state => state + score);
    }
  }, [locations]);


  useEffect(() => {
    const startRecording = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }
        const intervalMilliSeconds = 5000;
        intervalId = setInterval(() => {
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })
            .then((location) => {
              var pace = 1609.34 / location.coords.speed / 60; // gps locations param
              var newLocation = {
                "location": 
                {
                  "latitude": location.coords.latitude, 
                  "longitude": location.coords.longitude
                },
                "accuracy": location.coords.accuracy,
                "altitude": location.coords.altitude,
                "altitudeAccuracy": location.coords.altitudeAccuracy,
                "heading": location.coords.heading,
                "speed": location.coords.speed,
                "pace": pace,  // convert meters per second to minutes in 1 mile pace = 1609.34 (m/mile) / speed (m/s) / 60 (s/min)
                "datetime": new Date().toISOString()
              }
              setLocations((state) => [...state, newLocation]);
            })
            .catch((error) => {
              console.error('Error getting location:', error);
            });
        }, intervalMilliSeconds);
        setRecording(true);
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    };

    if (recording) {
      startRecording();
    } else if (!recording && locations.length > 0) {
      stopRecording();
    }
  }, [recording]);


  return (
    <View style={{ flex: 1, backgroundColor: 'lightgreen'}}>
      <Button
          title={recording ? 'Pause Run' : 'Start A Run'}
          onPress={() => setRecording((prevState) => !prevState)}
          color={recording ? 'red' : 'blue'}
      />
      {recording ? 
      <MapComponent 
        locations={locations}
        recording={recording}
        totalDistanceMiles={totalDistanceMiles}
        totalScore={totalScore}
        averagePacePmin={averagePacePmin}
        currentPace={currentPace}
        totalTimeSeconds={totalTimeSeconds}
      />
      : 
      <RunComponent/>}
      <Modal visible={showModal} animationType="slide" style={{flex: 1}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightgreen'}}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.userText}>Total Distance: {totalDistanceMiles.toFixed(2)} miles</Text>
            <Text style={styles.userText}>Total Score: {totalScore.toFixed(2)}</Text>
            <Text style={styles.userText}>Average Pace: {averagePacePmin} minutes per mile</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <Button title="Save Run" onPress={handleConfirm} color={'blue'} />
              <Button title="Resume Run" onPress={handleCancel} color={'darkgreen'}/>
              <Button title="Delete Run" onPress={handleDelete} color={'red'}/>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyActivityScreen;