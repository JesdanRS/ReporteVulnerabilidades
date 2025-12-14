const Riesgo = require("../models/Riesgo");

// @desc    Obtener todos los riesgos
// @route   GET /api/riesgos
// @access  Public
const getRiesgos = async (req, res) => {
  try {
    const {
      estado,
      nivelRiesgo,
      categoria,
      ordenar = "-createdAt",
    } = req.query;

    // Construir filtro dinámico
    const filtro = {};
    if (estado) filtro.estado = estado;
    if (nivelRiesgo) filtro.nivelRiesgo = nivelRiesgo;
    if (categoria) filtro.categoria = categoria;

    const riesgos = await Riesgo.find(filtro).sort(ordenar);

    res.status(200).json({
      success: true,
      count: riesgos.length,
      data: riesgos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los riesgos",
      error: error.message,
    });
  }
};

// @desc    Obtener un riesgo por ID
// @route   GET /api/riesgos/:id
// @access  Public
const getRiesgoById = async (req, res) => {
  try {
    const riesgo = await Riesgo.findById(req.params.id);

    if (!riesgo) {
      return res.status(404).json({
        success: false,
        message: "Riesgo no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: riesgo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener el riesgo",
      error: error.message,
    });
  }
};

// @desc    Crear un nuevo riesgo
// @route   POST /api/riesgos
// @access  Public
const createRiesgo = async (req, res) => {
  try {
    const riesgo = await Riesgo.create(req.body);

    res.status(201).json({
      success: true,
      message: "Riesgo creado exitosamente",
      data: riesgo,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error al crear el riesgo",
      error: error.message,
    });
  }
};

// @desc    Actualizar un riesgo
// @route   PUT /api/riesgos/:id
// @access  Public
const updateRiesgo = async (req, res) => {
  try {
    // Calcular nivel de riesgo si se actualizan probabilidad o impacto
    if (req.body.probabilidad !== undefined && req.body.impacto !== undefined) {
      const valor = req.body.probabilidad * req.body.impacto;
      req.body.valorRiesgo = valor;
      if (valor <= 4) req.body.nivelRiesgo = "Bajo";
      else if (valor <= 9) req.body.nivelRiesgo = "Medio";
      else if (valor <= 15) req.body.nivelRiesgo = "Alto";
      else req.body.nivelRiesgo = "Crítico";
    }

    const riesgo = await Riesgo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!riesgo) {
      return res.status(404).json({
        success: false,
        message: "Riesgo no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Riesgo actualizado exitosamente",
      data: riesgo,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error al actualizar el riesgo",
      error: error.message,
    });
  }
};

// @desc    Eliminar un riesgo
// @route   DELETE /api/riesgos/:id
// @access  Public
const deleteRiesgo = async (req, res) => {
  try {
    const riesgo = await Riesgo.findByIdAndDelete(req.params.id);

    if (!riesgo) {
      return res.status(404).json({
        success: false,
        message: "Riesgo no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Riesgo eliminado exitosamente",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar el riesgo",
      error: error.message,
    });
  }
};

// @desc    Obtener estadísticas de riesgos
// @route   GET /api/riesgos/stats/resumen
// @access  Public
const getEstadisticas = async (req, res) => {
  try {
    const totalRiesgos = await Riesgo.countDocuments();

    // Agrupar por nivel de riesgo
    const porNivel = await Riesgo.aggregate([
      { $group: { _id: "$nivelRiesgo", count: { $sum: 1 } } },
    ]);

    // Agrupar por estado
    const porEstado = await Riesgo.aggregate([
      { $group: { _id: "$estado", count: { $sum: 1 } } },
    ]);

    // Agrupar por categoría
    const porCategoria = await Riesgo.aggregate([
      { $group: { _id: "$categoria", count: { $sum: 1 } } },
    ]);

    // Riesgos críticos y altos activos
    const riesgosAltos = await Riesgo.countDocuments({
      nivelRiesgo: { $in: ["Alto", "Crítico"] },
      estado: { $nin: ["Mitigado", "Cerrado"] },
    });

    // Próximos a vencer (en los próximos 7 días)
    const hoy = new Date();
    const enUnaSemana = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
    const proximosVencer = await Riesgo.find({
      fechaLimite: { $gte: hoy, $lte: enUnaSemana },
      estado: { $nin: ["Mitigado", "Cerrado"] },
    }).sort("fechaLimite");

    res.status(200).json({
      success: true,
      data: {
        totalRiesgos,
        riesgosAltos,
        porNivel: porNivel.reduce((acc, item) => {
          acc[item._id || "Sin nivel"] = item.count;
          return acc;
        }, {}),
        porEstado: porEstado.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        porCategoria: porCategoria.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        proximosVencer,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message,
    });
  }
};

module.exports = {
  getRiesgos,
  getRiesgoById,
  createRiesgo,
  updateRiesgo,
  deleteRiesgo,
  getEstadisticas,
};
