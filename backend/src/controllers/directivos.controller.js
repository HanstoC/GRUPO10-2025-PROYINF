
const directivosService = require('../services/directivos.service');

async function obtenerLista(req, res) {
    try {
        const directivos = directivosService.getDirectivosList();
        
        // El `console.log(data)` original se omite por ser código de desarrollo.
        res.json(directivos);
    } catch (err) {
        // Manejo de errores HTTP
        console.error('Error al obtener la lista de directivos:', err);
        res.status(500).send('Error'); // Manteniendo la respuesta de error original
    }
}

module.exports = {
    obtenerLista,
};