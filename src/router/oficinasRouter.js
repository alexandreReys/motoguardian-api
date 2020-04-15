const { Router } = require("express");
const OficinasController = require("../controllers/OficinasController");

const router = Router();

router.get("/", OficinasController.getAll);
router.get("/fantasia", OficinasController.getByFantasia);
router.post("/", OficinasController.post);
router.put("/", OficinasController.put);
router.delete("/", OficinasController.delete);

module.exports = router;
