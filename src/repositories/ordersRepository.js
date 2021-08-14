const connection = require("../mysql-connection");
const getDateNow = require("../utils/getDateNow");
const getTimeNow = require("../utils/getTimeNow");

// exports.insertDeliveryOrder = (req, dateOrder, timeOrder, callback) => {
//     const dados = req.body;

//     const sql = `INSERT INTO delivery_order ( 
//     IdCustomerOrder,
//     DateOrder,
//     TimeOrder,
//     QuantityItemsOrder,
//     TotalProductsOrder,
//     ShippingAmountOrder,
//     TotalOrder,
//     ChangeValueOrder,
//     PaymantTypeOrder,
//     CustomerNameOrder,
//     CustomerDocumentOrder,
//     CustomerPhoneNumberOrder,
//     CustomerAddressTypeOrder,
//     CustomerAddressOrder,
//     CustomerStreetOrder,
//     CustomerNumberOrder,
//     CustomerComplementOrder,
//     CustomerInfoOrder,
//     CustomerNeighborhoodOrder,
//     CustomerCityOrder,
//     CustomerStateOrder,
//     CustomerPostalCodeOrder,
//     DeliveryManOrder,
//     EvaluationOrder,
//     EvaluationReasonOrder,
//     CommentsOrder,
//     StatusOrder
//   ) VALUES ( 
//     ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
//   )`;

//     const params = [
//         1, //IdCustomer,
//         dateOrder,
//         timeOrder,
//         dados.quantityItemsOrder,
//         dados.totalProductsOrder,
//         dados.shippingAmountOrder,
//         dados.totalOrder,
//         dados.changeValueOrder,
//         dados.paymantTypeOrder,
//         dados.customerNameOrder,
//         dados.customerDocumentOrder,
//         dados.customerPhoneNumberOrder,
//         dados.customerAddressTypeOrder,
//         dados.customerAddressOrder,
//         dados.customerStreetOrder,
//         dados.customerNumberOrder,
//         dados.customerComplementOrder,
//         dados.customerInfoOrder,
//         dados.customerNeighborhoodOrder,
//         dados.customerCityOrder,
//         dados.customerStateOrder,
//         dados.customerPostalCodeOrder,
//         dados.deliveryManOrder,
//         dados.evaluationOrder,
//         dados.evaluationReasonOrder,
//         dados.commentsOrder,
//         'Novo',
//     ];

//     connection.query(sql, params, function (err, rows) {
//         return callback(err, rows);
//     });
// };

exports.getAll = (req) => {
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

exports.getById = (req, callback) => {
    let sql = "SELECT * FROM delivery_order WHERE (IdOrder = ?)";
    connection.query(sql, [req.params.idOrder], function (error, rows) {
        return callback(error, rows);
    });
};

exports.getByDocument = (req, callback) => {
    let sql = "SELECT * FROM delivery_order WHERE (CustomerDocumentOrder = ?) ORDER BY IdOrder DESC";
    connection.query(sql, [req.params.document], function (error, rows) {
        return callback(error, rows);
    });
};

exports.getByCustomerId = (req, callback) => {
    let sql = "SELECT * FROM delivery_order WHERE (CustomerIdOrder = ?) ORDER BY IdOrder DESC";
    connection.query(sql, [req.params.customerIdOrder], function (error, rows) {
        return callback(error, rows);
    });
};

exports.getByStatus = (req, callback) => {
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
    };
};

exports.getByDeliveryManStatus = (req, callback) => {
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

exports.getItems = (req, callback) => {
    let sql = `SELECT IdOrderItem, idProductOrderItem, DescricaoVinho, quantityOrderItem, priceOrderItem
                FROM delivery_orderItem AS i 
                LEFT JOIN ProdutosVinho AS p ON i.idProductOrderItem = p.IdVinho
                WHERE (IdOrderItem = ?)
              `;
    connection.query(sql, [req.params.idOrder], function (error, rows) {
        return callback(error, rows);
    });
};

exports.getHistory = (req, callback) => {
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

exports.getTotalsByDeliverymanAndDate = (req) => {
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

exports.changeStatusOrder = (id, status, deliveryMan, callback) => {
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

exports.insertDeliveryOrderHistory = (id, status, comments, callback) => {
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

exports.changeStatusOrderPromise = (id, status, deliveryMan) => {
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

exports.insertDeliveryOrderHistoryPromise = (id, status, comments) => {
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
}

exports.insertDeliveryOrder = (req, dateOrder, timeOrder, callback) => {
    const dados = req.body;

    const sql = `INSERT INTO delivery_order ( 
    DateOrder,
    TimeOrder,
    QuantityItemsOrder,
    TotalProductsOrder,
    ShippingAmountOrder,

    TotalOrder,
    ChangeValueOrder,
    PaymantTypeOrder,
    CustomerIdOrder,
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
    ?,?,?,?,?,
    ?,?,?,?,?,
    ?,?,?,?,?,
    ?,?,?,?,?,
    ?,?,?,?,?,
    ?,?
  )`;

    const params = [
        dateOrder,
        timeOrder,
        dados.quantityItemsOrder,
        dados.totalProductsOrder,
        dados.shippingAmountOrder,

        dados.totalOrder,
        dados.changeValueOrder,
        dados.paymantTypeOrder,
        dados.customerIdOrder,
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

exports.insertItem = async (item, orderId, callback) => {
    const sql = `INSERT INTO delivery_orderItem (
        IdOrderItem, idProductOrderItem, quantityOrderItem, priceOrderItem
    ) VALUES ( ?,?,?,? )`;

    const params = [orderId, item.id, item.quantity, item.price];

    connection.query(sql, params, function (err, rows) {
        return callback(err, rows);
    });
};

exports.updateRating = (req, callback) => {
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
