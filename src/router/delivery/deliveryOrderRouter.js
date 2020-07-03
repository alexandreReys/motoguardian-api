const { Router } = require("express");
const deliveryOrderControler = require("../../controllers/delivery/deliveryOrderController");

const router = Router();

router.get("/", deliveryOrderControler.getAll);
router.get("/items/:idOrder", deliveryOrderControler.getItems);
router.get("/history/:idOrder", deliveryOrderControler.getHistory);
router.get("/postal-code/:postalCode", deliveryOrderControler.getCep);
router.put("/reject/:IdOrder", deliveryOrderControler.putRejectOrder);
router.put("/delivering/:IdOrder", deliveryOrderControler.putDeliveringOrder);
router.put("/delivered/:IdOrder", deliveryOrderControler.putDeliveredOrder);
router.post("/", deliveryOrderControler.post);

module.exports = router;
