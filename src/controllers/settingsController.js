const settingsRepository = require("../repositories/settingsRepository");
const { handleError } = require('../services/errorService');

exports.getAll = function (req, res) {
    settingsRepository.get((err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};

exports.post = function (req, res) {
    settingsRepository.insert(req, (err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};

exports.put = function (req, res) {
    settingsRepository.put(req, (err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};

exports.changeOperationStatus = function (req, res) {
    settingsRepository.changeOperationStatus(req, (err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};

exports.delete = function (req, res) {
    settingsRepository.delete(req, (err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};

exports.getDistance = function (req, res) {
    settingsRepository.get_distance(req, (err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};
