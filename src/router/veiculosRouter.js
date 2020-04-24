const { Router } = require("express");
const veiculosController = require("../controllers/veiculosController");

const router = Router();

router.get("/", veiculosController.getAll);
router.get("/descricao", veiculosController.getByDescricao);
router.post("/", veiculosController.post);
router.put("/", veiculosController.put);
router.delete("/", veiculosController.delete);

module.exports = router;
