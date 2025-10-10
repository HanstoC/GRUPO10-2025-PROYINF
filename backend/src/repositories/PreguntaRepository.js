const db = require('../config/db'); // Necesario para obtener el cliente/conexión

/**
 * Inserta una nueva temática si no existe su ID.
 * @param {number} id_asignatura
 * @param {string} nombre - El topico a usar como nombre.
 * @param {object} client - Conexión individual de la DB
 */
async function createTematica(id_asignatura, nombre, client) {
    const tematicaResult = await client.query(
        'INSERT INTO "TEMATICA" (id_asignatura, nombre) VALUES ($1, $2) RETURNING id',
        [id_asignatura, nombre]
    );
    return tematicaResult.rows[0].id;
}

/**
 * Inserta el registro principal de la Pregunta.
 * @param {object} data - { id_asignatura, id_profesor, tematicaId, enunciado, imagen }
 * @param {object} client - Conexión individual de la DB
 */
async function createPregunta(data, client) {
    const preguntaResult = await client.query(
        `INSERT INTO "PREGUNTA" (id_asignatura, id_profesor, id_tematica, enunciado, imagen_base64)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [data.id_asignatura, data.id_profesor, data.tematicaId, data.enunciado, data.imagen]
    );
    return preguntaResult.rows[0].id;
}

/**
 * Inserta múltiples alternativas asociadas a una pregunta.
 * @param {number} id_pregunta - ID de la pregunta creada.
 * @param {Array<object>} alternativas - Array de { texto, es_correcta }.
 * @param {object} client - Conexión individual de la DB
 */
async function createAlternativas(id_pregunta, alternativas, client) {
    // Itera sobre el array de alternativas y crea una promesa de inserción para cada una.
    const insertPromises = alternativas.map(alt =>
        client.query(
            `INSERT INTO "ALTERNATIVA" (id_pregunta, texto, es_correcta)
             VALUES ($1, $2, $3)`,
            [id_pregunta, alt.texto, alt.es_correcta]
        )
    );
    await Promise.all(insertPromises);
}

/**
 * Obtiene todas las preguntas con sus detalles, con un filtro opcional por asignatura.
 * @param {Array<number>} [asignaturaIds=[]] - Array de IDs de asignaturas a filtrar.
 * @returns {Array} Lista de preguntas detalladas.
 */
async function findAllWithDetails(asignaturaIds = []) {
    let whereClause = "";
    let values = [];
    
    // Si se proporcionan IDs, construimos la cláusula WHERE.
    // Usamos GENERATE_SERIES para crear la lista de IDs para el operador IN, 
    // lo que permite pasar un array de forma segura al pool.query.
    if (asignaturaIds && asignaturaIds.length > 0) {
        // Ejemplo de consulta para manejar múltiples IDs de forma segura
        whereClause = ` WHERE p.id_asignatura = ANY($1)`;
        values.push(asignaturaIds);
    }
    
    // Si el filtro no está presente, whereClause sigue siendo una cadena vacía.

    const result = await db.query(`
        SELECT 
            p.id,
            p.enunciado,
            p.imagen_base64,
            t.nombre AS topico,
            a.nombre AS asignatura,
            u.rut AS autor
        FROM "PREGUNTA" p
        JOIN "TEMATICA" t ON p.id_tematica = t.id
        JOIN "ASIGNATURA" a ON p.id_asignatura = a.id
        JOIN "usuario" u ON p.id_profesor = u.id
        ${whereClause}
        ORDER BY p.id DESC
    `, values);

    return result.rows;
}

/**
 * Obtiene los detalles de una pregunta por su ID, incluyendo el tópico.
 * @param {number} id - ID de la pregunta.
 * @returns {object | null} La pregunta con los datos básicos.
 */
async function findPreguntaById(id) {
    const result = await db.query(
        `SELECT p.*, t.id as id_tematica, t.nombre AS topico 
         FROM "PREGUNTA" p 
         INNER JOIN "TEMATICA" t ON t.id = p.id_tematica 
         WHERE p.id = $1`, 
        [id]
    );
    return result.rows[0];
}

/**
 * Obtiene todas las alternativas para una pregunta específica.
 * @param {number} idPregunta - ID de la pregunta.
 * @returns {Array<object>} Lista de alternativas con el flag 'es_correcta'.
 */
async function findAlternativasByPreguntaId(idPregunta) {
    const result = await db.query(
        `SELECT a.* FROM "ALTERNATIVA" a WHERE a.id_pregunta = $1 ORDER BY a.id ASC`, 
        [idPregunta]
    );
    return result.rows;
}

/**
 * Actualiza la información principal de la pregunta.
 * @param {number} id - ID de la pregunta.
 * @param {object} data - { enunciado, imagen_base64, id_asignatura }
 * @param {object} client - Cliente de la transacción.
 */
async function updatePregunta(id, data, client) {
    const { enunciado, imagen_base64, id_asignatura } = data;
    await client.query(
        `UPDATE "PREGUNTA" SET enunciado = $1, imagen_base64 = $2, id_asignatura = $3 WHERE id = $4`, 
        [enunciado, imagen_base64, id_asignatura, id]
    );
}

/**
 * Actualiza el nombre de la temática.
 * @param {number} idTematica - ID de la temática a actualizar.
 * @param {string} topico - El nuevo nombre del tópico.
 * @param {object} client - Cliente de la transacción.
 */
async function updateTematica(idTematica, topico, client) {
    await client.query(
        `UPDATE "TEMATICA" SET nombre = $1 WHERE id = $2`, 
        [topico, idTematica]
    );
}

/**
 * Actualiza una alternativa específica.
 * @param {number} id - ID de la alternativa.
 * @param {object} alternativa - { texto, es_correcta }
 * @param {object} client - Cliente de la transacción.
 */
async function updateAlternativa(id, alternativa, client) {
    await client.query(
        `UPDATE "ALTERNATIVA" SET texto = $1, es_correcta = $2 WHERE id = $3`, 
        [alternativa.texto, alternativa.es_correcta, id]
    );
}

module.exports = {
    createTematica,
    createPregunta,
    createAlternativas,
    findAllWithDetails,
    findPreguntaById,
    findAlternativasByPreguntaId,
    updatePregunta,
    updateTematica,
    updateAlternativa,
};