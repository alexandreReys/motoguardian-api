const axios = require("axios");
const connection = require("../../mysql-connection");
const getDateNow = require("../../utils/getDateNow");
const getTimeNow = require("../../utils/getTimeNow");

exports.getAll = function (req, res) {
  getAllOrders(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.getById = function (req, res) {
  getOrderById(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.getByStatus = function (req, res) {
  getOrderByStatus(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.getByDeliveryManStatus = function (req, res) {
  getOrdersByDeliveryManStatus(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.getItems = function (req, res) {
  getOrderItems(req, (err, rows) => {
    if (err) return handleError(err);
    res.json(rows);
  });
};

exports.getHistory = function (req, res) {
  getOrderHistory(req, (err, rows) => {
    if (err) return handleError(err);
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

exports.putDeliveringOrder = function (req, res) {
  const id = req.params.IdOrder;
  const status = "Saiu para entregar";

  changeStatusOrder(id, status, null, (err, rows) => {
    if (err) return handleError(err);

    insertDeliveryOrderHistory(id, status, "", (err, rows) => {
      if (err) return handleError(err, res);
    });

    res.json(rows);
  });
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
  });''
};

exports.getCep = async (req, res) => {
  let url = `http://www.cepaberto.com/api/v3/cep?cep=${req.params.postalCode}`;

  let token = "token=49efb81e24adb56f15982971515a92fc";
  let headers = { headers: { Authorization: `Token ${token}` } };

  try {
    const response = await axios.get(url, headers);
    res.status(200).send(response.data);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e);
  }
};

exports.postLeaving = function (req, res) {
  const orders = req.body;
  if (orders) {
    orders.forEach( (order) => updateOrder(order) );
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

////////////////////////////////////////////////////////////////////////////////////

const handleError = (err, res) => {
  if (err.code == "ECONNRESET") {
    console.log("Erro Query", err.code);
    res.status(400).send({ message: "ECONNRESET" });
  } else if (err.code == "ENOTFOUND") {
    console.log("Erro Query", err.code);
    res.status(400).send({ message: "ENOTFOUND" });
  } else {
    throw err;
  }
};

////////////////////////////////////////////////////////////////////////////////////

const getAllOrders = (req, callback) => {
  if (!req.params.status || req.params.status === "Todos") {
    let sql = `SELECT * FROM delivery_order ORDER BY IdOrder desc`;
    connection.query(sql, function (error, rows) {
      return callback(error, rows);
    });
  } else {
    let sql = `
      SELECT * 
      FROM delivery_order 
      WHERE StatusOrder = ?
      ORDER BY IdOrder desc
    `;

    connection.query(sql, [req.params.status], function (error, rows) {
      return callback(error, rows);
    });
  }
};

const getOrderById = (req, callback) => {
  let sql = `
    SELECT * 
    FROM delivery_order 
    WHERE (IdOrder = ?)
  `;
  connection.query(sql, [req.params.idOrder], function (error, rows) {
    return callback(error, rows);
  });
};

const getOrderByStatus = (req, callback) => {
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
      ORDER BY IdOrder desc
      `;
    connection.query(sql, [status], function (error, rows) {
      return callback(error, rows);
    });
  }
};

const getOrdersByDeliveryManStatus = (req, callback) => {
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

const getOrderItems = (req, callback) => {
  let sql = `
    SELECT IdOrderItem, idProductOrderItem, DescricaoVinho, quantityOrderItem, priceOrderItem
    FROM delivery_orderItem AS i 
    LEFT JOIN ProdutosVinho AS p ON i.idProductOrderItem = p.IdVinho
    WHERE (IdOrderItem = ?)
  `;
  connection.query(sql, [req.params.idOrder], function (error, rows) {
    return callback(error, rows);
  });
};

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
    dados.statusOrder,
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
    let sql = `
      UPDATE delivery_order SET StatusOrder = ?
      WHERE (IdOrder = ?)
    `;
    connection.query(sql, [status, id], function (error, rows) {
      return callback(error, rows);
    });
  } else {
    let sql = `
      UPDATE delivery_order SET 
        StatusOrder = ?,
        DeliveryManOrder = ?
      WHERE (IdOrder = ?)
    `;
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
