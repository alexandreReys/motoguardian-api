var connection = require("../mysql-connection");

exports.getAll = function (req, res) {
  getAll((err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.getByDescricao = function (req, res) {
  getByDescricao(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.post = function (req, res) {
  insertVeiculo(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.put = function (req, res) {
  updateVeiculo(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.delete = function (req, res) {
  deleteVeiculo(req, (err, rows) => {
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

const getAll = (callback) => {
  let sql = `SELECT *
             FROM Veiculos
             ORDER BY DescricaoVeiculo`;
  connection.query(sql, function (error, rows) {
    return callback(error, rows);
  });
};

const getByDescricao = (req, callback) => {
  const stringParam = `%${req.query.descricaoVeiculo}%`;
  const params = [stringParam, stringParam];
  let sql = `SELECT *
             FROM Veiculos
             WHERE (DescricaoVeiculo LIKE ?) or (ModeloVeiculo LIKE ?)
             ORDER BY DescricaoVeiculo`;
  connection.query(sql, params, function (error, rows) {
    return callback(error, rows);
  });
};

const insertVeiculo = (req, callback) => {
  const dados = req.body;
  const sql = `
    INSERT INTO Veiculos ( 
      IdClienteVeiculo,
      DescricaoVeiculo,
      PlacaVeiculo,
      MarcaVeiculo,
      ModeloVeiculo,
      AnoVeiculo,
      CorVeiculo
    ) VALUES ( 
        ?,?,?,?,?,?,? 
      )`;
  const params = [
    dados.IdClienteVeiculo,
    dados.DescricaoVeiculo,
    dados.PlacaVeiculo,
    dados.MarcaVeiculo,
    dados.ModeloVeiculo,
    dados.AnoVeiculo,
    dados.CorVeiculo,
  ];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};

const updateVeiculo = (req, callback) => {
  const dados = req.body;
  const sql = `
    UPDATE Veiculos SET 
      IdClienteVeiculo = ?,
      DescricaoVeiculo = ?,
      PlacaVeiculo = ?,
      MarcaVeiculo = ?,
      ModeloVeiculo = ?,
      AnoVeiculo = ?,
      CorVeiculo = ?
    WHERE 
      idVeiculo = ?`;
  const params = [
    dados.IdClienteVeiculo,
    dados.DescricaoVeiculo,
    dados.PlacaVeiculo,
    dados.MarcaVeiculo,
    dados.ModeloVeiculo,
    dados.AnoVeiculo,
    dados.CorVeiculo,
    dados.IdVeiculo,
  ];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};

const deleteVeiculo = (req, callback) => {
  const { idVeiculo } = req.query;
  const sql = "DELETE FROM Veiculos WHERE idVeiculo = ?";
  const params = [idVeiculo];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};
