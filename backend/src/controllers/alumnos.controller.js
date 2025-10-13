

const alumnosService = require('../services/alumnos.service'); 

async function obtenerTodos(req, res) {
    try {
        // 1. Llama al servicio para obtener los datos
        const allAlumnosFlattened = alumnosService.getAllAlumnos();
        
        // 2. Envía la respuesta HTTP
        res.json(allAlumnosFlattened); 
    } catch (err) {
        // 3. Maneja y responde a los errores HTTP
        console.error('Error al obtener todos los alumnos:', err);
        res.status(500).send('Error al obtener la lista de alumnos.');
    }
}

async function obtenerLista(req, res) {
    try {
        const alumnos = alumnosService.getAlumnosList();
        
        // El `console.log(data)` original se elimina, ya que no es de producción.
        res.json(alumnos);
    } catch (err) {
        // Manejo de errores HTTP
        console.error('Error al obtener la lista de alumnos:', err);
        res.status(500).send('Error'); // Manteniendo la respuesta de error simple original
    }
}

async function obtenerAlumnosYFacetas(req, res) {
    try {
        // 1. Llamar al servicio
        const data = alumnosService.getAlumnosAndFacets();
        
        // 2. Responder
        res.json(data); 
    } catch (error) {
        // 3. Manejo de errores
        console.error('Error al obtener datos de alumnos y facetas:', error.message);
        res.status(500).json({ message: 'Error al obtener datos de alumnos y facetas.' });
    }
}

async function obtenerDatosCombinados(req, res) {
    try {
        // 1. Llamar al servicio y usar AWAIT
        const data = await alumnosService.getCombinedDataAndFacets(); 
        
        // 2. Responder
        res.json(data);
    } catch (error) {
        // 3. Manejo de errores
        console.error('Error en la ruta /api/data/combined:', error.message);
        res.status(500).json({ message: 'Error al obtener datos combinados.' });
    }
}


module.exports = {
    obtenerTodos,
    obtenerLista,
    obtenerAlumnosYFacetas,
    obtenerDatosCombinados,
};