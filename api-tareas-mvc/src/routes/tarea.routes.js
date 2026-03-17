/**
* Rutas de Tareas
* Define los endpoints de la API
*/
const express = require('express');
const tareaController = require('../controllers/tarea.controller');
const router = express.Router();
// GET /api/tareas - Obtener todas las tareas
router.get('/', tareaController.obtenerTodas);
// GET /api/tareas/buscar?q=texto - Buscar tareas por título
router.get('/buscar', tareaController.buscarPorTitulo);
// GET /api/tareas/:id - Obtener una tarea por ID
router.get('/:id', tareaController.obtenerPorId);
// POST /api/tareas - Crear una nueva tarea
router.post('/', tareaController.crear);
// PUT /api/tareas/:id - Actualizar tarea completamente
router.put('/:id', tareaController.actualizarCompleta);
// PATCH /api/tareas/:id - Actualizar tarea parcialmente
router.patch('/:id', tareaController.actualizarParcial);
// DELETE /api/tareas/:id - Eliminar una tarea
router.delete('/:id', tareaController.eliminar);
module.exports = router;