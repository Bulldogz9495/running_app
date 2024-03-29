import React, { useEffect, useState } from 'react';
import { View, Image, Button } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const MapComponent = (props) => {
  const [polylines, setPolylines] = useState([]);
  const [locations, setLocations] = useState([]);
  const [recording, setRecording] = useState(false);
  // Function to update polylines when user moves

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
      <MapView 
        provider="google" 
        region={{
          latitude: 42.287930,
          longitude: -83.497437,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        }}
        initialRegion={{
          latitude: 42.287930,
          longitude: -83.497437,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        }}
        style={{flex: 1}}
        showsUserLocation={true}
        followsUserLocation={true}
        zoomEnabled={false}
        zoomTapEnabled={false}
        zoomControlEnabled={false}
        rotateEnabled={true}
        showsMyLocationButton={true}
        cacheEnabled={true}
        loadingEnabled={true}
      >
      {polylines.map((polyline, index) => (
        <Polyline
          key={index}
          coordinates={polyline.coordinates}
          strokeColor="#FF0000" // Red color for the polyline
          strokeWidth={3}
        />
        ))
      }
      </MapView>
    </>
  );
};

export default MapComponent;
  