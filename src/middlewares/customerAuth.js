const jwt = require("jsonwebtoken");
var connection = require("../mysql-connection");

module.exports = function (req, resp) {
    if (req.body) {
        getEmailLogin(req.body, (err, rows) =>
            checkAndResponseLogin(err, rows, resp)
        );
    } else {
        resp.status(403).json({ message: "Dados invalidos !" });
    }
};

function checkAndResponseLogin(err, rows, response) {
    if (err) {
        response.status(403).json({
            message: "Não foi possivel efetuar o login !",
            err: err.sqlMessage,
        });
        console.log("    Erro Auth");
        console.log("    " + "err.message" + ": " + err.message);
        console.log("    " + "err.sqlMessage" + ": " + err.sqlMessage);
        return;
    };

    if (!rows[0]) return response.status(200).json({ message: "Dados invalidos !!" });
    
    const username = rows[0].NameCustomer;
    let token = jwt.sign({ username }, process.env.SECRET);

    response.json({ 
        auth: true, 
        token: token, 
        userData: rows[0],
    });
};

const getEmailLogin = (reqUser, callback) => {
    let sql = 
        `SELECT * 
        FROM delivery_customers 
        WHERE ( EmailCustomer = '${reqUser.user}' ) 
          AND ( PasswordCustomer = '${reqUser.password}' )
        LIMIT 1`;

    connection.query(sql, function (error, rows) {
        return callback(error, rows);
    });
};
