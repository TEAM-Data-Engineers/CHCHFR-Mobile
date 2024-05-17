import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import FuelCard from "./components/FuelCard";
import RoundButton from "./components/RoundButton";
import FuelTypeButton from "./components/FuelTypeButton";
import Constants from 'expo-constants';

export default function App() {
    const mapRef = useRef(null);
    const apiUrl = Constants.expoConfig?.extra?.apiUrl || "http://default-url";
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
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const today = new Date();
        const formattedDate = new Intl.DateTimeFormat("en-NZ", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(today);
        setCurrentDate(formattedDate);

        const fetchGasStations = async (latitude, longitude) => {
            try {
                const response = await fetch(`${apiUrl}?latitude=${latitude}&longitude=${longitude}`);
                const data = await response.json();
                setGasStations(data.gasStations);

                // Find the station with the lowest price
                updateLowestPriceStation(data.gasStations, selectedFuelType);
            } catch (error) {
                console.error("Error fetching gas stations:", error);
                setErrorMsg("Failed to fetch gas stations.");
            }
        };

        fetchGasStations(initialLocation.coords.latitude, initialLocation.coords.longitude);
    }, [selectedFuelType]);

    useEffect(() => {
        if (viewMode === "map" && lowestPriceStation) {
            // Delay execution to ensure markerRef is set
            setTimeout(() => {
                // Move map center to lowest price station
                if (mapRef.current) {
                    mapRef.current.animateToRegion(
                        {
                            latitude: parseFloat(lowestPriceStation.latitude),
                            longitude: parseFloat(lowestPriceStation.longitude),
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        },
                        1000
                    );
                }

                // Show the callout for the lowest price station
                if (mapRef.current && mapRef.current.markerRef) {
                    mapRef.current.markerRef.showCallout();
                }
            }, 1000);
        }
    }, [viewMode, lowestPriceStation]);

    const updateLowestPriceStation = (stations, fuelType) => {
        let minPrice = Infinity;
        let minPriceStation = null;

        stations.forEach((station) => {
            const price = station.prices[station.fuel_types.indexOf(fuelType)];
            if (price < minPrice) {
                minPrice = price;
                minPriceStation = station;
            }
        });

        setLowestPriceStation(minPriceStation);
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

            // Move map center to current location
            if (mapRef.current) {
                mapRef.current.animateToRegion(
                    {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    },
                    1000
                );
            }
        } catch (error) {
            console.log(error);
            setErrorMsg("Failed to get current location.");
        }
    };

    const handleUserLocationChange = (event) => {
        const { coordinate } = event.nativeEvent;

        if (coordinate) {
            setLocation({ coords: coordinate });

            // Move map center to user location
            if (mapRef.current) {
                mapRef.current.animateToRegion(
                    {
                        latitude: coordinate.latitude,
                        longitude: coordinate.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    },
                    1000
                );
            }
        }
    };

    const getSortedGasStations = (stations, fuelType) => {
        return [...stations].sort((a, b) => {
            const priceA = a.prices[a.fuel_types.indexOf(fuelType)];
            const priceB = b.prices[b.fuel_types.indexOf(fuelType)];
            return priceA - priceB;
        });
    };

    const sortedGasStations = getSortedGasStations(gasStations, selectedFuelType);

    const handleFuelTypeChange = (fuelType) => {
        setSelectedFuelType(fuelType);
        updateLowestPriceStation(gasStations, fuelType);
    };

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
                        latitude: initialLocation.coords.latitude,
                        longitude: initialLocation.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    onUserLocationChange={handleUserLocationChange}
                >
                    {gasStations.map((station, index) => (
                        <Marker
                            key={`${index}-${selectedFuelType}`}
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
                                    {station.fuel_types.map((type, i) => {
                                        if (type === selectedFuelType) {
                                            return (
                                                <Text key={i} style={styles.calloutPrice}>
                                                    {type} - ${station.prices[i].toFixed(2)}
                                                </Text>
                                            );
                                        }
                                        return null;
                                    })}
                                    <Text style={styles.calloutDate}>{currentDate}</Text>
                                    <Text style={styles.calloutTitle}>{station.location_name}</Text>
                                    <Text style={styles.calloutAddress}>{station.address_line1}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
            ) : (
                <ScrollView style={styles.list}>
                    {sortedGasStations.map((station, index) => (
                        <FuelCard key={index} index={index} station={station} selectedFuelType={selectedFuelType} />
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
                        setSelectedFuelType={handleFuelTypeChange}
                        onPress={() => handleFuelTypeChange(selectedFuelType === "Unleaded 91" ? null : "Unleaded 91")}
                    />
                    <FuelTypeButton
                        fuelType="Unleaded 95"
                        label="95"
                        selectedFuelType={selectedFuelType}
                        setSelectedFuelType={handleFuelTypeChange}
                        onPress={() => handleFuelTypeChange(selectedFuelType === "Unleaded 95" ? null : "Unleaded 95")}
                    />
                    <FuelTypeButton
                        fuelType="Unleaded 98"
                        label="98"
                        selectedFuelType={selectedFuelType}
                        setSelectedFuelType={handleFuelTypeChange}
                        onPress={() => handleFuelTypeChange(selectedFuelType === "Unleaded 98" ? null : "Unleaded 98")}
                    />
                    <FuelTypeButton
                        fuelType="Diesel"
                        label="D"
                        selectedFuelType={selectedFuelType}
                        setSelectedFuelType={handleFuelTypeChange}
                        onPress={() => handleFuelTypeChange(selectedFuelType === "Diesel" ? null : "Diesel")}
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
        height: "93%",
    },
    list: {
        width: "100%",
        flex: 1,
        padding: 5,
        backgroundColor: "#F8F9FA",
    },
    listItem: {
        padding: 5,
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
        padding: 3,
        borderRadius: 10,
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
    },
    calloutPrice: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
        lineHeight: 24,
    },
    calloutDate: {
        fontSize: 16,
        color: "#555",
        marginBottom: 5,
        lineHeight: 20,
    },
    calloutTitle: {
        fontSize: 14,
        color: "#333",
        marginBottom: 5,
        lineHeight: 20,
    },
    calloutAddress: {
        fontSize: 12,
        color: "#777",
        lineHeight: 18,
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
