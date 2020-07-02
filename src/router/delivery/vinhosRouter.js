const { Router } = require("express");
const multer = require("multer");
const multerConfig = require("../../config/multer");
const vinhosController = require("../../controllers/vinhosController");
const Authorization = require("../../middlewares/Authz");

const router = Router();

router.get("/", vinhosController.getAll);

router.get("/name", Authorization, vinhosController.getByName);

router.post("/", Authorization, vinhosController.post);

router.post(
  "/image",
  Authorization,
  multer(multerConfig).single("file"),
  vinhosController.postImage
);

router.put("/", Authorization, vinhosController.put);

router.delete("/", Authorization, vinhosController.delete);

module.exports = router;
