
const RespuestaRepository = require('../repositories/RespuestaRepository');

/**
 * Guarda una respuesta individual en la base de datos.
 * @param {object} data - Datos de la respuesta.
 */
async function registrarRespuesta(data) {
    // 💡 Aquí se podría añadir validación de datos (ej. si los IDs existen)
    return RespuestaRepository.createRespuesta(data);
}

module.exports = {
    registrarRespuesta,
};