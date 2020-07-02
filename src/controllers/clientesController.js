const connection = require("../mysql-connection");
const fs = require("fs");
const gdrive = require("../services/gdrive/gdrive");

exports.getAll = function (req, res) {
  getAll((err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.getByNome = function (req, res) {
  getByNome(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.post = function (req, res) {
  insertCliente(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.postImage = function (req, res) {
  gdrive.imageUpload(req.file.filename, req.file.path, (id) => {
    fs.unlink(req.file.path, function (err) {
      if (err) throw err;
    });
    return res.json({ googledriveId: id });
  });
};

exports.put = function (req, res) {
  updateCliente(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.delete = function (req, res) {
  deleteCliente(req, (err, rows) => {
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
             FROM Clientes
             ORDER BY NomeCliente`;
  connection.query(sql, function (error, rows) {
    return callback(error, rows);
  });
};

const getByNome = (req, callback) => {
  const stringParam = `%${req.query.nomeCliente}%`;
  const params = [stringParam, stringParam];
  let sql = `SELECT *
             FROM Clientes
             WHERE (NomeCliente LIKE ?)
             ORDER BY NomeCliente`;
  connection.query(sql, params, function (error, rows) {
    return callback(error, rows);
  });
};

const insertCliente = (req, callback) => {
  const dados = req.body;
  const sql = `INSERT INTO Clientes ( 
      NomeCliente, 
      EnderecoCliente, 
      NumeroCliente, 
      BairroCliente, 
      CidadeCliente, 
      EstadoCliente, 
      CepCliente, 
      TelefoneCliente 
    ) 
    VALUES ( 
      ?, ?, ?, ?, ?, ?, ?, ? 
    )`;
  const params = [
    dados.NomeCliente,
    dados.EnderecoCliente,
    dados.NumeroCliente,
    dados.BairroCliente,
    dados.CidadeCliente,
    dados.EstadoCliente,
    dados.CepCliente,
    dados.TelefoneCliente,
  ];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};

const updateCliente = (req, callback) => {
  const dados = req.body;
  const sql = `UPDATE Clientes 
     SET 
      NomeCliente = ?, 
      EnderecoCliente = ?, 
      NumeroCliente = ?, 
      BairroCliente = ?, 
      CidadeCliente = ?, 
      EstadoCliente = ?, 
      CepCliente = ?, 
      TelefoneCliente = ? 
    WHERE 
      idCliente = ?`;
  const params = [
    dados.NomeCliente,
    dados.EnderecoCliente,
    dados.NumeroCliente,
    dados.BairroCliente,
    dados.CidadeCliente,
    dados.EstadoCliente,
    dados.CepCliente,
    dados.TelefoneCliente,
    dados.IdCliente,
  ];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};

const deleteCliente = (req, callback) => {
  const { idCliente } = req.query;
  const sql = "DELETE FROM Clientes WHERE idCliente = ?";
  const params = [idCliente];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};
