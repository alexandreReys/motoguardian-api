const { Router } = require("express");
const customerController = require("../../controllers/delivery/customerController");
const Authorization = require("../../middlewares/Authz");

const router = Router();

router.get("/", customerController.getAll);
router.get("/name/:name", customerController.getByName);
router.post("/", Authorization, customerController.post);
router.put("/", Authorization, customerController.put);
router.delete("/", Authorization, customerController.delete);

module.exports = router;
