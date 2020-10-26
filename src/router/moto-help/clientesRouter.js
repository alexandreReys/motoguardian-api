const { Router } = require("express");
const multer = require("multer");

const multerConfig = require("../../config/multer");
const clientesController = require("../../controllers/moto-help/clientesController");

const router = Router();

router.get("/", clientesController.getAll);
router.get("/nome", clientesController.getByNome);
router.post("/", clientesController.post);
router.post(
  "/image",
  multer(multerConfig).single("file"),
  clientesController.postImage
);
router.put("/", clientesController.put);
router.delete("/", clientesController.delete);

module.exports = router;
