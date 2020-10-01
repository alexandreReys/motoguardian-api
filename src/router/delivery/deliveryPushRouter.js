const { Router } = require("express");
const deliveryPushController = require("../../controllers/delivery/deliveryPushController");

const router = Router();

router.post("/", deliveryPushController.post);
router.post("/send", deliveryPushController.send);


module.exports = router;
