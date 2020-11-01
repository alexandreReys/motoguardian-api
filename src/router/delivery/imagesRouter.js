const { Router } = require("express");
const imagesController = require("../../controllers/delivery/imagesController");
const Authorization = require("../../middlewares/Authz");

const router = Router();

router.post("/", Authorization, imagesController.upload);
router.delete("/", Authorization, imagesController.delete);

module.exports = router;
