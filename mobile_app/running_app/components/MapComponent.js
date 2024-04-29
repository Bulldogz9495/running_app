import React, { useEffect, useState } from 'react';
import MapView, { Polyline } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';

const MapComponent = ({locations, recording, totalDistanceMiles, totalScore, averagePacePmin, currentPace}) => {
  const [polylines, setPolylines] = useState([]);


  return (
    <>
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
        style={{flex: 1, zindex: 0}}
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
      <View style={{
        zIndex: 1,
        position: 'absolute',
        top: '10%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={styles.greenCircle}>
          <Text style={styles.textStyle}>Score</Text>
          <Text style={styles.textStyle}>{totalScore.toFixed(2)}</Text>
        </View>
        <View style={styles.greenCircle}>
          <Text style={styles.textStyle}>Distance</Text>
          <Text style={styles.textStyle}>{totalDistanceMiles.toFixed(2)} </Text>
          <Text style={styles.textStyle}>miles</Text>
        </View>
        <View style={styles.greenCircle}>
          <Text style={styles.textStyle}>Pace</Text>
          <Text style={styles.textStyle}>{currentPace.toFixed(1)}</Text>
          <Text style={styles.textStyle}>min/mile</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  greenCircle: {
    backgroundColor: 'rgba(0, 200, 0, 0.55)',
    borderRadius: 100,
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    fontSize: 18
  }
});

export default MapComponent;
