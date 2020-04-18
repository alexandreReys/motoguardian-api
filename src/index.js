require("dotenv").config();
const express = require("express");
const router = require("./router");

const app = express();

const port = process.env.PORT || 3333;

app.use(router);

app.listen(port, () => console.log(`Server on Port:${port}`));
