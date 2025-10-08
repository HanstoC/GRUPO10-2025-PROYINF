
const docentesService = require('../services/docentes.service');

async function obtenerLista(req, res) {
    try {
        const docentes = docentesService.getDocentesList();
        
        // El `console.log(data)` original se omite por ser código de desarrollo.
        res.json(docentes);
    } catch (err) {
        // Manejo de errores HTTP
        console.error('Error al obtener la lista de docentes:', err);
        res.status(500).send('Error'); // Manteniendo la respuesta de error original
    }
}

module.exports = {
    obtenerLista,
};