const mysql = require("mysql");

let segundos = 1000; // milisegundos
let minutos = 60 * segundos;

const connection = mysql.createPool({
  connectionLimit: 30, // 1000, // The maximum number of connections to create at once. (Default: 10)

  connectTimeout: 40 * segundos, // 60*minutos,  (Default: 10000) 10 segundos
  acquireTimeout: 40 * segundos, // 60*minutos,  (Default: 10000) 10 segundos
  timeout: 40 * segundos, // 60*minutos,

  host: process.env.DB_HOST, // .env
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATAB,
});

module.exports = connection;
