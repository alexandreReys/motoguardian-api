const { Router } = require("express");
const clientesController = require("../controllers/clientesController");

const router = Router();

router.get("/", clientesController.getAll);
router.get("/nome", clientesController.getByNome);
router.post("/", clientesController.post);
router.put("/", clientesController.put);
router.delete("/", clientesController.delete);

module.exports = router;
