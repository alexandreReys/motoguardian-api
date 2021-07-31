const { Router } = require("express");
const imagesController = require("../controllers/imagesController");
const authorization = require('../middlewares/adminAuthz');

const router = Router();

router.post("/", authorization, imagesController.upload);
router.delete("/", authorization, imagesController.delete);

module.exports = router;
