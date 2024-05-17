// FuelTypeButton.js
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const FuelTypeButton = ({ fuelType, label, selectedFuelType, setSelectedFuelType }) => {
    const [isSelected, setIsSelected] = useState(selectedFuelType === fuelType);

    useEffect(() => {
        setIsSelected(selectedFuelType === fuelType);
    }, [selectedFuelType]);

    return (
        <TouchableOpacity
            style={[styles.fuelTypeButton, isSelected && styles.fuelTypeButtonSelected, { backgroundColor: getBackgroundColor(fuelType, isSelected) }]}
            onPress={() => setSelectedFuelType(fuelType)}
        >
            <Text style={styles.fuelTypeButtonText}>{label}</Text>
        </TouchableOpacity>
    );
};

const getBackgroundColor = (fuelType, isSelected) => {
    if (isSelected) return '#6200ee'; 
    switch (fuelType) {
        case 'Diesel':
            return '#000000'; 
        case 'Unleaded 91':
            return '#00BFFF'; 
        case 'Unleaded 95':
            return '#FFA500'; 
        case 'Unleaded 98':
            return '#FF4500'; 
        default:
            return '#DDD'; 
    }
};

const styles = StyleSheet.create({
    fuelTypeButton: {
        borderRadius: 40,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    fuelTypeButtonSelected: {
        backgroundColor: '#000',
    },
    fuelTypeButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default FuelTypeButton;
