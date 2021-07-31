const { Router } = require("express");
// const multer = require("multer");
// const multerConfig = require("../../config/multer");
const productsController = require("../controllers/productsController");
const authorization = require("../middlewares/authz");

const router = Router();

router.get("/", productsController.getAll);
router.get("/name", productsController.getProductsByName);
router.get("/name/actives", productsController.getActiveProductsByName);
router.get("/category", productsController.getProductsByCategory);
router.get("/category/actives", productsController.getActiveProductsByCategory);
router.get("/category/grouped", productsController.getProductsGroupedByCategory);

router.get("/category/grouped/selected", productsController.getProductsGroupedBySelectedAppListCategories);
router.get("/promotion/actives", productsController.getActiveProductsInPromotion);

// router.post("/image", authorization, multer(multerConfig).single("file"), productsController.postImage);
router.post("/", authorization, productsController.post);
router.post("/img", authorization, productsController.uploadProductImage);

router.put("/", authorization, productsController.put);
router.put("/deactivate", authorization, productsController.deactivate);
router.put("/promotion", authorization, productsController.promotion);
router.put("/promotional-price", authorization, productsController.promotionalPrice);

router.delete("/", authorization, productsController.delete);
router.delete("/img", authorization, productsController.deleteProductImage);

module.exports = router;
