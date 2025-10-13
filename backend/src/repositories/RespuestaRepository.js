
const db = require('../config/db'); 

/**
 * Registra una respuesta individual de un alumno a una pregunta.
 * @param {object} data - { id_ensayo, id_pregunta, id_alternativa, id_alumno, estado }
 */
async function createRespuesta(data) {
    const { id_ensayo, id_pregunta, id_alternativa, id_alumno, estado } = data;
    
    await db.query(
        `INSERT INTO "RESPUESTA" (id_ensayo, id_pregunta, id_alternativa, id_alumno, estado)
         VALUES ($1, $2, $3, $4, $5)`,
        [id_ensayo, id_pregunta, id_alternativa, id_alumno, estado]
    );

    return true; // Indica éxito
}

module.exports = {
    createRespuesta,
};