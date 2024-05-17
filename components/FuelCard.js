import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import Badge from "./Badge";
import { getBackgroundColor } from "../utils/utils";

const FuelCard = ({ station, selectedFuelType, index }) => {
    const backgroundColor = getBackgroundColor(selectedFuelType, false);
    const sortedFuelTypes = ["Unleaded 91", "Unleaded 95", "Unleaded 98", "Diesel"];

    return (
        <Card key={index} style={styles.card}>
            <Card.Content>
                <View style={styles.titleContainer}>
                    <Title style={styles.title}>{station.location_name}</Title>
                    <View style={[styles.indexCircle, { backgroundColor }]}>
                        <Text style={styles.indexText}>{index + 1}</Text>
                    </View>
                </View>
                <View style={styles.badgeContainer} key={`badgeContainer-${index}`}>
                    {sortedFuelTypes.map((type) => {
                        const i = station.fuel_types.indexOf(type);
                        if (i !== -1) {
                            return (
                                <Badge
                                    key={`${type}-${i}`}
                                    fuelType={type}
                                    price={station.prices[i]}
                                    highlighted={type === selectedFuelType}
                                />
                            );
                        }
                        return null;
                    })}
                </View>
                <Paragraph style={styles.address}>
                    {station.address_line1}, {station.city}, {station.state_province}, {station.country}
                </Paragraph>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 5,
        borderRadius: 10,
        elevation: 4,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    indexCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#6200ee",
        justifyContent: "center",
        alignItems: "center",
    },
    indexText: {
        color: "#fff",
        fontWeight: "bold",
    },
    badgeContainer: {
        flexDirection: "row",
        marginVertical: 10,
    },
    address: {
        marginTop: 10,
        fontSize: 14,
        color: "gray",
    },
});

export default FuelCard;
