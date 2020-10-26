const { Router } = require("express");
const oficinasController = require("../../controllers/moto-help/oficinasController");

const router = Router();

router.get("/", oficinasController.getAll);
router.get("/fantasia", oficinasController.getByFantasia);
router.post("/", oficinasController.post);
router.put("/", oficinasController.put);
router.delete("/", oficinasController.delete);

module.exports = router;
