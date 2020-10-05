const { Router } = require("express");
const deliverymanController = require("../../controllers/delivery/deliverymanController");
const Authorization = require("../../middlewares/Authz");

const router = Router();

router.get("/", deliverymanController.getAll);
router.get("/name", deliverymanController.getByName);
router.post("/", Authorization, deliverymanController.post);
router.put("/", Authorization, deliverymanController.put);
router.delete("/", Authorization, deliverymanController.delete);

module.exports = router;
