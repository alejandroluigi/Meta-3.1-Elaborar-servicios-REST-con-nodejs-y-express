/**
 * Configuración de la aplicación Express
 */

const express = require('express');
const tareaRoutes = require('./routes/tarea.routes');
const cors = require('cors');

const app = express();

// Función auxiliar global para respuestas flexibles
const responderApp = (req, res, options = {}) => {
  const {
    status = 200,
    success = true,
    message = '',
    data = undefined,
    error = undefined
  } = options;

  const formato = req.query.formato;

  if (formato === 'text') {
    res.status(status).type('text/plain');

    let salida = '';

    if (message) {
      salida += `${message}\n`;
    }

    if (data && typeof data === 'object') {
      salida += JSON.stringify(data, null, 2);
    }

    if (error) {
      salida += `\nError: ${error}`;
    }

    return res.send(salida.trim() || 'Respuesta en texto plano');
  }

  const respuesta = { success };

  if (message) respuesta.message = message;
  if (data !== undefined) respuesta.data = data;
  if (error) respuesta.error = error;

  return res.status(status).json(respuesta);
};
// Habilitar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear datos de formularios (opcional)
app.use(express.urlencoded({ extended: true }));

// Middleware de logging (opcional)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rutas API
app.use('/api/tareas', tareaRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  return responderApp(req, res, {
    status: 200,
    success: true,
    message: 'API de Tareas - Práctica MVC con Express',
    data: {
      version: '1.0.0',
      endpoints: {
        getAll: 'GET /api/tareas',
        search: 'GET /api/tareas/buscar?q=express',
        getById: 'GET /api/tareas/:id',
        create: 'POST /api/tareas',
        updateFull: 'PUT /api/tareas/:id',
        updatePartial: 'PATCH /api/tareas/:id',
        delete: 'DELETE /api/tareas/:id'
      }
    }
  });
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
  return responderApp(req, res, {
    status: 404,
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);

  return responderApp(req, res, {
    status: 500,
    success: false,
    message: 'Error interno del servidor',
    error: err.message
  });
});

module.exports = app;