import React, { useEffect, useState } from 'react';
import MapView, { Polyline } from 'react-native-maps';
import { View, Text } from 'react-native';
import styles from '../styles';

const MapComponent = ({locations, recording, totalDistanceMiles, totalScore, averagePacePmin, currentPace, totalTimeSeconds}) => {
  const [polylines, setPolylines] = useState([]);

  return (
    <>
      <MapView
        // provider="google" 
        region={{
          latitude: 42.287930,
          longitude: -83.497437,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003
        }}
        style={{flex: 1, zindex: 0}}
        followsUserLocation={true}
        showsUserLocation={true}
        showsMyLocationButton={true}
        zoomEnabled={false}
        zoomTapEnabled={false}
        zoomControlEnabled={false}
        rotateEnabled={true}
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
      <View style={{
        zIndex: 1,
        position: 'absolute',
        top: '7%',
        left: '2%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={styles.greenCircle}>
          <Text style={styles.mapScoreStyle}>{totalScore.toFixed(2)}</Text>
          <Text style={styles.mapTextStyle}>Score</Text>
        </View>
        <View style={styles.greenCircle}>
          <Text style={styles.mapScoreStyle}>{totalDistanceMiles.toFixed(2)} </Text>
          <Text style={styles.mapTextStyle}>Distance (miles)</Text>
        </View>
        <View style={styles.greenCircle}>
          <Text style={styles.mapScoreStyle}>{Math.floor(totalTimeSeconds / 60)}:{(totalTimeSeconds % 60).toFixed(0).toString().padStart(2, '0')}</Text>
          <Text style={styles.mapTextStyle}>Time</Text>
        </View>
      </View>
      <View style={{
        zIndex: 1,
        position: 'absolute',
        top: '7%',
        alignItems: 'center',
        justifyContent: 'center',
        right: '2%',
      }}>
        <View style={styles.greenCircle}>
          <Text style={styles.mapScoreStyle}>{currentPace.toFixed(1)}</Text>
          <Text style={styles.mapTextStyle}> Pace (min/mile)</Text>
        </View>
        <View style={styles.greenCircle}>
          <Text style={styles.mapScoreStyle}>{averagePacePmin.toFixed(1)}</Text>
          <Text style={styles.mapTextStyle}>Avg Pace (min/mile)</Text>
        </View>
      </View>
    </>
  );
};

export default MapComponent;
