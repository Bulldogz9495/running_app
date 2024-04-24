import React, { useRef, useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import RunComponent from '../components/RunComponent';
import { View, Image, Button } from 'react-native';
import * as Location from 'expo-location';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { settings } from '../utils/settings';
import { getUserDataFromAsyncStorage } from '../utils/AsyncStorageUtils';

const MyActivityScreen = () => {
  const [locations, setLocations] = useState([]);
  const [recording, setRecording] = useState(false);
  const [totalDistanceMiles, setTotalDistanceMiles] = useState(0);
  const [averagePacePmin, setAveragePacePmin] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

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
              var pace = 1609.34 / location.coords.speed / 60;
              console.log("Pace: ", pace);
              newLocation = {"location": 
                {
                  "latitude": location.coords.latitude, "longitude": location.coords.longitude},
                  "accuracy": location.coords.accuracy,
                  "altitude": location.coords.altitude,
                  "altitudeAccuracy": location.coords.altitudeAccuracy,
                  "heading": location.coords.heading,
                  "speed": location.coords.speed,
                  "pace": pace,  // convert meters per second to minutes in 1 mile pace = 1609.34 (m/mile) / speed (m/s) / 60 (s/min)
                  "datetime": new Date().toISOString()
              }
              if (locations.length > 0) {
                var R = 6371; // Radius of the earth in km
                var dLat = (newLocation.location.latitude - locations[locations.length - 1].location.latitude) * Math.PI / 180;
                var dLon = (newLocation.location.longitude - locations[locations.length - 1].location.longitude) * Math.PI / 180;
                var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(locations[locations.length - 1].location.latitude * Math.PI / 180) * Math.cos(newLocation.location.latitude * Math.PI / 180) *
                        Math.sin(dLon/2) * Math.sin(dLon/2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                var d = R * c;
                distance = d * 0.621371; // convert km to miles
                setTotalDistanceMiles(totalDistanceMiles + d);
                setAveragePacePmin((newLocation.datetime - locations[0].datetime) / (totalDistanceMiles) / 1000 / 60);
                setTotalScore(totalScore + distance * Math.pow(2,((1500-(newLocation.pace*60))/140)));
                console.log("Total Distance: ", totalDistanceMiles);
                console.log("Average Pace: ", averagePacePmin);
                console.log("Total Score: ", totalScore);
              } else {
                setTotalDistanceMiles(0);
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
      (async () => {
        const userData = await getUserDataFromAsyncStorage();
        console.log("locations: ", locations);
        console.log("Time1: ", Date());
        console.log("Time2: ", Date(locations[0].datetime));
        console.log("Time3: ", new Date() - new Date(locations[0].datetime));
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
        axios.post(`${settings.MONGO_API_URL}/Runs`, runData).then((response) => {
            console.log(response.data);
            setLocations([]);
          })
          .catch((error) => {
            console.error(error);
          });
      })();
    }
  }, [locations, recording, averagePacePmin, totalDistanceMiles, totalScore]);

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