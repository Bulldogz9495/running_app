import React, { useRef, useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import RunComponent from '../components/RunComponent';
import { View, Image, Button } from 'react-native';
import * as Location from 'expo-location';

const MyActivityScreen = () => {
  const [locations, setLocations] = useState([]);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    let intervalId;

    const startRecording = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        intervalId = setInterval(() => {
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })
            .then((location) => {
              newLocation = {"location": 
                {"latitude": location.coords.latitude, "longitude": location.coords.longitude},
                "accuracy": location.coords.accuracy,
                "altitude": location.coords.altitude,
                "altitudeAccuracy": location.coords.altitudeAccuracy,
                "heading": location.coords.heading,
                "speed": location.coords.speed,
                "pace": 1609.34 / location.coords.speed / 60  // convert meters per second to minutes in 1 mile pace = 1609.34 (m/mile) / speed (m/s) / 60 (s/min)
              }
              setLocations((prevLocations) => [...prevLocations, newLocation]);
            })
            .catch((error) => {
              console.error('Error getting location:', error);
            });
        }, 5000);

        setRecording(true);
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    };

    const stopRecording = () => {
      clearInterval(intervalId);
      setRecording(false);
    };

    if (recording) {
      startRecording();
    }
    return () => clearInterval(intervalId);
  }, [recording]);

  useEffect(() => {
    if (!recording && locations.length > 0) {
      // API CALL TO BACKEND POST FOR A RUN `${MONGO_API}/Runs`
      console.log("Finished Recording: ", locations);
    }
  }, [locations, recording]);

  return (
    <>
      <Button
          title={recording ? 'Stop Recording' : 'Start Recording'}
          onPress={() => setRecording((prevState) => !prevState)}
      />
      {recording ? <MapComponent /> : <RunComponent/>}
    </>
  );
};

export default MyActivityScreen;