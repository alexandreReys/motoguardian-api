const { Router } = require("express");
const oficinasController = require("../../src/controllers/oficinasController");

const router = Router();

router.get("/", oficinasController.getAll);
router.get("/fantasia", oficinasController.getByFantasia);
router.post("/", oficinasController.post);
router.put("/", oficinasController.put);
router.delete("/", oficinasController.delete);

module.exports = router;
