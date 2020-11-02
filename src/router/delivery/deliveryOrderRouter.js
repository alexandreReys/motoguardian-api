const { Router } = require("express");
const deliveryOrderControler = require("../../controllers/delivery/deliveryOrderController");

const router = Router();

router.get("/", deliveryOrderControler.getAll);
router.get("/deliveryman-status/", deliveryOrderControler.getByDeliveryManStatus);

router.get("/:idOrder", deliveryOrderControler.getById);
router.get("/status/:status", deliveryOrderControler.getByStatus);
router.get("/items/:idOrder", deliveryOrderControler.getItems);
router.get("/history/:idOrder", deliveryOrderControler.getHistory);
router.get("/postal-code/:postalCode", deliveryOrderControler.getCep);

router.put("/reject/:IdOrder", deliveryOrderControler.putRejectOrder);
router.put("/delivering/:IdOrder", deliveryOrderControler.putDeliveringOrder);
router.put("/delivered/:IdOrder", deliveryOrderControler.putDeliveredOrder);
router.put("/start-delivery/:IdOrder", deliveryOrderControler.putStartDelivery);
router.put("/end-delivery/:IdOrder", deliveryOrderControler.putEndDelivery);
router.put("/went-wrong-delivery/:IdOrder", deliveryOrderControler.wentWrongDelivery);

router.post("/", deliveryOrderControler.post);
router.post("/leaving", deliveryOrderControler.postLeaving);

module.exports = router;
