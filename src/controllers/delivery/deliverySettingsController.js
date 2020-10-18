const axios = require("axios");
const connection = require("../../mysql-connection");

exports.getAll = function (req, res) {
  get_all((err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.post = function (req, res) {
  insert(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.put = function (req, res) {
  update(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.delete = function (req, res) {
  delete2(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.getDistance = function (req, res) {
  get_distance(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

////////////////////////////////////////////////////////////////////////////////////

const handleError = (err) => {
  if (err.code == "ECONNRESET") {
    console.log("Erro Query", err.code);
    res.status(400).send({ message: "ECONNRESET" });
  } else {
    throw err;
  }
};

const get_all = (callback) => {
  let sql = `SELECT *
             FROM delivery_settings
             ORDER BY IdSettings`;
  connection.query(sql, function (error, rows) {
    return callback(error, rows);
  });
};

const insert = (req, callback) => {
  const dados = req.body;
  const sql = `INSERT INTO delivery_settings ( 
                AddressSellerSettings 
              ) 
              VALUES ( ? )`;
  const params = [dados.AddressSellerSettings];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};

const update = (req, callback) => {
  const dados = req.body;
  const sql = `UPDATE delivery_settings 
                SET AddressSellerSettings = ?
                WHERE IdSettings = ?`;
  const params = [
    dados.AddressSellerSettings,
    dados.IdSettings,
  ];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};

const delete2 = (req, callback) => {
  const { IdSettings } = req.query;
  const sql = "DELETE FROM delivery_settings WHERE IdSettings = ?";
  const params = [IdSettings];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};

const get_distance = async (req, callback) => {
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

const getGoogleDistanceMatrix = async (sellerAddress, customerAddress) => {
  const urlBase = "https://maps.googleapis.com/maps/api/distancematrix/json";
  const googleApiKey = "AIzaSyB5IWWfcdld42TCGEV9FogbKZnLJf4s1xU";

  const url = `${urlBase}?origins=${sellerAddress}&destinations=${customerAddress}&key=${googleApiKey}`;

  var response;
  try {
    response = await axios.get(url);
  } catch (error) { 
    return error 
  };
  
  return response.data;
};
