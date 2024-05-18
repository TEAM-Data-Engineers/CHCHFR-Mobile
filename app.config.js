export default ({ config }) => {
    return {
        ...config,
        extra: {
            apiUrl: process.env.API_URL || "http://3.25.85.38:5002/api/v1/gas-stations",
        },
    };
};
