import React, { useEffect, useState } from 'react';
import MapView, { Polyline } from 'react-native-maps';
import { View, Text } from 'react-native';
import styles from '../styles';
import { DisplayTime } from './displayTime';

const MapComponent = ({locations, recording, totalDistanceMiles, totalScore, averagePacePmin, currentPace, totalTimeSeconds}) => {
  const [polylines, setPolylines] = useState([]);


  useEffect(() => {
    if (locations.length > 0) {
      let coordinates = locations.map(location => ({latitude: location?.location?.latitude, longitude: location?.location?.longitude}))
      setPolylines(coordinates)
    }
  }, [locations]);

  return (
    <>
      <MapView
        provider="google" 
        region={{
          latitude: locations[locations.length - 1]?.location.latitude,
          longitude: locations[locations.length - 1]?.location.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003
        }}
        style={{flex: 1, zindex: 0}}
        followsUserLocation={true}
        showsUserLocation={true}
        showsUserHeading={true}
        showsMyLocationButton={true}
        zoomEnabled={false}
        zoomTapEnabled={false}
        zoomControlEnabled={false}
        rotateEnabled={true}
        cacheEnabled={true}
        loadingEnabled={true}
        scrollEnabled={true}
        pitchEnabled={false}
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
      <View style={{
        zIndex: 1,
        position: 'absolute',
        top: '10%',
        left: '2%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={styles.greenCircle}>
          <Text style={styles.mapScoreStyle}>{totalScore.toFixed(1)}</Text>
          <Text style={styles.mapTextStyle}>Score</Text>
        </View>
        <View style={styles.greenCircle}>
          <Text style={styles.mapScoreStyle}>{totalDistanceMiles.toFixed(2)} </Text>
          <Text style={styles.mapTextStyle}>Distance</Text>
          <Text style={styles.mapTextStyle}>miles</Text>
        </View>
        <View style={styles.greenCircle}>
          <DisplayTime totalTimeSeconds={(totalTimeSeconds)}/>
          <Text style={styles.mapTextStyle}>Time</Text>
        </View>
      </View>
      <View style={{
        zIndex: 1,
        position: 'absolute',
        top: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        right: '2%',
      }}>
        <View style={styles.greenCircle}>
          <DisplayTime totalTimeSeconds={(currentPace*60).toFixed(1)}/>
          <Text style={styles.mapTextStyle}>Pace</Text>
        </View>
        <View style={styles.greenCircle}>
          <DisplayTime totalTimeSeconds={(averagePacePmin*60).toFixed(1)}/>
          <Text style={styles.mapTextStyle}>Avg Pace</Text>
        </View>
      </View>
    </>
  );
};

export default MapComponent;
