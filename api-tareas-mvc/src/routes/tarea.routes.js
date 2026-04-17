/**
 * Rutas de Tareas
 * Define los endpoints de la API
 */

const express = require('express');
const tareaController = require('../controllers/tarea.controller');
const { verificarJWT, verificarCSRF } = require('../middleware/auth.middleware');

const router = express.Router();

// Todas las rutas de tareas quedan protegidas con JWT
router.use(verificarJWT);

// GET /api/tareas - Obtener todas las tareas
router.get('/', tareaController.obtenerTodas);

// GET /api/tareas/buscar?q=texto - Buscar tareas por título
router.get('/buscar', tareaController.buscarPorTitulo);

// GET /api/tareas/:id - Obtener una tarea por ID
router.get('/:id', tareaController.obtenerPorId);

// POST /api/tareas - Crear una nueva tarea
router.post('/', verificarCSRF, tareaController.crear);

// PUT /api/tareas/:id - Actualizar tarea completamente
router.put('/:id', verificarCSRF, tareaController.actualizarCompleta);

// PATCH /api/tareas/:id - Actualizar tarea parcialmente
router.patch('/:id', verificarCSRF, tareaController.actualizarParcial);

// DELETE /api/tareas/:id - Eliminar una tarea
router.delete('/:id', verificarCSRF, tareaController.eliminar);

module.exports = router;