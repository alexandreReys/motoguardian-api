require("dotenv-safe").config();

const express = require("express");
const router = require("./router");

const app = express();

const port = process.env.api_port || 3000;
const environment = process.env.node_env || "production";

app.use(router);

app.listen(port, () => console.log(`Server in ${environment} on Port:${port}`));
