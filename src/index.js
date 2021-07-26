require("dotenv").config();
const express = require("express");
const router = require("./router/routes");
const cors = require("cors");

const app = express();

// app.disable('etag');  // http response 304 => 200

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server on Port:${port}`);
    console.log('IMG:', process.env.CLOUDINARY_UPLOAD_PRESET);
    console.log('DB:', process.env.DB? process.env.DB: process.env.DB_DATAB);
});
