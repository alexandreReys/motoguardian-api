var connection = require("../mysql-connection");

exports.getAll = function (req, res) {
  getAll((err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.getByFantasia = function (req, res) {
  getByFantasia(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.post = function (req, res) {
  insertOficina(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.put = function (req, res) {
  updateOficina(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.delete = function (req, res) {
  deleteOficina(req, (err, rows) => {
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
             FROM Oficinas
             ORDER BY fantasiaOficina`;
  connection.query(sql, function (error, rows) {
    return callback(error, rows);
  });
};

const getByFantasia = (req, callback) => {
  const stringParam = `%${req.query.fantasiaOficina}%`;
  const params = [stringParam, stringParam];
  let sql = `SELECT *
             FROM Oficinas
             WHERE (FantasiaOficina LIKE ?) or (NomeOficina LIKE ?)
             ORDER BY FantasiaOficina`;
  connection.query(sql, params, function (error, rows) {
    return callback(error, rows);
  });
};

const insertOficina = (req, callback) => {
  const dados = req.body;
  const sql = `INSERT INTO Oficinas ( 
      FantasiaOficina, 
      NomeOficina, 
      EnderecoOficina, 
      NumeroOficina, 
      BairroOficina, 
      CidadeOficina, 
      EstadoOficina, 
      CepOficina, 
      ContatoOficina, 
      TelefoneOficina 
    ) 
    VALUES ( 
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ? 
    )`;
  const params = [
    dados.FantasiaOficina,
    dados.NomeOficina,
    dados.EnderecoOficina,
    dados.NumeroOficina,
    dados.BairroOficina,
    dados.CidadeOficina,
    dados.EstadoOficina,
    dados.CepOficina,
    dados.ContatoOficina,
    dados.TelefoneOficina,
  ];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};

const updateOficina = (req, callback) => {
  const dados = req.body;
  const sql = `UPDATE Oficinas 
     SET 
      FantasiaOficina = ?, 
      NomeOficina = ?, 
      EnderecoOficina = ?, 
      NumeroOficina = ?, 
      BairroOficina = ?, 
      CidadeOficina = ?, 
      EstadoOficina = ?, 
      CepOficina = ?, 
      ContatoOficina = ?, 
      TelefoneOficina = ? 
    WHERE 
      idOficina = ?`;
  const params = [
    dados.FantasiaOficina,
    dados.NomeOficina,
    dados.EnderecoOficina,
    dados.NumeroOficina,
    dados.BairroOficina,
    dados.CidadeOficina,
    dados.EstadoOficina,
    dados.CepOficina,
    dados.ContatoOficina,
    dados.TelefoneOficina,
    dados.IdOficina,
  ];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};

const deleteOficina = (req, callback) => {
  const { idOficina } = req.query;
  const sql = "DELETE FROM Oficinas WHERE idOficina = ?";
  const params = [idOficina];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};
