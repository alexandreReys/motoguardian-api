require("dotenv-safe").config();

const express = require("express");
const router = require("./router");

const app = express();

const port = process.env.API_PORT || 3000;

app.use(router);

app.listen(port, () =>
  console.log(`Server in ${process.env.node_env} on Port:${port}`)
);
