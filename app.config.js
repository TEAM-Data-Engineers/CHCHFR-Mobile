export default ({ config }) => {
    return {
        ...config,
        extra: {
            apiUrl: process.env.API_URL || "http://172.20.10.3:5002/api/v1/gas-stations",
        },
    };
};
