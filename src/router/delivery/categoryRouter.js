const { Router } = require("express");
const categoryController = require("../../controllers/delivery/categoryController");
const Authorization = require("../../middlewares/Authz");

const router = Router();

router.get("/", categoryController.getAll);
router.get("/description", categoryController.getByDescription);
router.post("/", Authorization, categoryController.post);
router.put("/", Authorization, categoryController.put);
router.delete("/", Authorization, categoryController.delete);

module.exports = router;
