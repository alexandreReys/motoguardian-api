const express = require("express");
const { Router } = require("express");
const cors = require("cors");
const morgan = require("morgan");

const adminAuthentication = require('../middlewares/adminAuth');

const customerAuthentication = require("../middlewares/customerAuth");

const productsRouter = require("./productsRouter");
const imagesRouter = require("./imagesRouter");
const ordersRouter = require("./ordersRouter");
const deliveryPushRouter = require("./deliveryPushRouter");
const deliverymanRouter = require("./deliverymanRouter");
const categoryRouter = require("./categoryRouter");
const deliverySettingsRouter = require("./deliverySettingsRouter");
const customersRouter = require("./customersRouter");

const router = Router();

router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(morgan("dev"));

router.get("/", (req, res) => {
  try {
    return res.status(200).send({
      title: "API OK",
      version: "1.0.0",
    });
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.post("/auth", adminAuthentication);
router.post("/customer-authentication", customerAuthentication);

router.use("/products", productsRouter);
router.use("/images", imagesRouter);
router.use("/delivery-order", ordersRouter);
router.use("/delivery-push-notification", deliveryPushRouter);
router.use("/deliveryman", deliverymanRouter);
router.use("/category", categoryRouter);
router.use("/customers", customersRouter);
router.use("/delivery-settings", deliverySettingsRouter);

module.exports = router;
