const { Router } = require("express");
const ordersControler = require("../controllers/ordersController");
const router = Router();

router.get("/", ordersControler.getAll);
router.get("/deliveryman-status/", ordersControler.getByDeliveryManStatus);
router.get("/deliveryman/totals/date/:deliveryman", ordersControler.getTotalsByDeliverymanAndDate);
router.get("/:idOrder", ordersControler.getById);
router.get("/status/:status", ordersControler.getByStatus);
router.get("/items/:idOrder", ordersControler.getItems);
router.get("/history/:idOrder", ordersControler.getHistory);
router.get("/postal-code/:postalCode", ordersControler.getCep);

router.put("/accept/:IdOrder", ordersControler.putAcceptOrder);
router.put("/reject/:IdOrder", ordersControler.putRejectOrder);
router.put("/delivering/:IdOrder", ordersControler.putDeliveringOrder);
router.put("/delivered/:IdOrder", ordersControler.putDeliveredOrder);
router.put("/start-delivery/:IdOrder", ordersControler.putStartDelivery);
router.put("/end-delivery/:IdOrder", ordersControler.putEndDelivery);
router.put("/rating/:idOrder/:rating", ordersControler.updateRatingDelivery);
router.put("/went-wrong-delivery/:IdOrder", ordersControler.wentWrongDelivery);

router.post("/", ordersControler.post);
router.post("/leaving", ordersControler.postLeaving);

module.exports = router;
