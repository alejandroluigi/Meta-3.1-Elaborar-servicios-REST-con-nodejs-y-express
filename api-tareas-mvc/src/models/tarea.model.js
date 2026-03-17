/**
* Modelo de Tarea
* Define la estructura de datos
*/
// Base de datos en memoria (lista de tareas)
let tareas = [
{ id: 1, titulo: 'Aprender Express', completada: false },
{ id: 2, titulo: 'Implementar MVC', completada: false },
{ id: 3, titulo: 'Probar API con Postman', completada: true }
];
let idActual = 4; // Para generar IDs autoincrementales
// Obtener todas las tareas
const obtenerTodas = () => {
return tareas;
};
// Obtener una tarea por ID
const obtenerPorId = (id) => {
return tareas.find(tarea => tarea.id === id);
};
// Buscar tareas por título (parcial, case insensitive)
const buscarPorTitulo = (textoBusqueda) => {
  return tareas.filter(tarea =>
    tarea.titulo.toLowerCase().includes(textoBusqueda.toLowerCase())
  );
};
// Crear una nueva tarea
const crear = (datosTarea) => {
const nuevaTarea = {
id: idActual++,
titulo: datosTarea.titulo,
completada: datosTarea.completada || false
};
tareas.push(nuevaTarea);
return nuevaTarea;
};
// Actualizar una tarea completamente (PUT)
const actualizarCompleta = (id, datosTarea) => {
const indice = tareas.findIndex(t => t.id === id);
if (indice === -1) return null;
tareas[indice] = {
id: id,
titulo: datosTarea.titulo,
completada: datosTarea.completada || false
};
return tareas[indice];
};
// Actualizar parcialmente una tarea (PATCH)
const actualizarParcial = (id, datosParciales) => {
const indice = tareas.findIndex(t => t.id === id);
if (indice === -1) return null;
tareas[indice] = {
...tareas[indice],
...datosParciales,
id: id // Aseguramos que el ID no se modifique
};
return tareas[indice];
};
// Eliminar una tarea
const eliminar = (id) => {
const indice = tareas.findIndex(t => t.id === id);
if (indice === -1) return null;
const tareaEliminada = tareas[indice];
tareas.splice(indice, 1);
return tareaEliminada;
};
// Exportar todas las funciones del modelo
module.exports = {
obtenerTodas,
obtenerPorId,
buscarPorTitulo,
crear,
actualizarCompleta,
actualizarParcial,
eliminar
};
