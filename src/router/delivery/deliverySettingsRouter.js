const { Router } = require("express");
const settingsController = require("../../controllers/delivery/deliverySettingsController");
const Authorization = require("../../middlewares/Authz");

const router = Router();

router.get("/", settingsController.getAll);
router.post("/", Authorization, settingsController.post);
router.put("/", Authorization, settingsController.put);
router.delete("/", Authorization, settingsController.delete);

module.exports = router;
