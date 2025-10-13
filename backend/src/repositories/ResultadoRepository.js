
const db = require('../config/db'); 

/**
 * Obtiene todos los resultados de ensayos para un alumno específico.
 * @param {number} idAlumno - ID del alumno a consultar.
 * @returns {Array} Lista de resultados.
 */
async function findResultadosByAlumnoId(idAlumno) {
    const result = await db.query(`
        SELECT 
            e.id AS id_ensayo,
            e.id_asignatura,
            a.nombre AS asignatura,
            e.dificultad,
            r.puntaje_obtenido,
            r.cantidad_correctas,
            r.cantidad_erroneas,
            r.cantidad_omitidas,
            r.tiempo_empleado
        FROM "RESULTADO" r
        JOIN "ENSAYO" e ON r.id_ensayo = e.id
        JOIN "ASIGNATURA" a ON e.id_asignatura = a.id
        WHERE r.id_alumno = $1
        ORDER BY r.id DESC
    `, [idAlumno]);

    return result.rows;
}

module.exports = {
    findResultadosByAlumnoId,
};

