export default ({ config }) => {
    return {
        ...config,
        extra: {
            apiUrl: process.env.API_URL || "http://team.hua.nz/web/api/v1/gas-stations",
        },
    };
};
