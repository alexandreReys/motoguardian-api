const connection = require("../../mysql-connection");

exports.getAll = (callback) => {
    let sql = `SELECT *
               FROM delivery_customers
               ORDER BY nameCustomer`;
    connection.query(sql, function (error, rows) {
        return callback(error, rows);
    });
};

exports.getByName = (req, callback) => {
    const stringParam = `%${req.params.name}%`;

    const params = [stringParam, stringParam];
    let sql = `SELECT *
               FROM delivery_customers
               WHERE (nameCustomer LIKE ?)
               ORDER BY nameCustomer`;
    connection.query(sql, params, function (error, rows) {
        return callback(error, rows);
    });
};

exports.insert = (req, callback) => {
    const dados = req.body;
    const sql = `INSERT INTO delivery_customers ( 
                    EmailCustomer,
                    PasswordCustomer,
                    NameCustomer
                ) 
                VALUES ( ?,?,? )`;
    const params = [dados.EmailCustomer, dados.PasswordCustomer, dados.NameCustomer];
    connection.query(sql, params, function (err, rows) {
        return callback(err, rows);
    });
};

exports.update = (req, callback) => {
    const dados = req.body;
    const sql = `UPDATE delivery_customers 
                  SET EmailCustomer = ?, PasswordCustomer = ?, NameCustomer = ?
                  WHERE IdCustomer = ?`;
    const params = [
        dados.EmailCustomer,
        dados.PasswordCustomer,
        dados.NameCustomer,
        dados.IdCustomer,
    ];
    connection.query(sql, params, function (err, rows) {
        return callback(err, rows);
    });
};

exports.delete = (req, callback) => {
    const { IdCustomer } = req.query;
    const sql = "DELETE FROM delivery_customers WHERE IdCustomer = ?";
    const params = [IdCustomer];
    connection.query(sql, params, function (err, rows) {
        return callback(err, rows);
    });
};
