# Módulo de Registro de Riesgos de Seguridad

Sistema completo para la gestión y análisis de riesgos de seguridad con dashboard, registro de eventos, cálculo automático de nivel de riesgo y seguimiento.

## 🚀 Características

- ✅ Dashboard con estadísticas en tiempo real
- ✅ Registro y edición de riesgos
- ✅ Cálculo automático del nivel de riesgo (Probabilidad × Impacto)
- ✅ Filtrado por estado, nivel y categoría
- ✅ Vista detallada de cada riesgo
- ✅ Seguimiento de fechas límite
- ✅ API REST completa

## 📁 Estructura del Proyecto

```
ReporteVulnerabilidades/
├── backend/                 # API Node.js + Express
│   ├── config/             # Configuración de DB
│   ├── controllers/        # Lógica de negocio
│   ├── middleware/         # Manejo de errores
│   ├── models/             # Modelos Mongoose
│   ├── routes/             # Rutas API
│   └── server.js           # Punto de entrada
│
└── frontend/               # React + Vite
    └── src/
        ├── components/     # Componentes React
        └── services/       # Servicios API
```

## 🛠️ Instalación Local

### Backend

```bash
cd backend
npm install
npm run dev
```

El servidor estará disponible en `http://localhost:5500`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🔧 Variables de Entorno

### Backend (.env)

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
PORT=5500
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5500/api
```

## 📡 Endpoints de la API

| Método | Endpoint                     | Descripción              |
| ------ | ---------------------------- | ------------------------ |
| GET    | `/api/riesgos`               | Listar todos los riesgos |
| GET    | `/api/riesgos/:id`           | Obtener un riesgo        |
| POST   | `/api/riesgos`               | Crear nuevo riesgo       |
| PUT    | `/api/riesgos/:id`           | Actualizar riesgo        |
| DELETE | `/api/riesgos/:id`           | Eliminar riesgo          |
| GET    | `/api/riesgos/stats/resumen` | Estadísticas             |
| GET    | `/api/health`                | Estado del servidor      |

## 📊 Modelo de Datos

```javascript
{
  titulo: String,
  descripcion: String,
  categoria: String,         // Operacional, Tecnológico, Legal, etc.
  probabilidad: Number,      // 1-5
  impacto: Number,           // 1-5
  nivelRiesgo: String,       // Bajo, Medio, Alto, Crítico (calculado)
  valorRiesgo: Number,       // probabilidad × impacto
  consecuencias: String,
  planAccion: String,
  fechaIdentificacion: Date,
  fechaLimite: Date,
  responsable: String,
  estado: String,            // Identificado, En análisis, etc.
  observaciones: String
}
```

## 🌐 Deployment

Ver guía completa en `DEPLOYMENT.md`

### Opciones Gratuitas

- **Backend**: Render, Railway, Cyclic
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Base de Datos**: MongoDB Atlas (512MB gratis)

## 📝 Licencia

MIT License
