/**
 * Controlador de Tareas
 * Maneja las peticiones HTTP y responde en JSON o texto plano
 */

const tareaModel = require('../models/tarea.model');

/**
 * Respuesta flexible: JSON o texto plano
 */
const responder = (req, res, options = {}) => {
  const {
    status = 200,
    success = true,
    message = '',
    data = undefined,
    error = undefined
  } = options;

  const formato = req.query.formato;

  // =========================
  // RESPUESTA EN TEXTO PLANO
  // =========================
  if (formato === 'text') {
    res.status(status).type('text/plain');

    let salida = '';

    if (message) {
      salida += `${message}\n`;
    }

    // Si hay arreglo de tareas
    if (Array.isArray(data)) {
      if (data.length === 0) {
        salida += 'No hay tareas para mostrar.';
        return res.send(salida.trim());
      }

      salida += data
        .map(t => `ID: ${t.id} | Título: ${t.titulo} | Completada: ${t.completada}`)
        .join('\n');

      salida += `\nTotal: ${data.length}`;
      return res.send(salida.trim());
    }

    // Si hay una sola tarea
    if (data && typeof data === 'object') {
      // Si parece una tarea
      if ('id' in data && 'titulo' in data && 'completada' in data) {
        salida += `ID: ${data.id} | Título: ${data.titulo} | Completada: ${data.completada}`;
      } else {
        // Si es otro objeto (por ejemplo endpoints)
        salida += JSON.stringify(data, null, 2);
      }

      return res.send(salida.trim());
    }

    // Si hay error
    if (error) {
      salida += `Error: ${error}`;
      return res.send(salida.trim());
    }

    // Si no hay data pero sí mensaje
    if (!data && message) {
      return res.send(salida.trim());
    }

    return res.send('Respuesta en texto plano');
  }

  // =========================
  // RESPUESTA EN JSON
  // =========================
  const respuesta = {
    success
  };

  if (message) respuesta.message = message;
  if (data !== undefined) respuesta.data = data;
  if (Array.isArray(data)) respuesta.count = data.length;
  if (error) respuesta.error = error;

  return res.status(status).json(respuesta);
};

// GET /api/tareas - Obtener todas las tareas
const obtenerTodas = (req, res) => {
  try {
    const tareas = tareaModel.obtenerTodas();

    return responder(req, res, {
      status: 200,
      success: true,
      data: tareas
    });
  } catch (error) {
    return responder(req, res, {
      status: 500,
      success: false,
      message: 'Error al obtener las tareas',
      error: error.message
    });
  }
};

// GET /api/tareas/buscar?q=texto - Buscar tareas por título
const buscarPorTitulo = (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return responder(req, res, {
        status: 400,
        success: false,
        message: 'Debe proporcionar el parámetro de búsqueda ?q='
      });
    }

    const tareasEncontradas = tareaModel.buscarPorTitulo(q);

    return responder(req, res, {
      status: 200,
      success: true,
      message: `Resultados de búsqueda para: "${q}"`,
      data: tareasEncontradas
    });
  } catch (error) {
    return responder(req, res, {
      status: 500,
      success: false,
      message: 'Error al buscar tareas',
      error: error.message
    });
  }
};

// GET /api/tareas/:id - Obtener una tarea por ID
const obtenerPorId = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return responder(req, res, {
        status: 400,
        success: false,
        message: 'ID inválido. Debe ser un número'
      });
    }

    const tarea = tareaModel.obtenerPorId(id);

    if (!tarea) {
      return responder(req, res, {
        status: 404,
        success: false,
        message: `Tarea con ID ${id} no encontrada`
      });
    }

    return responder(req, res, {
      status: 200,
      success: true,
      data: tarea
    });
  } catch (error) {
    return responder(req, res, {
      status: 500,
      success: false,
      message: 'Error al obtener la tarea',
      error: error.message
    });
  }
};

// POST /api/tareas - Crear una nueva tarea
const crear = (req, res) => {
  try {
    const { titulo, completada } = req.body;

    if (!titulo) {
      return responder(req, res, {
        status: 400,
        success: false,
        message: 'El campo "titulo" es requerido'
      });
    }

    const nuevaTarea = tareaModel.crear({ titulo, completada });

    return responder(req, res, {
      status: 201,
      success: true,
      message: 'Tarea creada exitosamente',
      data: nuevaTarea
    });
  } catch (error) {
    return responder(req, res, {
      status: 500,
      success: false,
      message: 'Error al crear la tarea',
      error: error.message
    });
  }
};

// PUT /api/tareas/:id - Actualizar tarea completamente
const actualizarCompleta = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { titulo, completada } = req.body;

    if (isNaN(id)) {
      return responder(req, res, {
        status: 400,
        success: false,
        message: 'ID inválido. Debe ser un número'
      });
    }

    if (!titulo) {
      return responder(req, res, {
        status: 400,
        success: false,
        message: 'El campo "titulo" es requerido'
      });
    }

    const tareaActualizada = tareaModel.actualizarCompleta(id, { titulo, completada });

    if (!tareaActualizada) {
      return responder(req, res, {
        status: 404,
        success: false,
        message: `Tarea con ID ${id} no encontrada`
      });
    }

    return responder(req, res, {
      status: 200,
      success: true,
      message: 'Tarea actualizada completamente',
      data: tareaActualizada
    });
  } catch (error) {
    return responder(req, res, {
      status: 500,
      success: false,
      message: 'Error al actualizar la tarea',
      error: error.message
    });
  }
};

// PATCH /api/tareas/:id - Actualizar tarea parcialmente
const actualizarParcial = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosParciales = req.body;

    if (isNaN(id)) {
      return responder(req, res, {
        status: 400,
        success: false,
        message: 'ID inválido. Debe ser un número'
      });
    }

    if (Object.keys(datosParciales).length === 0) {
      return responder(req, res, {
        status: 400,
        success: false,
        message: 'Debe enviar al menos un campo para actualizar'
      });
    }

    const tareaActualizada = tareaModel.actualizarParcial(id, datosParciales);

    if (!tareaActualizada) {
      return responder(req, res, {
        status: 404,
        success: false,
        message: `Tarea con ID ${id} no encontrada`
      });
    }

    return responder(req, res, {
      status: 200,
      success: true,
      message: 'Tarea actualizada parcialmente',
      data: tareaActualizada
    });
  } catch (error) {
    return responder(req, res, {
      status: 500,
      success: false,
      message: 'Error al actualizar la tarea',
      error: error.message
    });
  }
};

// DELETE /api/tareas/:id - Eliminar una tarea
const eliminar = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return responder(req, res, {
        status: 400,
        success: false,
        message: 'ID inválido. Debe ser un número'
      });
    }

    const tareaEliminada = tareaModel.eliminar(id);

    if (!tareaEliminada) {
      return responder(req, res, {
        status: 404,
        success: false,
        message: `Tarea con ID ${id} no encontrada`
      });
    }

    return responder(req, res, {
      status: 200,
      success: true,
      message: 'Tarea eliminada exitosamente',
      data: tareaEliminada
    });
  } catch (error) {
    return responder(req, res, {
      status: 500,
      success: false,
      message: 'Error al eliminar la tarea',
      error: error.message
    });
  }
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  buscarPorTitulo,
  crear,
  actualizarCompleta,
  actualizarParcial,
  eliminar,
  responder // exportamos por si quieres reutilizarlo
};