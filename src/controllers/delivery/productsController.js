require('dotenv').config();

const fs = require("fs");
const { cloudinary } = require("../../config/cloudinary");

const connection = require("../../mysql-connection");
const groupedMax6 = require("../../utils/groupBy");
const productsRepository = require("../../repositories/delivery/productsRepository");

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

exports.getActiveProductsByName = function (req, res) {
    getActivesByName(req, (err, rows) => {
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

exports.getActiveProductsByCategory = function (req, res) {
    getActivesByCategory(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.getActiveProductsInPromotion = function (req, res) {
    getActivesInPromotion((err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.getProductsGroupedByCategory = function (req, res) {
    getActiveProducts((err, rows) => {
        if (err) return handleError(err);
        let products = JSON.parse(JSON.stringify(rows));

        console.log("==========================================================");
        console.log("================>>   products", products);

        products = groupedMax6(products, "TipoVinho");
        res.send(products);
    });
};

exports.post = function (req, res) {
    productsRepository.insertVinho(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.put = function (req, res) {
    updateVinho(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.deactivate = function (req, res) {
    deactivateProduct(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.promotion = function (req, res) {
    promotionProduct(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.promotionalPrice = function (req, res) {
    setPromotionalPrice(req, (err, rows) => {
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

exports.uploadProductImage = async function (req, res) {
    console.log("process.env.CLOUDINARY_UPLOAD_PRESET", process.env.CLOUDINARY_UPLOAD_PRESET);
    
    try {
        const base64Image = req.body.data;

        const response = await cloudinary.uploader.upload(
            base64Image,
            { upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET }
        );

        res.json({
            url: response.url,
            public_id: response.public_id,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({ err: "Something went wrong" });
    };
};

exports.deleteProductImage = async function (req, res) {
    try {
        if (!req.query.Imagem1IdVinho) {
            res.json({ msg: "OK" });
            return;
        };

        const publicId = req.query.Imagem1IdVinho;

        await cloudinary.uploader.destroy(publicId);
        res.json({ msg: "OK" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: "Something went wrong" });
    };
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

const getActiveProducts = (callback) => {
    let sql = `SELECT *
             FROM ProdutosVinho
             WHERE StatusVinho <> 0 
             ORDER BY DescricaoVinho`;
    connection.query(sql, function (error, rows) {
        return callback(error, rows);
    });
};

const getByCategory = (req, callback) => {
    const params = [req.query.Category];
    let sql = `SELECT * FROM ProdutosVinho
             WHERE (TipoVinho LIKE ?)
             ORDER BY TipoVinho, DescricaoVinho`;
    connection.query(sql, params, function (error, rows) {
        return callback(error, rows);
    });
};

const getActivesByCategory = (req, callback) => {
    const params = [req.query.Category];
    let sql = `SELECT * FROM ProdutosVinho
             WHERE (TipoVinho LIKE ?) and (StatusVinho <> 0)
             ORDER BY TipoVinho, DescricaoVinho`;
    connection.query(sql, params, function (error, rows) {
        return callback(error, rows);
    });
};

const getActivesInPromotion = (callback) => {
    let sql = `SELECT * FROM ProdutosVinho
             WHERE (EmPromocaoVinho = 1) and (StatusVinho <> 0)
             ORDER BY DescricaoVinho`;
    connection.query(sql, [], function (error, rows) {
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

const getActivesByName = (req, callback) => {
    const stringParam = `%${req.query.DescricaoVinho}%`;
    const params = [stringParam, stringParam];
    let sql = `SELECT *
             FROM ProdutosVinho
             WHERE (DescricaoVinho LIKE ?) and (StatusVinho <> 0)
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
        return callback(error, rows);
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
       Imagem1IdVinho = ?,
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
        dados.Imagem1IdVinho,
        dados.Imagem2Vinho,
        dados.Imagem3Vinho,
        dados.IdVinho,
    ];
    connection.query(sql, params, function (err, rows) {
        return callback(err, rows);
    });
};

const deactivateProduct = (req, callback) => {
    const dados = req.body;
    const sql =
        `UPDATE ProdutosVinho 
     SET StatusVinho = ? 
     WHERE IdVinho = ?`;
    const params = [dados.StatusVinho, dados.IdVinho];
    connection.query(sql, params, function (err, rows) {
        return callback(err, rows);
    });
};

const promotionProduct = (req, callback) => {
    const dados = req.body;
    const sql =
        `UPDATE ProdutosVinho 
     SET EmPromocaoVinho = ? 
     WHERE IdVinho = ?`;
    const params = [dados.EmPromocaoVinho, dados.IdVinho];
    connection.query(sql, params, function (err, rows) {
        return callback(err, rows);
    });
};

const setPromotionalPrice = (req, callback) => {
    const dados = req.body;
    const sql =
        `UPDATE ProdutosVinho 
     SET PrecoPromocionalVinho = ? 
     WHERE IdVinho = ?`;
    const params = [dados.PrecoPromocionalVinho, dados.IdVinho];
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
