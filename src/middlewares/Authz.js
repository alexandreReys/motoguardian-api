const jwt = require("jsonwebtoken");

module.exports = function (request, response, next) {
  let token = request.headers["authorization"];
  if (!token) {
    return response.status(401).send({
      auth: false,
      message: "No token provided.",
    });
  }

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) {
      return response.status(500).send({
        auth: false,
        message: "Failed to authenticate token.",
      });
    }

    // se tudo estiver ok, salva no request para uso posterior
    request.username = decoded.username;
    next();
  });
};
