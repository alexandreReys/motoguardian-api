// const handleError = require('../../utils');
const userException = require('../utils');
const customersRepository = require("../repositories/customersRepository");
const { handleError } = require('./../services/errorService');

exports.getAll = function (req, res) {
    customersRepository.getAll((err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};

exports.getByName = function (req, res) {
    customersRepository.getByName(req, (err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};

exports.post = function (req, res) {
    customersRepository.insert(req, (err, rows) => {
        if (err) return handleError(err, res)

        if (rows.userException)
            return res.json({ errorMessage: rows.userException });

        res.json(rows);
    });
};

exports.passwordRecover = function (req, res) {
    customersRepository.passwordRecover(req, (err, rows) => {
        if (err) return handleError(err, res)

        if (rows.errorMessage)
            return res.json({ errorMessage: rows.errorMessage });

        res.json(rows);
    });
};

exports.put = function (req, res) {
    customersRepository.update(req, (err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};

exports.delete = function (req, res) {
    customersRepository.delete(req, (err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};
