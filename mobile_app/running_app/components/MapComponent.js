import React, { useEffect, useState } from 'react';
import MapView, { Polyline } from 'react-native-maps';

const MapComponent = (props) => {
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
  