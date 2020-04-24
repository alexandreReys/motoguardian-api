const express = require("express");
const { Router } = require("express");
const cors = require("cors");

const Authentication = require("../middlewares/Auth");
const Authorization = require("../middlewares/Authz");

// const oficinasRouter = require("./oficinasRouter");
const oficinasRouter = require("./oficinasRouter");
const clientesRouter = require("./clientesRouter");
const veiculosRouter = require("./veiculosRouter");

const router = Router();

router.use(cors());
router.use(express.json());

router.get("/", (req, res) => {
  try {
    return res.status(200).send({
      title: "MotoGuardian.com.br / API OK",
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

module.exports = router;
