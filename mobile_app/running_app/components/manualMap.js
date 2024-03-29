
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';


export default manualMap = () => {
    const latitude = 42.287930
    const longitude = -83.497437

    const [mapImageUri, setMapImageUri] = useState(null);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0)
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const fetchStaticMap = async () => {
      try {
        // Check if the local resource exists
        const localResource = require('../assets/staticmap.png');
        setMapImageUri(localResource);
      } catch (error) {
        // Local resource does not exist, fetch from API
        console.log("Cannot find local resource: ", error)
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&key=${GOOGLE_MAPS_API_KEY}&size=400x500&scale=2`
        );
        const blob = await response.blob();
        setMapImageUri(URL.createObjectURL(blob));
      }
    };

    fetchStaticMap();
  }, []);

  return (
    <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      { mapImageUri ? 
      (
        <>
          <Image 
            source={mapImageUri} 
            style={
            [
              styles.mapImage,
              {
                transform: [
                  {rotate: `${rotation}deg`},
                  {scale: `${scale}`},
                  {translate: `${translateX}px, ${translateY}px`}
                ]
              }
            ]
          }
            
          />
          <View style={[styles.marker, {top: '80%', left: '50%'}]}><Text style={styles.arrow}>➤</Text></View>
        </>
      ) : ( 
        <Text>Loading Map...</Text> 
      )}
    </View>
  );
};

// const styles = StyleSheet.create({
//   mapImage: {
//     flex: 1,
//   },
//   marker: {
//       position: 'absolute',
//       borderRadius: 1,
//       fontcolor: 'green',
//       transform:[{rotate: '-90deg'}]
//   },
//   arrow: {
//     color: 'green',
//     fontSize: 40
//   }
// });