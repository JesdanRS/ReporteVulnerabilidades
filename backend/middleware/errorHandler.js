const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log para desarrollo
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  // Error de ID de MongoDB inválido
  if (err.name === "CastError") {
    const message = "Recurso no encontrado";
    return res.status(404).json({
      success: false,
      message,
    });
  }

  // Error de duplicado de MongoDB
  if (err.code === 11000) {
    const message = "Valor duplicado ingresado";
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // Error de validación de Mongoose
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: message.join(", "),
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Error del servidor",
  });
};

module.exports = errorHandler;
