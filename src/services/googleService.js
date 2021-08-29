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

//https://maps.googleapis.com/maps/api/distancematrix/json?origins=Rua%20Giovanni%20da%20Conegliano,%20130%20-%20Vila%20Liviero,%20S%C3%A3o%20Paulo%20-%20SP,%2004186-020&destinations=Rua%20Giovanni%20da%20Conegliano,%201130%20-%20Vila%20Liviero,%20S%C3%A3o%20Paulo%20-%20SP,%2004186-020&key=AIzaSyB5IWWfcdld42TCGEV9FogbKZnLJf4s1xU
