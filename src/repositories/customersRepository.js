const connection = require('../mysql-connection');
const { sendMail } = require('../services/emailService');

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

// async / await
exports.insert = async (req, callback) => {
    let result;
    try {
        result = await checkEmail();
    } catch (err) {
        handleError(err);
    };
    
    if (!!result && result.length > 0) {
        return callback(null, { userException: 'Já existe usuário cadastrado com este email !!' });
    };
    
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


    function checkEmail() {
        return new Promise( ( resolve, reject ) => {
            const sql = `
                SELECT *
                FROM delivery_customers  
                WHERE EmailCustomer = ?`;
            const params = [req.body.EmailCustomer];
            
            connection.query( sql, params, function (error, rows) {
                if (!error) return resolve(rows);
                reject(error);
            });
        });
    };
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

// async / await
exports.passwordRecover = async (req, callback) => {
    let result;
    try {
        result = await checkEmail( req.body.EmailCustomer );
    } catch (err) {
        handleError(err);
    };
    
    if ( !result || result.length <= 0 )
        return callback(null, { errorMessage: 'Não existe usuário cadastrado com este email !!' });
    
    try {
        const response = await sendMail({
            email: req.body.EmailCustomer,
            name: result[0].NameCustomer,
            pass: result[0].PasswordCustomer,
        });

        return callback(null, response);
    } catch (error) {
        return callback(error, null);
    };

    function checkEmail( emailCustomer ) {
        return new Promise( ( resolve, reject ) => {
            const sql = `
                SELECT *
                FROM delivery_customers  
                WHERE EmailCustomer = ?`;

            const params = [ emailCustomer ];
            
            connection.query( sql, params, function (error, rows) {     
                if (!error) return resolve(rows);
                reject(error);
            });
        });
    };
};
