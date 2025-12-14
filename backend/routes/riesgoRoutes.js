const express = require("express");
const router = express.Router();
const {
  getRiesgos,
  getRiesgoById,
  createRiesgo,
  updateRiesgo,
  deleteRiesgo,
  getEstadisticas,
} = require("../controllers/riesgoController");

// Ruta de estadísticas (debe ir antes de /:id para evitar conflictos)
router.get("/stats/resumen", getEstadisticas);

// Rutas CRUD
router.route("/").get(getRiesgos).post(createRiesgo);

router.route("/:id").get(getRiesgoById).put(updateRiesgo).delete(deleteRiesgo);

module.exports = router;
