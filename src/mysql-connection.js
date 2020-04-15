const mysql = require("mysql");

const connection = mysql.createPool({
  connectionLimit: 1000,
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
  host: process.env.autocom_db_host, // Variavel Ambiental
  port: process.env.autocom_db_port, // Variavel Ambiental
  user: process.env.autocom_db_user, // Variavel Ambiental
  password: process.env.autocom_db_pass, // Variavel Ambiental
  database: process.env.autocom_db_datab // Variavel Ambiental
});

module.exports = connection;
