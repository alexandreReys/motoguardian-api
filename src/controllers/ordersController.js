require("dotenv").config();
const axios = require("axios");
const getDateNow = require("../utils/getDateNow");
const getTimeNow = require("../utils/getTimeNow");
const ordersRepository = require("../repositories/ordersRepository");
const userException = require("../utils");

exports.getAll = async function (req, res) {
    try {
        let rows = await ordersRepository.getAll(req);
        res.json(rows);
    } catch (err) {
        handleError(err, res);
    };
};

exports.getById = function (req, res) {
    ordersRepository.getById(req, (err, rows) => {
        if (err) return handleError(err, res);

        if (rows.length === 0) return res.json(rows);
        
        let custormerAddress = rows[0].CustomerAddressOrder.replace(/,  /g, '');
        let newRows = [{ ...rows[0], CustomerAddressOrder: custormerAddress }];
        res.json(newRows);
    });
};

exports.getByDocument = function (req, res) {
    ordersRepository.getByDocument(req, (err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};

exports.getByCustomerId = function (req, res) {
    ordersRepository.getByCustomerId(req, (err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};

exports.getByStatus = function (req, res) {
    ordersRepository.getByStatus(req, (err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });

};

exports.getByDeliveryManStatus = function (req, res) {
    ordersRepository.getByDeliveryManStatus(req, (err, rows) => {
        if (err) return handleError(err, res);

        const orders = rows.map( (row) => {
            return {
                ...row,
                CustomerAddressOrder: row.CustomerAddressOrder.replace(/,  /g, ''),
            };
        });

        res.json(orders);
    });
};

exports.getItems = function (req, res) {
    ordersRepository.getItems(req, (err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};

exports.getHistory = function (req, res) {
    ordersRepository.getHistory(req, (err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });
};

exports.getTotalsByDeliverymanAndDate = async function (req, res) {
    try {
        let rows = await ordersRepository.getTotalsByDeliverymanAndDate(req);
        res.json(rows);
    } catch (err) {
        handleError(err, res);
    };
};

exports.putAcceptOrder = function (req, res) {
    const id = req.params.IdOrder;
    const status = "Pendente";

    ordersRepository.changeStatusOrder(id, status, null, (err, rows) => {
        if (err) return handleError(err, res);

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
        if (err) return handleError(err, res);

        ordersRepository.insertDeliveryOrderHistory(id, status, "", (err, rows) => {
            if (err) return handleError(err, res);
        });

        res.json(rows);
    });
};

exports.putCancel = async function (req, res) {
    const id = req.params.IdOrder;
    const comment = req.params.comment;
    const status = "Cancelado";

    try {
        let rows = await ordersRepository.changeStatusOrderPromise(id, status, null);
        if (rows.affectedRows === 0)
            throw new userException(`Pedido ${id} não encontrado !!`);

        await ordersRepository.insertDeliveryOrderHistoryPromise(id, status, comment);
        res.json({message: 'ok'});
    } catch (err) {
        handleError(err, res);
    };
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
        if (err) return handleError(err, res);

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
        if (err) return handleError(err, res);
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
        if (err) return handleError(err, res);
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
        if (err) return handleError(err, res);
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
        
        const orderItems = req.body.orderItems;

        if (orderItems) {
            for (i = 0; i < orderItems.length; i++) {
                const item = orderItems[i];
                let resp;

                try {
                    resp = await ordersRepository.insertItem(item, rows.insertId);
                 } catch (err) {
                     return handleError(err, res);
                 };

                await delay(200);
            };
        };

        ordersRepository.insertDeliveryOrderHistory(
            rows.insertId, "Pedido Colocado", "", (err, response) => {
                if (err) return handleError(err, res);
            }
        );

        res.json({
            insertId: rows.insertId,
            dateOrder,
            timeOrder,
        });
    });

    const delay = ms => new Promise(res => setTimeout(res, ms));
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
            if (err) return handleError(err, res);
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

const handleError = (err) => {
    if (err.code == "EUSEREXCEPTION") {
        res.status(200).send({ error: err.message });
        
    } else {
        console.log('');
        console.log('Error =======>', err.message, err.code);
        console.log('');

        res.status(400).send({ 
            errorCode: err.code,
            errorMessage: err.message, 
        });
    };
};

////////////////////////////////////////////////////////////////////////////////////
