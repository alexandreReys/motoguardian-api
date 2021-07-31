const { Router } = require("express");
const customersController = require("../controllers/customersController");
const customeAuthorization = require('../middlewares/customerAuthz');

const router = Router();

router.get("/", customeAuthorization, customersController.getAll);
router.get("/name/:name", customeAuthorization, customersController.getByName);
router.post("/", customeAuthorization, customersController.post);
router.post("/password-recover", customeAuthorization, customersController.passwordRecover);
router.put("/", customeAuthorization, customersController.put);
router.delete("/", customeAuthorization, customersController.delete);

module.exports = router;
