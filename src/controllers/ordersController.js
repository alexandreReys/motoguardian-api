require("dotenv").config();
const axios = require("axios");
const getDateNow = require("../utils/getDateNow");
const getTimeNow = require("../utils/getTimeNow");
const userException = require("../utils");
const ordersRepository = require("../repositories/ordersRepository");

exports.getAll = async function (req, res) {
    try {
        let rows = await ordersRepository.getAll(req);
        res.json(rows);
    } catch (err) {
        handleError(err);
    };
};

exports.getById = function (req, res) {
    ordersRepository.getById(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.getByStatus = function (req, res) {
    ordersRepository.getByStatus(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });

};

exports.getByDeliveryManStatus = function (req, res) {
    ordersRepository.getByDeliveryManStatus(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.getItems = function (req, res) {
    ordersRepository.getItems(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.getHistory = function (req, res) {
    ordersRepository.getHistory(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.getTotalsByDeliverymanAndDate = async function (req, res) {
    try {
        let rows = await ordersRepository.getTotalsByDeliverymanAndDate(req);
        res.json(rows);
    } catch (err) {
        handleError(err);
    };
};

exports.putAcceptOrder = function (req, res) {
    const id = req.params.IdOrder;
    const status = "Pendente";

    ordersRepository.changeStatusOrder(id, status, null, (err, rows) => {
        if (err) return handleError(err);

        ordersRepository.insertDeliveryOrderHistory(id, 'Pedido Aceito', '', (err, rows) => {
            if (err) return handleError(err, res);
        });

        res.json(rows);
    });
};

exports.putRejectOrder = function (req, res) {
    const id = req.params.IdOrder;
    const status = "Rejeitado";

    ordersRepository.changeStatusOrder(id, status, null, (err, rows) => {
        if (err) return handleError(err);

        ordersRepository.insertDeliveryOrderHistory(id, status, "", (err, rows) => {
            if (err) return handleError(err, res);
        });

        res.json(rows);
    });
};

exports.putDeliveringOrder = async function (req, res) {
    const id = req.params.IdOrder;
    const status = "Saiu para entregar";

    try {
        let rows = await ordersRepository.changeStatusOrderPromise(id, status, null);
        if (rows.affectedRows === 0)
            throw new userException(`Pedido ${id} não encontrado !!`);

        await ordersRepository.insertDeliveryOrderHistoryPromise(id, status, "");
        res.json({message: 'ok'});
    } catch (err) {
        handleError(err, res);
    };
};

exports.putDeliveredOrder = function (req, res) {
    const id = req.params.IdOrder;
    const status = "Entregue";

    ordersRepository.changeStatusOrder(id, status, null, (err, rows) => {
        if (err) return handleError(err);

        ordersRepository.insertDeliveryOrderHistory(id, status, "", (err, rows) => {
            if (err) return handleError(err, res);
        });

        res.json(rows);
    });
};

exports.putStartDelivery = function (req, res) {
    const id = req.params.IdOrder;
    const status = "A caminho";

    ordersRepository.changeStatusOrder(id, status, null, (err, rows) => {
        if (err) return handleError(err);
        ordersRepository.insertDeliveryOrderHistory(id, status, "", (err, rows) => {
            if (err) return handleError(err, res);
        });
        res.json(rows);
    });
};

exports.putEndDelivery = function (req, res) {
    const id = req.params.IdOrder;
    const status = "Entregue";
    ordersRepository.changeStatusOrder(id, status, null, (err, rows) => {
        if (err) return handleError(err);
        ordersRepository.insertDeliveryOrderHistory(id, status, "", (err, rows) => {
            if (err) return handleError(err, res);
        });
        res.json(rows);
    });
};

exports.updateRatingDelivery = function (req, res) {
    ordersRepository.updateRating(req, (err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};

exports.wentWrongDelivery = function (req, res) {
    const id = req.params.IdOrder;
    const status = "Deu Ruim";
    ordersRepository.changeStatusOrder(id, status, null, (err, rows) => {
        if (err) return handleError(err);
        ordersRepository.insertDeliveryOrderHistory(id, status, "", (err, rows) => {
            if (err) return handleError(err, res);
        });
        res.json(rows);
    });
};

exports.post = function (req, res) {
    const dateOrder = getDateNow();
    const timeOrder = getTimeNow();

    ordersRepository.insertDeliveryOrder(req, dateOrder, timeOrder, async (err, rows) => {
        if (err) return handleError(err, res);

        if (req.body.orderItems) {
            req.body.orderItems.forEach(async (item) => {
                await ordersRepository.insertItem(item, rows.insertId);
            });
        }

        ordersRepository.insertDeliveryOrderHistory(
            rows.insertId,
            "Pedido Colocado",
            "",
            (err, rows) => {
                if (err) return handleError(err, res);
            }
        );

        res.json({
            insertId: rows.insertId,
            dateOrder,
            timeOrder,
        });
    }); ''
};

exports.postLeaving = function (req, res) {
    const orders = req.body;
    if (orders) {
        orders.forEach((order) => updateOrder(order));
    };
    res.json({ msg: "ok" });

    function updateOrder(order) {
        const id = order.IdOrder;
        const status = "Saiu para entregar";
        const deliveryMan = order.DeliveryManOrder;
        ordersRepository.changeStatusOrder(id, status, deliveryMan, (err, rows) => {
            if (err) return handleError(err);
            ordersRepository.insertDeliveryOrderHistory(id, status, "", (err, rows) => {
                if (err) return false;
            });
        });
    };
    
};

exports.getCep = async (req, res) => {
    let url = `https://viacep.com.br/ws/${req.params.postalCode}/json/`;

    try {
        const response = await axios.get(url);
        const address = response.data;

        const result = {
            logradouro: address.logradouro,
            bairro: address.bairro,
            cidade: {
                nome: address.localidade,
            },
            estado: {
                sigla: address.uf,
            },
        };

        res.status(200).send(result);
    } catch (e) {
        console.log("delivery-order / http://www.viacep.com error  ==>>  ", e.message);
        return res.status(400).send(e);
    }
};

exports.getCepAberto = async (req, res) => {
    const url = `http://www.cepaberto.com/api/v3/cep?cep=${req.params.postalCode}`;

    const token = process.env.CEPABERTO_TOKEN;
    const headers = { headers: { Authorization: `Token ${token}` } };

    try {
        const response = await axios.get(url, headers);
        res.status(200).send(response.data);
    } catch (e) {
        console.log("delivery-order / http://www.cepaberto.com error  ==>>  ", e.message);
        return res.status(400).send(e);
    }
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

////////////////////////////////////////////////////////////////////////////////////
