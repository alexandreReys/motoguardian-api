require("dotenv").config();
const axios = require("axios");

exports.getGoogleDistanceMatrix = async (sellerAddress, customerAddress) => {
    const urlBase = "https://maps.googleapis.com/maps/api/distancematrix/json";
    const googleApiKey = process.env.GOOGLE_API_KEY;

    const url = `${urlBase}?origins=${sellerAddress}&destinations=${customerAddress}&key=${googleApiKey}`;
    var response;
    try {
        response = await axios.get(url);
    } catch (error) {
        console.error("getGoogleDistanceMatrix / axios.get(url)", error);
        return error
    };
    return response.data;
};
