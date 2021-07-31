module.exports = function userException(message) {
    return {
        message,
        code: 'EUSEREXCEPTION',
    };
};

module.exports = function handleError(err, res) {
    if (err.code == "ECONNRESET") {
        console.log("Erro Query", err.code);
        res.status(400).send({ message: "ECONNRESET" });
    } else if (err.code == "ENOTFOUND") {
        console.log("Erro Query", err.code);
        res.status(400).send({ message: "ENOTFOUND" });
    } else if (err.code == "EUSEREXCEPTION") {
        console.log("Error", err.message);
        res.status(200).send({ error: err.message });
    } else {
        throw err;
    }
};
