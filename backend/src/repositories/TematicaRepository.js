
const db = require('../config/db'); 

/**
 * Obtiene todas las temáticas (tópicos) para una asignatura específica.
 * @param {number} idAsignatura - ID de la asignatura a consultar.
 * @returns {Array} Lista de temáticas.
 */
async function findByAsignaturaId(idAsignatura) {
    const result = await db.query(
        'SELECT * FROM "TEMATICA" WHERE id_asignatura = $1',
        [idAsignatura]
    );
    return result.rows;
}

module.exports = {
    findByAsignaturaId,
};