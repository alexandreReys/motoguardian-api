require("dotenv").config();
const axios = require("axios");
const connection = require("../../mysql-connection");

exports.getAll = function (req, res) {
  get((err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });

  function get(callback) {
    let sql = `SELECT *
               FROM delivery_settings
               ORDER BY IdSettings`;
    connection.query(sql, function (error, rows) {
      return callback(error, rows);
    });
  };
};

exports.post = function (req, res) {
  insert(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });

  function insert(req, callback) {
    const dados = req.body;
    const sql = 
        `INSERT INTO delivery_settings ( 
            AddressSellerSettings, ShippingTaxSettings, 
            AppBannerSettings, AppBannerPublicIdSettings, 
            AppLogoPSettings, AppLogoPPublicIdSettings, 
            WebBannerSettings, WebBannerPublicIdSettings, 
            DeliveryAreaDistance, UrlDeliveryMap, 
            UrlGooglePlay, ContactPhone, 
            ContactEmail, ContactWhatsapp 
        ) 
        VALUES ( ?, ?, ?, ?, ?, ? )`;

    const params = [
        dados.AddressSellerSettings, 
        dados.ShippingTaxSettings,
        dados.AppBannerSettings,
        dados.AppBannerPublicIdSettings,
        dados.AppLogoPSettings,
        dados.AppLogoPPublicIdSettings,
        dados.WebBannerSettings,
        dados.WebBannerPublicIdSettings,
        dados.DeliveryAreaDistance,
        dados.UrlDeliveryMap,
        dados.UrlGooglePlay,
        dados.ContactPhone,
        dados.ContactEmail,
        dados.ContactWhatsapp,
    ];
    connection.query(sql, params, function (err, rows) {
      return callback(err, rows);
    });
  };
};

exports.put = function (req, res) {
  update(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });

  function update(req, callback) {
    const dados = req.body;

    const sql = 
    `UPDATE delivery_settings 
     SET 
        AddressSellerSettings = ?, 

        AppBannerSettings = ?, 
        AppBannerPublicIdSettings = ?, 

        AppBanner2Settings = ?, 
        AppBanner2PublicIdSettings = ?, 

        AppBanner3Settings = ?, 
        AppBanner3PublicIdSettings = ?, 

        AppLogoPSettings = ?, 
        AppLogoPPublicIdSettings = ?, 
        WebBannerSettings = ?, 
        WebBannerPublicIdSettings = ?, 
        UrlDeliveryMap = ?, 
        UrlGooglePlay = ?, 
        ContactPhone = ?, 
        ContactEmail = ?, 
        ContactWhatsapp = ?, 

        DeliveryAreaDistance = ?, 
        ShippingTaxSettings = ?, 
        DeliveryAreaDistance2 = ?, 
        ShippingTax2Settings = ? 
     WHERE IdSettings = ?`;
    
    const params = [
        dados.AddressSellerSettings,
        
        dados.AppBannerSettings,
        dados.AppBannerPublicIdSettings,
        
        dados.AppBanner2Settings,
        dados.AppBanner2PublicIdSettings,
        
        dados.AppBanner3Settings,
        dados.AppBanner3PublicIdSettings,
        
        dados.AppLogoPSettings,
        dados.AppLogoPPublicIdSettings,
        dados.WebBannerSettings,
        dados.WebBannerPublicIdSettings,
        dados.UrlDeliveryMap,
        dados.UrlGooglePlay,
        dados.ContactPhone,
        dados.ContactEmail,
        dados.ContactWhatsapp,
        dados.DeliveryAreaDistance,
        dados.ShippingTaxSettings,
        dados.DeliveryAreaDistance2,
        dados.ShippingTax2Settings,
        dados.IdSettings
    ];

    connection.query(sql, params, function (err, rows) {
      return callback(err, rows);
    });
  };
};

exports.delete = function (req, res) {
  dbDelete(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });

  function dbDelete(req, callback) {
    const { IdSettings } = req.query;
    const sql = "DELETE FROM delivery_settings WHERE IdSettings = ?";
    const params = [IdSettings];
    connection.query(sql, params, function (err, rows) {
      return callback(err, rows);
    });
  };
};

exports.getDistance = function (req, res) {
  get_distance(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });

  async function get_distance(req, callback) {
    let sql = `SELECT AddressSellerSettings
               FROM delivery_settings`;
    connection.query(sql, async function (error, rows) {
      if (error) return callback(error, rows);
  
      let str1 = rows[0].AddressSellerSettings.replace(/ /g, "+");
      const sellerAddress = str1.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
      str1 = req.params.address.replace(/ /g, "+");
      const customerAddress = str1.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
      const distance = await getGoogleDistanceMatrix(sellerAddress, customerAddress);

      return callback(null, distance.rows[0].elements[0]);
    });
  };
  
  async function getGoogleDistanceMatrix(sellerAddress, customerAddress) {
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
};
//https://maps.googleapis.com/maps/api/distancematrix/json?origins=Rua%20Giovanni%20da%20Conegliano,%20130%20-%20Vila%20Liviero,%20S%C3%A3o%20Paulo%20-%20SP,%2004186-020&destinations=Rua%20Giovanni%20da%20Conegliano,%201130%20-%20Vila%20Liviero,%20S%C3%A3o%20Paulo%20-%20SP,%2004186-020&key=AIzaSyB5IWWfcdld42TCGEV9FogbKZnLJf4s1xU
////////////////////////////////////////////////////////////////////////////////////

const handleError = (err) => {
  if (err.code == "ECONNRESET") {
    console.log("Erro Query", err.code);
    res.status(400).send({ message: "ECONNRESET" });
  } else {
    throw err;
  }
};
