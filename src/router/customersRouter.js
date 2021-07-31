const { Router } = require("express");
const customersController = require("../controllers/customersController");
const customeAuthorization = require('../middlewares/customer-authz');

const router = Router();

router.get("/", customeAuthorization, customersController.getAll);
router.get("/name/:name", customeAuthorization, customersController.getByName);
router.post("/", customersController.post);
router.post("/password-recover", customersController.passwordRecover);
router.put("/", customeAuthorization, customersController.put);
router.delete("/", customeAuthorization, customersController.delete);

module.exports = router;
