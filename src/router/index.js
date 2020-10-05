const express = require("express");
const { Router } = require("express");
const cors = require("cors");
const morgan = require("morgan");

const Authentication = require("../middlewares/Auth");
const Authorization = require("../middlewares/Authz");

const oficinasRouter = require("./oficinasRouter");
const clientesRouter = require("./clientesRouter");
const veiculosRouter = require("./veiculosRouter");
const productsRouter = require("./delivery/productsRouter");
const deliveryOrderRouter = require("./delivery/deliveryOrderRouter");
const deliveryPushRouter = require("./delivery/deliveryPushRouter");
const deliverymanRouter = require("./delivery/deliverymanRouter");
const categoryRouter = require("./delivery/categoryRouter");

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

router.post("/auth", Authentication);

router.use("/oficinas", Authorization, oficinasRouter);
router.use("/clientes", Authorization, clientesRouter);
router.use("/veiculos", Authorization, veiculosRouter);

router.use("/products", productsRouter);

router.use("/delivery-order", deliveryOrderRouter);
router.use("/delivery-push-notification", deliveryPushRouter);
router.use("/deliveryman", deliverymanRouter);
router.use("/category", categoryRouter);

module.exports = router;
