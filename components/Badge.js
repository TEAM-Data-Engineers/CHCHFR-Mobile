import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Badge = ({ fuelType, price, highlighted }) => {
    return (
        <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: getBackgroundColor(fuelType, highlighted) }]}>
                <Text style={[styles.badgeText, { color: highlighted ? '#FFFFFF' : getTextColor(fuelType) }]}>{fuelType}</Text>
            </View>
            <View style={[styles.badgePrice, { backgroundColor: getBackgroundColor(fuelType, highlighted) }]}>
                <Text style={[styles.priceText, { color: highlighted ? '#FFFFFF' : getTextColor(fuelType) }]}>${price.toFixed(2)}</Text>
            </View>
        </View>
    );
};

const getBackgroundColor = (fuelType, isSelected) => {
    if (isSelected) return '#6200ee'; // 选中时的颜色
    switch (fuelType) {
        case 'Diesel':
            return '#505050'; // 浅黑色
        case 'Unleaded 91':
            return '#87CEFA'; // 浅蓝色
        case 'Unleaded 95':
            return '#FFD580'; // 浅橙色
        case 'Unleaded 98':
            return '#FF7F7F'; // 浅红色
        default:
            return '#DDD'; // 默认背景色
    }
};

const getTextColor = (fuelType) => {
    switch (fuelType) {
        case 'Diesel':
            return '#FFFFFF'; // 白色
        case 'Unleaded 91':
            return '#000000'; // 黑色
        case 'Unleaded 95':
            return '#000000'; // 黑色
        case 'Unleaded 98':
            return '#000000'; // 黑色
        default:
            return '#000000'; // 黑色
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
