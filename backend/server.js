require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const riesgoRoutes = require("./routes/riesgoRoutes");

const app = express();

// Conectar a MongoDB
connectDB();

// Middleware de seguridad
app.use(helmet());

// Configurar CORS - Permitir Vercel y localhost
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requests sin origin (Postman, curl, etc)
      if (!origin) return callback(null, true);

      // Permitir localhost en cualquier puerto
      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      // Permitir cualquier URL de Vercel
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // Si nada coincide, rechazar
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de salud
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API de Gestión de Riesgos funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la API
app.use("/api/riesgos", riesgoRoutes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// Manejador de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 API disponible en: http://localhost:${PORT}/api`);
});
