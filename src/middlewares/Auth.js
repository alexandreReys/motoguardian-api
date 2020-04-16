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
  }

  if (rows[0]) {
    const username = rows[0].name;
    let token = jwt.sign({ username }, process.env.secret);
    response.json({ auth: true, token: token, username: username });
  } else {
    response.status(403).json({ message: "Dados invalidos !" });
  }
}

const getEmailLogin = (reqUser, callback) => {
  let sql = `SELECT email, name, idEmpresaUsuario, razaoSocialEmpresa
             FROM UsuariosNet 
             INNER JOIN EmpresasNet 
               ON idEmpresaUsuario = idEmpresa 
             WHERE (email = '${reqUser.user}') 
               and (password = '${reqUser.pwd}')`;

  connection.query(sql, function (error, rows) {
    return callback(error, rows);
  });
};
