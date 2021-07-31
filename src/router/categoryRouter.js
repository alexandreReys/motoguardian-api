const { Router } = require("express");
const categoryController = require("../controllers/categoryController");
const authorization = require("../middlewares/authz");

const router = Router();

router.get("/", categoryController.getAll);
router.get("/notapplist", categoryController.getAllNotAppList);
router.get("/selected", categoryController.getSelected);
router.get("/description", categoryController.getByDescription);
router.post("/", authorization, categoryController.post);
router.put("/", authorization, categoryController.put);
router.delete("/", authorization, categoryController.delete);

module.exports = router;
