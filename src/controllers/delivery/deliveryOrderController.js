const axios = require("axios");
const connection = require("../../mysql-connection");
const getDateNow = require("../../utils/getDateNow");
const getTimeNow = require("../../utils/getTimeNow");

exports.getAll = function (req, res) {
  getAllOrders((err, rows) => {
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
  rejectOrder(req, (err, rows) => {
    if (err) return handleError(err);

    insertDeliveryOrderHistory(
      req.params.IdOrder,
      "Rejeitado",
      "",
      (err, rows) => {
        if (err) return handleError(err, res);
      }
    );

    res.json(rows);
  });
};

exports.post = function (req, res) {
  insertDeliveryOrder(req, async (err, rows) => {
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

    res.json({ insertId: rows.insertId });
  });
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

const getAllOrders = (callback) => {
  let sql = `SELECT * FROM delivery_order ORDER BY IdOrder desc`;
  connection.query(sql, function (error, rows) {
    return callback(error, rows);
  });
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

const insertDeliveryOrder = (req, callback) => {
  const dados = req.body;

  const dateOrder = getDateNow();
  const timeOrder = getTimeNow();

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

const rejectOrder = (req, callback) => {
  let sql = `
    UPDATE delivery_order SET StatusOrder = "Rejeitado"
    WHERE (IdOrder = ?)
  `;
  connection.query(sql, [req.params.IdOrder], function (error, rows) {
    return callback(error, rows);
  });
};
