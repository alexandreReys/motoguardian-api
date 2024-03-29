const connection = require("../mysql-connection");
const { handleError } = require('./../services/errorService');

exports.getAll = function (req, res) {
    getAll((err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};

exports.getAllNotAppList = function (req, res) {
    getAllNotAppList((err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};

exports.getSelected = function (req, res) {
    getSelected((err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};

exports.getByDescription = function (req, res) {
    getByDescription2(req, (err, rows) => {
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
    updateCategoryProduct(req, () => {
        updateCategory(req, (err, rows) => {
            if (err) return handleError(err, res);
            res.json(rows);
        });
    });

    function updateCategory(req, callback) {
        const dados = req.body;
        const sql = `UPDATE delivery_category 
                    SET DescriptionCategory = ?
                    WHERE IdCategory = ?`;
        const params = [
            dados.DescriptionCategory,
            dados.IdCategory,
        ];
        connection.query(sql, params, function (err, rows) {
            return callback(err, rows);
        });
    };

    function updateCategoryProduct(req, callback) {
        const dados = req.body;
        const sql = `UPDATE produtosvinho  
                     SET TipoVinho = ?
                     WHERE TipoVinho = ?`;
        const params = [
            dados.DescriptionCategory,
            dados.PreviousDescriptionCategory,
        ];
        connection.query(sql, params, function (err, rows) {
            return callback();
        });
    };
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
             FROM delivery_category
             ORDER BY DescriptionCategory`;
    connection.query(sql, function (error, rows) {
        return callback(error, rows);
    });
};

const getAllNotAppList = (callback) => {
    let sql = `SELECT *
             FROM delivery_category
             WHERE ShowAppListCategory = 0 
             ORDER BY DescriptionCategory`;
    connection.query(sql, function (error, rows) {
        return callback(error, rows);
    });
};

const getSelected = (callback) => {
    let sql = `SELECT *
             FROM delivery_category
             WHERE ShowAppSearchCategory <> 0 
             ORDER BY ShowAppSearchCategory desc, DescriptionCategory`;
    connection.query(sql, function (error, rows) {
        return callback(error, rows);
    });
};

const getByDescription2 = (req, callback) => {
    const stringParam = `%${req.query.DescriptionCategory}%`;
    const params = [stringParam];
    let sql = `SELECT *
             FROM delivery_category
             WHERE (DescriptionCategory LIKE ?)
             ORDER BY DescriptionCategory`;
    connection.query(sql, params, function (error, rows) {
        return callback(error, rows);
    });
};

const insert = (req, callback) => {
    const dados = req.body;
    const sql = `INSERT INTO delivery_category ( 
                DescriptionCategory 
              ) 
              VALUES ( ? )`;
    const params = [dados.DescriptionCategory];
    connection.query(sql, params, function (err, rows) {
        return callback(err, rows);
    });
};

const delete2 = (req, callback) => {
    const { IdCategory } = req.query;
    const sql = "DELETE FROM delivery_category WHERE IdCategory = ?";
    const params = [IdCategory];
    connection.query(sql, params, function (err, rows) {
        return callback(err, rows);
    });
};
