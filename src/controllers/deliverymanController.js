const connection = require("../mysql-connection");
const { handleError } = require('./../services/errorService');

exports.getAll = function (req, res) {
  getAll((err, rows) => {
    if (err) return handleError(err, res);
    res.json(rows);
  });
};

exports.getByName = function (req, res) {
  getByName2(req, (err, rows) => {
    if (err) return handleError(err, res);
    res.json(rows);
  });
};

exports.post = function (req, res) {
  insert(req, (err, rows) => {
    if (err) return handleError(err, res);
    res.json(rows);
  });
};

exports.put = function (req, res) {
  update(req, (err, rows) => {
    if (err) return handleError(err, res);
    res.json(rows);
  });
};

exports.delete = function (req, res) {
  delete2(req, (err, rows) => {
    if (err) return handleError(err, res);
    res.json(rows);
  });
};

////////////////////////////////////////////////////////////////////////////////////

const getAll = (callback) => {
  let sql = `SELECT *
             FROM UsuariosNet
             ORDER BY name`;
  connection.query(sql, function (error, rows) {
    return callback(error, rows);
  });
};

const getByName2 = (req, callback) => {
  const stringParam = `%${req.query.name}%`;
  const params = [stringParam, stringParam];
  let sql = `SELECT *
             FROM UsuariosNet
             WHERE (name LIKE ?)
             ORDER BY name`;
  connection.query(sql, params, function (error, rows) {
    return callback(error, rows);
  });
};

const insert = (req, callback) => {
  const dados = req.body;
  const sql = `INSERT INTO UsuariosNet ( 
                email,
                password,
                name 
              ) 
              VALUES ( ?,?,? )`;
  const params = [dados.email,dados.password,dados.name];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};

const update = (req, callback) => {
  const dados = req.body;
  const sql = `UPDATE UsuariosNet 
                SET name = ?, email = ?, password = ?
                WHERE Id = ?`;
  const params = [
    dados.name,
    dados.email,
    dados.password,
    dados.Id,
  ];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};

const delete2 = (req, callback) => {
  const { Id } = req.query;
  const sql = "DELETE FROM UsuariosNet WHERE Id = ?";
  const params = [Id];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};
