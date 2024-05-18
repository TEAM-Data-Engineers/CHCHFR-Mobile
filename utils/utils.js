export const getBackgroundColor = (fuelType, isSelected) => {
    if (isSelected) return "#6200ee";
    switch (fuelType) {
        case "Diesel":
            return "#000000";
        case "Unleaded 91":
            return "#00BFFF";
        case "Unleaded 95":
            return "#FFA500";
        case "Unleaded 98":
            return "#FF4500";
        default:
            return "#DDD";
    }
};

export const formatPrice = (price) => {    
    if (price === undefined || price === null) {
        return "N/A";
    }

    if(typeof price === "string") {
        price = parseFloat(price);
    }

    if (typeof price !== "number" || isNaN(price)) {
        return "N/A";
    }

    return price.toFixed(2);
};