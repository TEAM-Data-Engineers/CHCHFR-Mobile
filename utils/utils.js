export const getBackgroundColor = (fuelType, isSelected) => {
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