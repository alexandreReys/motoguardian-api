const axios = require("axios");
const connection = require("../mysql-connection");
const { getPushTokens } = require("../services/pushNotificationService");
const { createMessages } = require("../services/pushNotificationService");
const { sendMessages } = require("../services/pushNotificationService");
const { getReceiptIds } = require("../services/pushNotificationService");

exports.post = function (req, res) {
  insertPushNotificationToken(req, async (err, rows) => {
    if (err) { return res.json({ insertId: -1 }) };
    res.json({ insertId: rows.insertId });
  });
};

exports.send = async function (req, res) {
  getTokensFromDB(req, async (err, rows) => {
    if (err) { return res.json({ status: "error" }) };

    let tokens = getPushTokens(rows);

    let messages = createMessages(req.body.title, req.body.body, tokens);
    let tickets = await sendMessages(messages);
    let receiptIds = getReceiptIds(tickets);

    res.json(tickets);
  });
};

// =====================================

const insertPushNotificationToken = (req, callback) => {
  const sql = 
    `INSERT 
     INTO delivery_pushNotification ( TokenPushNotification ) 
     VALUES ( ? )
    `;
  connection.query(sql, [req.body.token], function (err, rows) {
    return callback(err, rows);
  });
};

const getTokensFromDB = (req, callback) => {
  const sql = `SELECT TokenPushNotification FROM delivery_pushNotification`;
  connection.query(sql, [], function (err, rows) {
    return callback(err, rows);
  });
};


// ============================= messages
// [
//   {
//     to: [
//       'EmulatorPushToken[0000000000000000000000]',
//       'ExponentPushToken[tZ8vPgC8-0ea7jndUTVlyE]'
//     ],
//     sound: 'default',
//     title: 'Push Notification Test Title',
//     body: 'Push Notification Test Body'
//   }
// ]
// ============================= tickets
// [
//   {
//     status: 'error',
//     message: '"EmulatorPushToken[0000000000000000000000]" is not a registered push notification recipient',
//     details: { error: 'DeviceNotRegistered' }
//   },
//   {
//       id: '6231f241-6548-4b3e-bd24-1a8104007130',
//       status: 'error',
//       message: "Unable to retrieve the FCM server key for the recipient's app. Make sure you have provided a server key as directed by the Expo FCM documentation.",
//       details: { error: 'InvalidCredentials', fault: 'developer' }
//   },
//   {   id: '40de9f68-2288-4c98-9f3f-b291c664c47e', 
//       status: 'ok' 
//   }
// ]
// ============================= receiptIds
// [ '40de9f68-2288-4c98-9f3f-b291c664c47e' ]
