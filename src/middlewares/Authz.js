const jwt = require("jsonwebtoken");

module.exports = function (request, response, next) {
  const token = request.headers["authorization"];
  
  if (!token) {
    const message = "No token provided.";
    console.log("==========>> " + message);
    return response.status(401).send({
      auth: false,
      message,
    });
  }

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) {
      const message = "Failed to authenticate token.";
      console.log("==========>> " + message);
      return response.status(500).send({
        auth: false,
        message,
      });
    }

    // se tudo estiver ok, salva no request para uso posterior
    request.username = decoded.username;
    next();
  });
};
