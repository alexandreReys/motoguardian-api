const express = require("express");
const { Router } = require("express");
const cors = require("cors");

const Auth = require("../middlewares/Auth");
const Authz = require("../middlewares/Authz");

const oficinasRouter = require("./oficinasRouter");

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

router.post("/auth", Auth.auth);

router.use("/oficinas", Authz.authz, oficinasRouter);

module.exports = router;
