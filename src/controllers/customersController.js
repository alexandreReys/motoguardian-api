// const handleError = require('../../utils');
const userException = require('../utils');
const customersRepository = require("../repositories/customersRepository");

exports.getAll = function (req, res) {
    customersRepository.getAll((err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.getByName = function (req, res) {
    customersRepository.getByName(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.post = function (req, res) {
    customersRepository.insert(req, (err, rows) => {
        if (err) return handleError(err)

        if (rows.userException)
            return res.json({ errorMessage: rows.userException });

        res.json(rows);
    });
};

exports.passwordRecover = function (req, res) {
    customersRepository.passwordRecover(req, (err, rows) => {
        if (err) return handleError(err)

        if (rows.errorMessage)
            return res.json({ errorMessage: rows.errorMessage });

        res.json(rows);
    });
};

exports.put = function (req, res) {
    customersRepository.update(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.delete = function (req, res) {
    customersRepository.delete(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

////////////////////////////////////////////////////////////////////////////////////

const handleError = (err, res) => {
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