const { Router } = require("express");
const multer = require("multer");
const multerConfig = require("../../config/multer");
const productsController = require("../../controllers/delivery/productsController");
const Authorization = require("../../middlewares/Authz");

const router = Router();

router.get("/", productsController.getAll);

router.get("/name", productsController.getProductsByName);

router.get("/category", productsController.getProductsByCategory);

router.get("/category/grouped", productsController.getProductsGroupedByCategory);

router.post("/", Authorization, productsController.post);

router.post("/image", Authorization, multer(multerConfig).single("file"), productsController.postImage);

router.put("/", Authorization, productsController.put);

router.delete("/", Authorization, productsController.delete);

router.post("/img", Authorization, productsController.uploadProductImage);
router.delete("/img", Authorization, productsController.deleteProductImage);

module.exports = router;
