const mongoose = require("mongoose");

// Función para calcular el nivel de riesgo basado en probabilidad × impacto
const calcularNivelRiesgo = (probabilidad, impacto) => {
  const valor = probabilidad * impacto;
  if (valor <= 4) return "Bajo";
  if (valor <= 9) return "Medio";
  if (valor <= 15) return "Alto";
  return "Crítico";
};

const riesgoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es requerido"],
      trim: true,
      maxlength: [200, "El título no puede exceder 200 caracteres"],
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es requerida"],
      trim: true,
    },
    categoria: {
      type: String,
      required: [true, "La categoría es requerida"],
      enum: {
        values: [
          "Operacional",
          "Tecnológico",
          "Legal",
          "Financiero",
          "Reputacional",
          "Seguridad Física",
          "Ciberseguridad",
        ],
        message: "Categoría no válida",
      },
    },
    probabilidad: {
      type: Number,
      required: [true, "La probabilidad es requerida"],
      min: [1, "La probabilidad mínima es 1"],
      max: [5, "La probabilidad máxima es 5"],
    },
    impacto: {
      type: Number,
      required: [true, "El impacto es requerido"],
      min: [1, "El impacto mínimo es 1"],
      max: [5, "El impacto máximo es 5"],
    },
    nivelRiesgo: {
      type: String,
      enum: ["Bajo", "Medio", "Alto", "Crítico"],
    },
    valorRiesgo: {
      type: Number,
    },
    consecuencias: {
      type: String,
      required: [true, "Las consecuencias son requeridas"],
      trim: true,
    },
    planAccion: {
      type: String,
      required: [true, "El plan de acción es requerido"],
      trim: true,
    },
    fechaIdentificacion: {
      type: Date,
      required: [true, "La fecha de identificación es requerida"],
      default: Date.now,
    },
    fechaLimite: {
      type: Date,
    },
    responsable: {
      type: String,
      required: [true, "El responsable es requerido"],
      trim: true,
    },
    estado: {
      type: String,
      required: true,
      enum: {
        values: [
          "Identificado",
          "En análisis",
          "En tratamiento",
          "Mitigado",
          "Cerrado",
        ],
        message: "Estado no válido",
      },
      default: "Identificado",
    },
    observaciones: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware pre-save para calcular automáticamente el nivel de riesgo
riesgoSchema.pre("save", function (next) {
  this.valorRiesgo = this.probabilidad * this.impacto;
  this.nivelRiesgo = calcularNivelRiesgo(this.probabilidad, this.impacto);
  next();
});

// Middleware pre-findOneAndUpdate para recalcular nivel de riesgo en actualizaciones
riesgoSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.probabilidad !== undefined && update.impacto !== undefined) {
    update.valorRiesgo = update.probabilidad * update.impacto;
    update.nivelRiesgo = calcularNivelRiesgo(
      update.probabilidad,
      update.impacto
    );
  }
  next();
});

// Índices para búsquedas eficientes
riesgoSchema.index({ estado: 1 });
riesgoSchema.index({ nivelRiesgo: 1 });
riesgoSchema.index({ categoria: 1 });
riesgoSchema.index({ fechaIdentificacion: -1 });

const Riesgo = mongoose.model("Riesgo", riesgoSchema);

module.exports = Riesgo;
