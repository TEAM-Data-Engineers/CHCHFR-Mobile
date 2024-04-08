import React, { useEffect } from "react";
import MapView, { Marker, Heatmap } from "react-native-maps";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { useState } from "react";
import Constants from 'expo-constants';

export default function App() {
    const initialLocation = {
        coords: {
            latitude: -43.525225162129644,
            longitude: 172.6429555627193,
        },
    };

    const [location, setLocation] = useState(null);
    const [gasStations, setGasStations] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const apiKey = Constants.expoConfig.extra.GOOGLE_MAP_API_KEY;

    useEffect(() => {
        const fetchGasStations = async () => {
            try {
                const radius = 5000;
                const type = "gas_station";
                const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${initialLocation.coords.latitude},${initialLocation.coords.longitude}&radius=${radius}&type=${type}&key=${apiKey}`;

                const response = await fetch(url);
                const data = await response.json();

                setGasStations(data.results);
            } catch (error) {
                console.error("Error fetching gas stations:", error);
                throw error;
            }
        };

        const getCurrentLocation = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setErrorMsg("Permission to access location was denied");
                    return;
                }
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
                fetchGasStations();
            } catch (error) {
                console.log(error);
                throw error;
            }
        };

        getCurrentLocation();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                zoomControlEnabled={true}
                showsUserLocation={true}
                userLocationUpdateInterval={10000}
                userLocationAnnotationTitle="You are here"
                showsMyLocationButton={true}
                showsCompass={true}
                showsScale={true}
                zoomEnabled={true}
                style={styles.map}
                initialRegion={{
                    latitude: location ? location.coords.latitude : initialLocation.coords.latitude,
                    longitude: location ? location.coords.longitude : initialLocation.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {gasStations
                    ? gasStations.map((station, index) => (
                          <Marker
                              key={index}
                              pinColor="red"
                              coordinate={{
                                  latitude: station.geometry.location.lat,
                                  longitude: station.geometry.location.lng,
                              }}
                              title={station.name}
                              description={station.vicinity}
                          >
                              {/* <View style={{ backgroundColor: "red", padding: 10 }}>
                                  <Text>{"#91: $2.872"}</Text>
                                  <Text>{"#95: $3.069"}</Text>
                                  <Text>{"#98: $3.223"}</Text>
                                  <Text>{"Diesel: $2.184"}</Text>
                              </View> */}
                          </Marker>
                      ))
                    : null}
            </MapView>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        alignItems: "center",
    },
    imageContainer: {
        flex: 1,
        paddingTop: 58,
    },
    image: {
        width: 320,
        height: 440,
        borderRadius: 18,
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: "center",
    },
    map: {
        width: "100%",
        height: "100%",
    },
});
