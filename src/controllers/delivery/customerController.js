const customerRepository = require("../../repositories/delivery/customerRepository");


exports.getAll = function (req, res) {
    customerRepository.getAll((err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.getByName = function (req, res) {
    customerRepository.getByName(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.post = function (req, res) {
    customerRepository.insert(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.put = function (req, res) {
    customerRepository.update(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.delete = function (req, res) {
    customerRepository.delete(req, (err, rows) => {
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
