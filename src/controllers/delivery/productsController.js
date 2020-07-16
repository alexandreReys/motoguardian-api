const connection = require("../../mysql-connection");
const fs = require("fs");
const gdrive = require("../../services/gdrive/gdrive");
const groupedMax5 = require("../../utils/groupBy");

exports.getAll = function (req, res) {
  getAll((err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.getProductsByName = function (req, res) {
  getByName(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.getProductsByCategory = function (req, res) {
  getByCategory(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.getProductsGroupedByCategory = function (req, res) {
  getAll((err, rows) => {
    if (err) return handleError(err);
    let products = JSON.parse(JSON.stringify(rows));
    products = groupedMax5(products, "TipoVinho");
    res.send(products);
  });
};

exports.post = function (req, res) {
  insertVinho(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.postImage = function (req, res) {
  const request = req.file;
  gdrive.imageUpload(request.filename, request.path, (id) => {
    fs.unlink(request.path, function (err) {
      if (err) throw err;
    });
    const resp = `https://drive.google.com/uc?export=view&id=${id}`;
    return res.json({ id: resp });
  });
};

exports.put = function (req, res) {
  updateVinho(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.delete = function (req, res) {
  deleteVinho(req, (err, rows) => {
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
             FROM ProdutosVinho
             ORDER BY DescricaoVinho`;
  connection.query(sql, function (error, rows) {
    return callback(error, rows);
  });
};

const getByCategory = (req, callback) => {
  const params = [req.query.Category];
  let sql = `SELECT *
             FROM ProdutosVinho
             WHERE (TipoVinho LIKE ?)
             ORDER BY TipoVinho, DescricaoVinho`;
  connection.query(sql, params, function (error, rows) {
    return callback(error, rows);
  });
};

const getByName = (req, callback) => {
  const stringParam = `%${req.query.DescricaoVinho}%`;
  const params = [stringParam, stringParam];
  let sql = `SELECT *
             FROM ProdutosVinho
             WHERE (DescricaoVinho LIKE ?)
             ORDER BY DescricaoVinho`;
  connection.query(sql, params, function (error, rows) {
    return callback(error, rows);
  });
};

const getFiveByCategory = (req, callback) => {
  const stringParam = `%${req.query.Category}%`;
  const params = [stringParam, stringParam];
  let sql = `SELECT *
             FROM ProdutosVinho
             WHERE (TipoVinho LIKE ?)
             ORDER BY DescricaoVinho`;
  //   LIMIT 0,5`;
  connection.query(sql, params, function (error, rows) {
    resultArray = JSON.parse(JSON.stringify(rows));
    console.log(resultArray);
    return callback(error, rows);
  });
};

const insertVinho = (req, callback) => {
  const dados = req.body;
  const sql = `INSERT INTO ProdutosVinho ( 
      DescricaoVinho, 
      PrecoVinho,
      TipoVinho,
      ClassificacaoVinho,
      PaisVinho,
      GarrafaVinho,
      ComentarioVinho,
      CodigoErpVinho,
      Imagem1Vinho,
      Imagem2Vinho,
      Imagem3Vinho
    ) 
    VALUES ( 
      ?,?,?, ?,?,?, ?,?,?, ?,?
    )`;
  const params = [
    dados.DescricaoVinho,
    dados.PrecoVinho,
    dados.TipoVinho,
    dados.ClassificacaoVinho,
    dados.PaisVinho,
    dados.GarrafaVinho,
    dados.ComentarioVinho,
    dados.CodigoErpVinho,
    dados.Imagem1Vinho,
    dados.Imagem2Vinho,
    dados.Imagem3Vinho,
  ];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};

const updateVinho = (req, callback) => {
  const dados = req.body;
  const sql = `UPDATE ProdutosVinho 
     SET 
       DescricaoVinho = ?,
       PrecoVinho = ?,
       TipoVinho = ?,
       ClassificacaoVinho = ?,
       PaisVinho = ?,
       GarrafaVinho = ?,
       ComentarioVinho = ?,
       CodigoErpVinho = ?,
       Imagem1Vinho = ?,
       Imagem2Vinho = ?,
       Imagem3Vinho = ?
    WHERE 
      idVinho = ?`;
  const params = [
    dados.DescricaoVinho,
    dados.PrecoVinho,
    dados.TipoVinho,
    dados.ClassificacaoVinho,
    dados.PaisVinho,
    dados.GarrafaVinho,
    dados.ComentarioVinho,
    dados.CodigoErpVinho,
    dados.Imagem1Vinho,
    dados.Imagem2Vinho,
    dados.Imagem3Vinho,
    dados.IdVinho,
  ];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};

const deleteVinho = (req, callback) => {
  const { IdVinho } = req.query;
  const sql = "DELETE FROM ProdutosVinho WHERE IdVinho = ?";
  const params = [IdVinho];
  connection.query(sql, params, function (err, rows) {
    return callback(err, rows);
  });
};
