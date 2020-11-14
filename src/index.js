require("dotenv").config();
const express = require("express");
const router = require("./router");

const app = express();

// app.disable('etag');  // http response 304 => 200

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(router);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server on Port:${port}`);
    console.log(process.env.CLOUDINARY_UPLOAD_PRESET);
    console.log(process.env.DB_DATAB);
});
