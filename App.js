import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, Button, ScrollView, TouchableOpacity } from "react-native";
import FuelCard from "./components/FuelCard";
import RoundButton from "./components/RoundButton";
import FuelTypeButton from "./components/FuelTypeButton";

export default function App() {
    const mapRef = useRef(null);
    const initialLocation = {
        coords: {
            latitude: -43.5235,
            longitude: 172.5836,
        },
    };

    const [location, setLocation] = useState(null);
    const [gasStations, setGasStations] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const [viewMode, setViewMode] = useState("map");
    const [selectedFuelType, setSelectedFuelType] = useState("Unleaded 91");
    const [lowestPriceStation, setLowestPriceStation] = useState(null);

    useEffect(() => {
        const fetchGasStations = async (latitude, longitude) => {
            try {
                const url = `http://10.196.27.98:5002/api/v1/gas-stations?latitude=${-43.5235}&longitude=${172.5836}`;
                const response = await fetch(url);
                const data = await response.json();
                setGasStations(data.gasStations);

                // Find the station with the lowest price
                let minPrice = Infinity;
                let minPriceStation = null;

                data.gasStations.forEach((station) => {
                    const price = station.prices[station.fuel_types.indexOf(selectedFuelType)];
                    if (price < minPrice) {
                        minPrice = price;
                        minPriceStation = station;
                    }
                });

                setLowestPriceStation(minPriceStation);

                // Automatically show the callout for the lowest price station
                if (mapRef.current && minPriceStation) {
                    mapRef.current.animateToRegion(
                        {
                            latitude: parseFloat(minPriceStation.latitude),
                            longitude: parseFloat(minPriceStation.longitude),
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        },
                        1000
                    );

                    // Delay showing the callout to ensure the marker is rendered
                    setTimeout(() => {
                        mapRef.current.markerRef.showCallout();
                    }, 1000);
                }
            } catch (error) {
                console.error("Error fetching gas stations:", error);
                setErrorMsg("Failed to fetch gas stations.");
            }
        };

        const getCurrentLocation = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setErrorMsg("Permission to access location was denied");
                    fetchGasStations(initialLocation.coords.latitude, initialLocation.coords.longitude);
                    return;
                }
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
                fetchGasStations(location.coords.latitude, location.coords.longitude);

                // Move map center to initial location after loading current location
                if (mapRef.current) {
                    mapRef.current.animateToRegion(
                        {
                            latitude: initialLocation.coords.latitude,
                            longitude: initialLocation.coords.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        },
                        1000
                    );
                }
            } catch (error) {
                console.log(error);
                setErrorMsg("Failed to get current location. Using default location.");
                fetchGasStations(initialLocation.coords.latitude, initialLocation.coords.longitude);
            }
        };

        getCurrentLocation();

        return () => {
            if (mapRef.current && mapRef.current.markerRef) {
                mapRef.current.markerRef.hideCallout();
            }
        };
    }, [selectedFuelType]);

    const getSortedGasStations = (stations, fuelType) => {
        return [...stations].sort((a, b) => {
            const priceA = a.prices[a.fuel_types.indexOf(fuelType)];
            const priceB = b.prices[b.fuel_types.indexOf(fuelType)];
            return priceA - priceB;
        });
    };

    const sortedGasStations = getSortedGasStations(gasStations, selectedFuelType);

    return (
        <View style={styles.container}>
            {viewMode === "map" ? (
                <MapView
                    ref={mapRef}
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
                    {gasStations.map((station, index) => (
                        <Marker
                            key={`${index}-${selectedFuelType}`}
                            pinColor={station === lowestPriceStation ? "green" : "red"}
                            coordinate={{
                                latitude: parseFloat(station.latitude),
                                longitude: parseFloat(station.longitude),
                            }}
                            title={station.location_name}
                            ref={(marker) => {
                                if (station === lowestPriceStation && marker) {
                                    mapRef.current.markerRef = marker;
                                }
                            }}
                        >
                            <Callout style={styles.callout}>
                                <View>
                                    <Text style={styles.calloutTitle}>{station.location_name}</Text>
                                    {station.fuel_types.map((type, i) => (
                                        <Text key={i}>
                                            {type}: ${station.prices[i].toFixed(2)}
                                        </Text>
                                    ))}
                                    <Text>{station.address_line1}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
            ) : (
                <ScrollView style={styles.list}>
                    {sortedGasStations.map((station, index) => (
                        <FuelCard key={index} station={station} selectedFuelType={selectedFuelType} />
                    ))}
                </ScrollView>
            )}
            <View style={styles.footer}>
                <RoundButton
                    title={viewMode === "map" ? "List" : "Map"}
                    onPress={() => setViewMode(viewMode === "map" ? "list" : "map")}
                />
                <View style={styles.fuelTypeButtons}>
                    <FuelTypeButton
                        fuelType="Unleaded 91"
                        label="91"
                        selectedFuelType={selectedFuelType}
                        setSelectedFuelType={setSelectedFuelType}
                        onPress={() => setSelectedFuelType(selectedFuelType === "Unleaded 91" ? null : "Unleaded 91")}
                    />
                    <FuelTypeButton
                        fuelType="Unleaded 95"
                        label="95"
                        selectedFuelType={selectedFuelType}
                        setSelectedFuelType={setSelectedFuelType}
                        onPress={() => setSelectedFuelType(selectedFuelType === "Unleaded 95" ? null : "Unleaded 95")}
                    />
                    <FuelTypeButton
                        fuelType="Unleaded 98"
                        label="98"
                        selectedFuelType={selectedFuelType}
                        setSelectedFuelType={setSelectedFuelType}
                        onPress={() => setSelectedFuelType(selectedFuelType === "Unleaded 98" ? null : "Unleaded 98")}
                    />
                    <FuelTypeButton
                        fuelType="Diesel"
                        label="D"
                        selectedFuelType={selectedFuelType}
                        setSelectedFuelType={setSelectedFuelType}
                        onPress={() => setSelectedFuelType(selectedFuelType === "Diesel" ? null : "Diesel")}
                    />
                </View>
            </View>
            <StatusBar style="auto" />
            {errorMsg ? <Text style={styles.errorMsg}>{errorMsg}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        alignItems: "center",
    },
    map: {
        width: "100%",
        height: "90%",
    },
    list: {
        width: "100%",
        flex: 1,
        padding: 3,
        backgroundColor: "#F8F9FA",
    },
    listItem: {
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 5,
        lineHeight: 24,
        fontSize: 18,
    },
    listItemTitle: {
        fontWeight: "bold",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#fff",
        position: "absolute",
        bottom: 0,
        left: 0,
        paddingHorizontal: 5,
        paddingHorizontal: 10,
    },
    fuelTypeButtons: {
        flexDirection: "row",
    },
    fuelTypeButton: {
        backgroundColor: "#ddd",
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
    },
    fuelTypeButtonSelected: {
        backgroundColor: "#000",
    },
    fuelTypeButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    callout: {
        padding: 8,
        lineHeight: 24,
        borderRadius: 10,
    },
    calloutTitle: {
        fontWeight: "bold",
        marginBottom: 5,
    },
    errorMsg: {
        color: "red",
        textAlign: "center",
        margin: 10,
    },
    viewModeButton: {
        backgroundColor: "#6200ee",
        borderRadius: 25, // 圆形按钮，宽度和高度的一半
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
    },
});
