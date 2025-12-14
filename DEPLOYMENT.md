# 🚀 Guía de Deployment - Módulo de Riesgos

Esta guía te muestra cómo desplegar el proyecto en plataformas gratuitas.

---

## 📋 Índice

1. [Requisitos Previos](#requisitos-previos)
2. [Base de Datos - MongoDB Atlas](#1-base-de-datos---mongodb-atlas)
3. [Backend - Render (Recomendado)](#2-backend---render-recomendado)
4. [Backend - Railway (Alternativa)](#3-backend---railway-alternativa)
5. [Frontend - Vercel (Recomendado)](#4-frontend---vercel-recomendado)
6. [Frontend - Netlify (Alternativa)](#5-frontend---netlify-alternativa)
7. [Verificación Final](#verificación-final)

---

## Requisitos Previos

- ✅ Cuenta de GitHub (para conectar los repositorios)
- ✅ El proyecto subido a un repositorio de GitHub

### Subir a GitHub

```bash
# En la raíz del proyecto
git init
git add .
git commit -m "Initial commit - Risk Management Module"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

---

## 1. Base de Datos - MongoDB Atlas

Ya tienes MongoDB Atlas configurado con la URI proporcionada. Si necesitas verificar la conexión:

1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. Accede a tu cluster `cluster0`
3. En **Network Access**, asegúrate de tener `0.0.0.0/0` para permitir conexiones desde cualquier IP
4. En **Database Access**, verifica las credenciales del usuario

> **Nota**: Tu base de datos es `ReeUtil` y la colección `riesgos` se creará automáticamente.

---

## 2. Backend - Render (Recomendado)

Render ofrece alojamiento gratuito para aplicaciones Node.js.

### Pasos:

1. **Crear cuenta** en [render.com](https://render.com) (puedes usar GitHub)

2. **Crear nuevo Web Service**:

   - Click en **"New +"** → **"Web Service"**
   - Conecta tu repositorio de GitHub
   - Selecciona el repositorio

3. **Configuración**:

   ```
   Name: riesgos-api (o el nombre que prefieras)
   Region: Oregon (o la más cercana)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Variables de Entorno** (en la sección "Environment"):

   ```
   MONGODB_URI=mongodb+srv://user:12345@cluster0.cfimyma.mongodb.net/ReeUtil?retryWrites=true&w=majority
   PORT=5500
   NODE_ENV=production
   CORS_ORIGIN=https://TU-FRONTEND.vercel.app
   ```

   > ⚠️ Actualiza `CORS_ORIGIN` después de desplegar el frontend

5. **Deploy**: Click en **"Create Web Service"**

6. **Espera** a que termine el deploy (5-10 minutos la primera vez)

7. **URL del Backend**: Render te dará una URL como:
   ```
   https://riesgos-api.onrender.com
   ```

### Importante:

- Los servicios gratuitos de Render se "duermen" después de 15 minutos de inactividad
- La primera solicitud después de dormir tarda ~30 segundos

---

## 3. Backend - Railway (Alternativa)

Railway es otra opción gratuita con mejor uptime.

### Pasos:

1. **Crear cuenta** en [railway.app](https://railway.app)

2. **Nuevo proyecto**:

   - Click en **"New Project"**
   - Selecciona **"Deploy from GitHub repo"**
   - Conecta tu repositorio

3. **Configuración**:

   - Railway detectará automáticamente que es Node.js
   - En **Settings** → **Root Directory**: `backend`

4. **Variables de Entorno** (Settings → Variables):

   ```
   MONGODB_URI=mongodb+srv://user:12345@cluster0.cfimyma.mongodb.net/ReeUtil?retryWrites=true&w=majority
   PORT=5500
   NODE_ENV=production
   CORS_ORIGIN=https://TU-FRONTEND.vercel.app
   ```

5. **Generar dominio**:
   - Settings → Domains → Generate Domain
   - Obtendrás algo como: `https://riesgos-api.up.railway.app`

---

## 4. Frontend - Vercel (Recomendado)

Vercel es ideal para React/Vite con deploy automático.

### Pasos:

1. **Crear cuenta** en [vercel.com](https://vercel.com) (usa GitHub)

2. **Importar proyecto**:

   - Click en **"Add New..."** → **"Project"**
   - Selecciona tu repositorio de GitHub

3. **Configuración**:

   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Variables de Entorno**:

   ```
   VITE_API_URL=https://riesgos-api.onrender.com/api
   ```

   > 📝 Usa la URL de tu backend desplegado

5. **Deploy**: Click en **"Deploy"**

6. **URL del Frontend**: Vercel te dará una URL como:
   ```
   https://riesgos-frontend.vercel.app
   ```

### Actualizar CORS en Backend:

Después de obtener la URL del frontend, actualiza la variable `CORS_ORIGIN` en Render/Railway:

```
CORS_ORIGIN=https://riesgos-frontend.vercel.app
```

---

## 5. Frontend - Netlify (Alternativa)

### Pasos:

1. **Crear cuenta** en [netlify.com](https://netlify.com)

2. **Nuevo sitio**:

   - Click en **"Add new site"** → **"Import an existing project"**
   - Conecta GitHub y selecciona el repositorio

3. **Configuración de Build**:

   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

4. **Variables de Entorno** (Site settings → Environment variables):

   ```
   VITE_API_URL=https://riesgos-api.onrender.com/api
   ```

5. **Deploy**: Netlify desplegará automáticamente

---

## Verificación Final

### 1. Probar el Backend

```bash
# Reemplaza con tu URL
curl https://riesgos-api.onrender.com/api/health
```

Deberías recibir:

```json
{
  "success": true,
  "message": "API de Gestión de Riesgos funcionando correctamente"
}
```

### 2. Probar el Frontend

1. Abre la URL del frontend en el navegador
2. Deberías ver el Dashboard
3. Intenta crear un nuevo riesgo

### 3. Verificar la Base de Datos

1. Ve a MongoDB Atlas
2. Navega a **Browse Collections**
3. Deberías ver la colección `riesgos` con los datos creados

---

## 🔧 Troubleshooting

### Error de CORS

Si ves errores de CORS en la consola del navegador:

1. Verifica que `CORS_ORIGIN` en el backend coincida exactamente con la URL del frontend
2. No incluyas una barra final (`/`) en la URL

### Backend no responde

1. Espera 30 segundos (puede estar "dormido")
2. Verifica los logs en Render/Railway
3. Asegúrate de que `MONGODB_URI` es correcta

### Frontend muestra "Error al cargar"

1. Abre DevTools → Network
2. Verifica que las peticiones van a la URL correcta del backend
3. Verifica `VITE_API_URL` en las variables de entorno

### La colección no se crea

La colección `riesgos` se crea automáticamente cuando guardas el primer documento. Simplemente crea un riesgo desde el frontend.

---

## 📊 Resumen de URLs

Después del deployment, tendrás:

| Servicio    | URL                                    |
| ----------- | -------------------------------------- |
| Backend API | `https://riesgos-api.onrender.com/api` |
| Frontend    | `https://tu-proyecto.vercel.app`       |
| MongoDB     | `cluster0.cfimyma.mongodb.net`         |

---

## 💡 Tips Adicionales

1. **Dominios personalizados**: Tanto Vercel como Netlify permiten agregar dominios personalizados gratis

2. **Monitoreo**: Usa [UptimeRobot](https://uptimerobot.com) para mantener tu backend de Render "despierto"

3. **CI/CD**: Los deploys se harán automáticamente cada vez que hagas push a la rama main

4. **Logs**: Revisa los logs en el dashboard de cada plataforma para debuggear problemas

---

¡Listo! Tu aplicación de gestión de riesgos está en producción. 🎉
