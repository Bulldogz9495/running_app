import { View, Text, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from '../styles';
import { DisplayTime } from '../components/displayTime';
import moment from 'moment';
import { fetchRun } from '../utils/api';
import { useContext } from 'react';
import { UserContext } from '../utils/createContext';


/**
 * A component that displays a run - Uses a run object with an optional user object in it. If no user provided will default to current user
 * 
 * @param {Object} navigation - The navigation object from react-navigation
 * @param {Object} route - The route object from react-navigation
 * @param {Object} params - The params object from the route
 * @param {Object} params.run - The run object to display
 * @returns {React.Component} A component displaying a run
 */
const RunScreen = ({ navigation, route: { params } }) => {
    const [run, setRun] = useState(params.run)
    const [polylines, setPolylines] = useState([]);
    const mapRef = React.createRef();
    const { user, setUser } = useContext(UserContext);
    const [latitudeDelta, setLatitudeDelta] = useState(0.03);
    const [longitudeDelta, setLongitudeDelta] = useState(0.03);
    const [mapCenter, setMapCenter] = useState({latitude: 0, longitude: 0});

    // Set the user on the run if it doesn't already have one to current user
    useEffect(() => {
        fetchRun(run.id).then(fetchedRun => {setRun(prevRun => ({...prevRun, geopoints: fetchedRun.geopoints }))})
        if (!run?.user?.id) {
            setRun(prevRun => ({...prevRun, user: user }))
        }
        setMapCenter({latitude: run.start_location.latitude, longitude: run.start_location.longitude})
    }, [])

    function onMapReady() {
        let coordinates = run.geopoints.map(geoPoint => ({latitude: geoPoint?.location?.latitude, longitude: geoPoint?.location?.longitude}))
        setPolylines(coordinates)
        if (mapRef.current) {
            mapRef.current.fitToCoordinates(coordinates, { 
                animated: true, 
                edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
            })
        }
    }

    useEffect(() => {
        console.log("Run: ", run)
        if (run.geopoints) {
            onMapReady()
        }
    }, [run])

    useEffect(() => {
        let lats = polylines.map(polyline => polyline?.latitude)
        let minLat = Math.min(...lats)
        let maxLat = Math.max(...lats)
        let latitudeDelta = (maxLat - minLat)*1.1
        setLatitudeDelta(latitudeDelta > 0 ? latitudeDelta : 0.03); // default to 0.03 if latitudeDelta is 
        let longs = polylines.map(polyline => polyline?.longitude)
        let minLong = Math.min(...longs)
        let maxLong = Math.max(...longs)
        let longitudeDelta = (maxLong - minLong)*1.1
        setLongitudeDelta(longitudeDelta > 0 ? longitudeDelta : 0.01); // default to 0.03 if longitudeDelta is 0
        center = {latitude: (minLat + (latitudeDelta/2)), longitude: (minLong + (longitudeDelta/2))}
        setMapCenter(center)
      }, [polylines]);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Pressable style={styles.pressableArea} onPress={() => navigation.goBack()}>
                    <Text style={styles.pressableText}>Go Back</Text>
                </Pressable>
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 20 }}>{run?.user?.first_name} {run?.user?.last_name}'s run on {moment(run?.start_datetime).format('l')}</Text>
            <Text style={{ fontSize: 24 }}>Score: {run?.score.toFixed(1)}</Text>
            <Text style={{ fontSize: 20 }}>Distance: {run?.distance.toFixed(1)} miles</Text>
            <Text style={{ fontSize: 20 }}>Duration: {Math.round(run?.duration / 60)} min
                {run?.duration > 0 && <Text> ({Math.round(run?.distance)} miles at {<DisplayTime totalTimeSeconds={run?.pace*60} additionalStyles={{fontSize: 20, fontWeight: 'normal'}}/>} min/mile)</Text>}
            </Text>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Pace: {<DisplayTime totalTimeSeconds={run?.pace*60} additionalStyles={{fontSize: 20, fontWeight: 'normal'}}/>} minutes per mile</Text>
            {run?.geopoints && run?.geopoints.length > 0 && !isNaN(mapCenter.latitude) && !isNaN(mapCenter.longitude) &&
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: mapCenter.latitude,
                    longitude: mapCenter.longitude,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta
                }}
                style={{flex: 1, zindex: 0}}
                followsUserLocation={false}
                showsUserLocation={false}
                showsUserHeading={false}
                showsMyLocationButton={false}
                zoomEnabled={true}
                zoomTapEnabled={false}
                zoomControlEnabled={false}
                rotateEnabled={true}
                cacheEnabled={true}
                loadingEnabled={true}
                scrollEnabled={true}
                pitchEnabled={false}
            >
                <Polyline
                    coordinates={polylines}
                    strokeColor="#33b317"
                    strokeWidth={10}
                />
            </MapView>
            }
        </View>
    )
};

export default RunScreen;