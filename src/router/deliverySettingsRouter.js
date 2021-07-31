const { Router } = require("express");
const settingsController = require("../controllers/deliverySettingsController");
const authorization = require('../middlewares/adminAuthz');

const router = Router();

router.get("/", settingsController.getAll);
router.post("/", authorization, settingsController.post);
router.put("/", authorization, settingsController.put);
router.delete("/", authorization, settingsController.delete);

router.get("/distance/:address", settingsController.getDistance);

module.exports = router;
