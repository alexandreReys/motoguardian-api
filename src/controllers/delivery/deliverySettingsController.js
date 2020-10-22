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
                AddressSellerSettings, ShippingTaxSettings 
              ) 
              VALUES ( ?, ? )`;
  const params = [dados.AddressSellerSettings, dados.ShippingTaxSettings];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};

const update = (req, callback) => {
  const dados = req.body;
  const sql = `UPDATE delivery_settings 
                SET AddressSellerSettings = ?, ShippingTaxSettings = ? 
                WHERE IdSettings = ?`;
  const params = [
    dados.AddressSellerSettings,
    dados.ShippingTaxSettings,
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
