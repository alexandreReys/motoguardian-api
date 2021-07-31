const { Router } = require("express");
const deliverymanController = require("../controllers/deliverymanController");
const authorization = require('../middlewares/adminAuthz');

const router = Router();

router.get("/", deliverymanController.getAll);
router.get("/name", deliverymanController.getByName);
router.post("/", authorization, deliverymanController.post);
router.put("/", authorization, deliverymanController.put);
router.delete("/", authorization, deliverymanController.delete);

module.exports = router;
