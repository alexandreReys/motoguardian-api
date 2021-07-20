require("dotenv").config();
const axios = require("axios");
const e = require("express");
const connection = require("../../mysql-connection");
const getDateNow = require("../../utils/getDateNow");
const getTimeNow = require("../../utils/getTimeNow");
const userException = require("../../utils");

// assync / await
exports.getTotalsByDeliverymanAndDate = async function (req, res) {
    try {
        let rows = await get(req);
        res.json(rows);
    } catch (err) {
        handleError(err);
    };

    function get(req) {
        return new Promise( ( resolve, reject ) => {
            connection.query( getSql(), [req.params.status], function (error, rows) {
                if (!error) return resolve(rows);
                reject(error);
            });
        });

        function getSql(){
            let sql = `
                SELECT 
                    DeliveryManOrder,
                    CURDATE() Hoje, 
                    WEEK( CURDATE(),7 ) SemanaAtual, 
                    WEEK( DateOrder,7 ) Semana, 
                    SUBDATE( DateOrder, weekday( DateOrder ) ) DiaInicioSemana, 
                    SUBDATE( DateOrder, weekday( DateOrder )-6 ) DiaFimSemana, 
                    COUNT( ShippingAmountOrder ) AS NumEntregas, 
                    SUM( ShippingAmountOrder ) AS TotalReceber  
                FROM delivery_order d  
                WHERE StatusOrder = 'Entregue' 
                    AND DeliveryManOrder = '${req.params.deliveryman}' 
                    AND WEEK(DateOrder) >= WEEK( CURDATE() ) - 4 
                GROUP BY DeliveryManOrder, Semana 
                ORDER BY DeliveryManOrder, Semana DESC;
                `;
            return sql;
        };
    };
};

// assync / await
exports.getAll = async function (req, res) {
    try {
        let rows = await get(req);
        res.json(rows);
    } catch (err) {
        handleError(err);
    };

    function get(req) {
        return new Promise( (resolve, reject) => {
            if (!req.params.status || req.params.status === "Todos") {
                let sql = `SELECT * FROM delivery_order ORDER BY IdOrder desc`;
                connection.query(sql, function (error, rows) {
                    if (error) return reject(error);
                    resolve(rows);
                });
            } else {
                let sql = `SELECT * 
                           FROM delivery_order 
                           WHERE StatusOrder = ?
                           ORDER BY IdOrder desc`;
                connection.query(sql, [req.params.status], function (error, rows) {
                    if (!error) return resolve(rows);
                    reject(error);
                });
            };
        });
    };
};

exports.getById = function (req, res) {
    get(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });

    function get(req, callback) {
        let sql = "SELECT * FROM delivery_order WHERE (IdOrder = ?)";
        connection.query(sql, [req.params.idOrder], function (error, rows) {
            return callback(error, rows);
        });
    };
};

exports.getByStatus = function (req, res) {
    get(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });

    function get(req, callback) {
        const status = req.params.status;
    
        if (status != "Saiu para entregar" && status != "Pendente") {
            let sql =
                `SELECT * 
                FROM delivery_order 
                WHERE (StatusOrder = ?)
                ORDER BY IdOrder desc`;
            connection.query(sql, [status], function (error, rows) {
                return callback(error, rows);
            });

            return;
        };

        if (status == "Saiu para entregar" || status == "Pendente") {
            let status2 = "A caminho";
            if (status == "Pendente") status2 = "Novo";

            let sql =
                `SELECT * 
                FROM delivery_order 
                WHERE (StatusOrder = ?) OR (StatusOrder = ?)
                ORDER BY IdOrder desc`;
            connection.query(sql, [status, status2], function (error, rows) {
                return callback(error, rows);
            });

            return;
        };
    };
};

exports.getByStatus2 = function (req, res) {
    get(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });

    function get(req, callback) {
        const status = req.params.status;
    
        if (status == "Saiu para entregar") {
            const status2 = "A caminho";
            let sql =
                `SELECT * 
                FROM delivery_order 
                WHERE (StatusOrder = ?) OR (StatusOrder = ?)
                ORDER BY IdOrder desc`;
            connection.query(sql, [status, status2], function (error, rows) {
                return callback(error, rows);
            });
        } else {
            let sql =
                `SELECT * 
                FROM delivery_order 
                WHERE (StatusOrder = ?)
                ORDER BY IdOrder desc`;
            connection.query(sql, [status], function (error, rows) {
                return callback(error, rows);
            });
        }
    };
};

exports.getByDeliveryManStatus = function (req, res) {
    get(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });

    function get(req, callback) {
        const status = req.query.status;
        const deliveryMan = req.query.deliveryMan;

        if (status == "Saiu para entregar") {
            const status2 = "A caminho";
            let sql = `SELECT * FROM delivery_order 
                 WHERE ((StatusOrder = ?) OR (StatusOrder = ?)) 
                 AND (DeliveryManOrder = ?)`;

            connection.query(sql, [status, status2, deliveryMan], function (error, rows) {
                return callback(error, rows);
            });
        } else {
            let sql = `SELECT * FROM delivery_order 
                 WHERE (StatusOrder = ?)
                 AND (DeliveryManOrder = ?)`;

            connection.query(sql, [status, deliveryMan], function (error, rows) {
                return callback(error, rows);
            });
        }
    };
};

exports.getItems = function (req, res) {
    get(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });

    function get(req, callback) {
        let sql = `SELECT IdOrderItem, idProductOrderItem, DescricaoVinho, quantityOrderItem, priceOrderItem
                    FROM delivery_orderItem AS i 
                    LEFT JOIN ProdutosVinho AS p ON i.idProductOrderItem = p.IdVinho
                    WHERE (IdOrderItem = ?)
                  `;
        connection.query(sql, [req.params.idOrder], function (error, rows) {
            return callback(error, rows);
        });
    };
};

exports.getHistory = function (req, res) {
    getOrderHistory(req, (err, rows) => {
        if (err) return handleError(err);
        res.json(rows);
    });
};

exports.putAcceptOrder = function (req, res) {
    const id = req.params.IdOrder;
    const status = "Pendente";

    changeStatusOrder(id, status, null, (err, rows) => {
        if (err) return handleError(err);

        insertDeliveryOrderHistory(id, 'Pedido Aceito', '', (err, rows) => {
            if (err) return handleError(err, res);
        });

        res.json(rows);
    });
};

exports.putRejectOrder = function (req, res) {
    const id = req.params.IdOrder;
    const status = "Rejeitado";

    changeStatusOrder(id, status, null, (err, rows) => {
        if (err) return handleError(err);

        insertDeliveryOrderHistory(id, status, "", (err, rows) => {
            if (err) return handleError(err, res);
        });

        res.json(rows);
    });
};

//  async / await
exports.putDeliveringOrder = async function (req, res) {
    const id = req.params.IdOrder;
    const status = "Saiu para entregar";

    try {
        let rows = await changeStatusOrder1(id, status, null);
        if (rows.affectedRows === 0)
            throw new userException(`Pedido ${id} não encontrado !!`);

        await insertDeliveryOrderHistory1(id, status, "");
        res.json({message: 'ok'});
    } catch (err) {
        handleError(err, res);
    };

    function changeStatusOrder1(id, status, deliveryMan) {
        return new Promise( (resolve, reject)=> {
            if (!deliveryMan) {
                let sql =  
                   `UPDATE delivery_order SET StatusOrder = ?
                    WHERE (IdOrder = ?)`;
                connection.query(sql, [status, id], function (error, rows) {
                    if (!error) return resolve(rows);
                    return reject(error);
                });
            } else {
                let sql = 
                   `UPDATE delivery_order SET 
                        StatusOrder = ?,
                        DeliveryManOrder = ?
                    WHERE (IdOrder = ?)`;
                connection.query(sql, [status, deliveryMan, id], function (error, rows) {
                    if (!error) return resolve(rows);
                    return reject(error);
                });
            }
        });
    };

    function insertDeliveryOrderHistory1(id, status, comments) {
        return new Promise( (resolve, reject) => {
            const sql = `
                INSERT INTO delivery_orderHistory ( 
                    IdOrder_OrderHistory,
                    Date_OrderHistory,
                    Time_OrderHistory,
                    Status_OrderHistory,
                    Comments_OrderHistory
                ) VALUES ( 
                    ?,?,?,?,?
                )`;
    
            const params = [id, getDateNow(), getTimeNow(), status, comments];
    
            connection.query(sql, params, function (error, rows) {
                if (!error) return resolve(rows);
                reject(error);
            });
        });
    };
};
 
exports.putDeliveringOrder_ant = function (req, res) {
    const id = req.params.IdOrder;
    const status = "Saiu para entregar";

    changeStatusOrder1(id, status, null, (err, rows) => {
        if (err) return handleError(err);

        insertDeliveryOrderHistory(id, status, "", (err, rows) => {
            if (err) return handleError(err, res);
        });

        res.json(rows);
    });


    const changeStatusOrder1 = (id, status, deliveryMan) => {
        return new Promisse((resolve, reject)=> {
            if (!deliveryMan) {
                let sql =  
                   `UPDATE delivery_order SET StatusOrder = ?
                    WHERE (IdOrder = ?)`;
                connection.query(sql, [status, id], function (error, rows) {
                    if (!error) return resolve(rows);
                    reject(error);
                });
            } else {
                let sql = 
                   `UPDATE delivery_order SET 
                        StatusOrder = ?,
                        DeliveryManOrder = ?
                    WHERE (IdOrder = ?)`;
                connection.query(sql, [status, deliveryMan, id], function (error, rows) {
                    if (!error) return resolve(rows);
                    reject(error);
                });
            }
        });
    };
    
};

exports.putDeliveredOrder = function (req, res) {
    const id = req.params.IdOrder;
    const status = "Entregue";

    changeStatusOrder(id, status, null, (err, rows) => {
        if (err) return handleError(err);

        insertDeliveryOrderHistory(id, status, "", (err, rows) => {
            if (err) return handleError(err, res);
        });

        res.json(rows);
    });
};

exports.post = function (req, res) {
    const dateOrder = getDateNow();
    const timeOrder = getTimeNow();
    insertDeliveryOrder(req, dateOrder, timeOrder, async (err, rows) => {
        if (err) return handleError(err, res);

        if (req.body.orderItems) {
            req.body.orderItems.forEach(async (item) => {
                await insertItem(item, rows.insertId);
            });
        }

        insertDeliveryOrderHistory(
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

exports.postLeaving = function (req, res) {
    const orders = req.body;
    if (orders) {
        orders.forEach((order) => updateOrder(order));
    };
    res.json({ msg: "ok" });
};

exports.putStartDelivery = function (req, res) {
    const id = req.params.IdOrder;
    const status = "A caminho";
    changeStatusOrder(id, status, null, (err, rows) => {
        if (err) return handleError(err);
        insertDeliveryOrderHistory(id, status, "", (err, rows) => {
            if (err) return handleError(err, res);
        });
        res.json(rows);
    });
};

exports.putEndDelivery = function (req, res) {
    const id = req.params.IdOrder;
    const status = "Entregue";
    changeStatusOrder(id, status, null, (err, rows) => {
        if (err) return handleError(err);
        insertDeliveryOrderHistory(id, status, "", (err, rows) => {
            if (err) return handleError(err, res);
        });
        res.json(rows);
    });
};

exports.updateRatingDelivery = function (req, res) {

    updateRating((err, rows) => {
        if (err) return handleError(err, res);
        res.json(rows);
    });

    function updateRating(callback) {
        let sql = `
            UPDATE delivery_order SET EvaluationOrder = ?
            WHERE (IdOrder = ?)`;

        connection.query(
            sql, [req.params.rating, req.params.idOrder], 
            function (error, rows) {
                return callback(error, rows);
            }
        );
    };
};

exports.wentWrongDelivery = function (req, res) {
    const id = req.params.IdOrder;
    const status = "Deu Ruim";
    changeStatusOrder(id, status, null, (err, rows) => {
        if (err) return handleError(err);
        insertDeliveryOrderHistory(id, status, "", (err, rows) => {
            if (err) return handleError(err, res);
        });
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

////////////////////////////////////////////////////////////////////////////////////

const getOrderHistory = (req, callback) => {
    let sql = `
    SELECT *
    FROM delivery_orderHistory
    WHERE (IdOrder_OrderHistory = ?)
    ORDER BY Id_OrderHistory
  `;
    connection.query(sql, [req.params.idOrder], function (error, rows) {
        return callback(error, rows);
    });
};

const insertDeliveryOrder = (req, dateOrder, timeOrder, callback) => {
    const dados = req.body;

    const sql = `INSERT INTO delivery_order ( 
    IdCustomerOrder,
    DateOrder,
    TimeOrder,
    QuantityItemsOrder,
    TotalProductsOrder,
    ShippingAmountOrder,
    TotalOrder,
    ChangeValueOrder,
    PaymantTypeOrder,
    CustomerNameOrder,
    CustomerDocumentOrder,
    CustomerPhoneNumberOrder,
    CustomerAddressTypeOrder,
    CustomerAddressOrder,
    CustomerStreetOrder,
    CustomerNumberOrder,
    CustomerComplementOrder,
    CustomerInfoOrder,
    CustomerNeighborhoodOrder,
    CustomerCityOrder,
    CustomerStateOrder,
    CustomerPostalCodeOrder,
    DeliveryManOrder,
    EvaluationOrder,
    EvaluationReasonOrder,
    CommentsOrder,
    StatusOrder
  ) VALUES ( 
    ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
  )`;

    const params = [
        1, //IdCustomer,
        dateOrder,
        timeOrder,
        dados.quantityItemsOrder,
        dados.totalProductsOrder,
        dados.shippingAmountOrder,
        dados.totalOrder,
        dados.changeValueOrder,
        dados.paymantTypeOrder,
        dados.customerNameOrder,
        dados.customerDocumentOrder,
        dados.customerPhoneNumberOrder,
        dados.customerAddressTypeOrder,
        dados.customerAddressOrder,
        dados.customerStreetOrder,
        dados.customerNumberOrder,
        dados.customerComplementOrder,
        dados.customerInfoOrder,
        dados.customerNeighborhoodOrder,
        dados.customerCityOrder,
        dados.customerStateOrder,
        dados.customerPostalCodeOrder,
        dados.deliveryManOrder,
        dados.evaluationOrder,
        dados.evaluationReasonOrder,
        dados.commentsOrder,
        'Novo',
    ];

    connection.query(sql, params, function (err, rows) {
        return callback(err, rows);
    });
};

const insertItem = async (item, orderId) => {
    const sql = `INSERT INTO delivery_orderItem (
    IdOrderItem, idProductOrderItem, quantityOrderItem, priceOrderItem
  ) VALUES ( ?,?,?,? )`;

    const params = [orderId, item.id, item.quantity, item.price];

    connection.query(sql, params, function (err, rows) {
        if (err) return handleError(err);
        return;
    });
};

const updateOrder = function (order) {
    const id = order.IdOrder;
    const status = "Saiu para entregar";
    const deliveryMan = order.DeliveryManOrder;
    changeStatusOrder(id, status, deliveryMan, (err, rows) => {
        if (err) return handleError(err);
        insertDeliveryOrderHistory(id, status, "", (err, rows) => {
            if (err) return false;
        });
    });
};

const changeStatusOrder = (id, status, deliveryMan, callback) => {
    if (!deliveryMan) {
        let sql =  
           `UPDATE delivery_order SET StatusOrder = ?
            WHERE (IdOrder = ?)`;
        connection.query(sql, [status, id], function (error, rows) {
            return callback(error, rows);
        });
    } else {
        let sql = 
           `UPDATE delivery_order SET 
                StatusOrder = ?,
                DeliveryManOrder = ?
            WHERE (IdOrder = ?)`;
        connection.query(sql, [status, deliveryMan, id], function (error, rows) {
            return callback(error, rows);
        });
    }
};

const insertDeliveryOrderHistory = (id, status, comments, callback) => {
    const sql = `
    INSERT INTO delivery_orderHistory ( 
      IdOrder_OrderHistory,
      Date_OrderHistory,
      Time_OrderHistory,
      Status_OrderHistory,
      Comments_OrderHistory
    ) VALUES ( 
      ?,?,?,?,?
    )`;

    const params = [id, getDateNow(), getTimeNow(), status, comments];

    connection.query(sql, params, function (err, rows) {
        return callback(err, rows);
    });
};
