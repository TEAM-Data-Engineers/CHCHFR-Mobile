import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Badge = ({ fuelType, price, highlighted }) => {
    return (
        <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: getBackgroundColor(fuelType, highlighted) }]}>
                <Text style={[styles.badgeText, { color: highlighted ? '#FFFFFF' : getTextColor(fuelType) }]}>{fuelType}</Text>
            </View>
            <View style={[styles.badgePrice, { backgroundColor: getBackgroundColor(fuelType, highlighted) }]}>
                <Text style={[styles.priceText, { color: highlighted ? '#FFFFFF' : getTextColor(fuelType) }]}>${price}</Text>
            </View>
        </View>
    );
};

const getBackgroundColor = (fuelType, isSelected) => {
    if (isSelected) return '#6200ee'; 
    switch (fuelType) {
        case 'Diesel':
            return '#505050';
        case 'Unleaded 91':
            return '#87CEFA'; 
        case 'Unleaded 95':
            return '#FFD580'; 
        case 'Unleaded 98':
            return '#FF7F7F'; 
        default:
            return '#DDD'; 
    }
};

const getTextColor = (fuelType) => {
    switch (fuelType) {
        case 'Diesel':
            return '#FFFFFF';
        case 'Unleaded 91':
            return '#000000'; 
        case 'Unleaded 95':
            return '#000000'; 
        case 'Unleaded 98':
            return '#000000'; 
        default:
            return '#000000'; 
    }
};

const styles = StyleSheet.create({
    badgeContainer: {
        alignItems: "center",
        marginRight: 5,
    },
    badge: {
        width: 80,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    badgePrice: {
        width: 80,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    badgeText: {
        fontWeight: "bold",
        fontSize: 12,
        textAlign: "center",
        paddingVertical: 5,
    },
    priceText: {
        textAlign: "center",
        fontSize: 18,
        fontFamily: "monospace",
        paddingVertical: 3,
    }
});

export default Badge;
