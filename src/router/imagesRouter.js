const { Router } = require("express");
const imagesController = require("../controllers/imagesController");
const authorization = require("../middlewares/authz");

const router = Router();

router.post("/", authorization, imagesController.upload);
router.delete("/", authorization, imagesController.delete);

module.exports = router;
