
const db = require('../config/db'); // Asumo la variable 'db'

/**
 * Busca ensayos con filtros opcionales.
 * @param {object} filters - Objeto con los filtros (ej: { profesorId, asignaturaIds })
 * @returns {Array} Lista de ensayos.
 */
async function findEnsayosWithFilters(filters) {
    let query = `
        SELECT e.*, a.nombre AS asignatura
        FROM "ENSAYO" e
        JOIN "ASIGNATURA" a ON e.id_asignatura = a.id
    `;
    const values = [];
    const whereClauses = [];
    let paramIndex = 1;

    // 1. FILTRO POR PROFESOR
    if (filters.profesorId) {
        whereClauses.push(`e.id_profesor = $${paramIndex}`);
        values.push(filters.profesorId);
        paramIndex++;
    }

    // 2. FILTRO POR ASIGNATURA (maneja múltiples IDs)
    if (filters.asignaturaIds && filters.asignaturaIds.length > 0) {
        // Crea placeholders para el operador IN
        const placeholders = filters.asignaturaIds.map(() => `$${paramIndex++}`).join(', ');
        whereClauses.push(`e.id_asignatura IN (${placeholders})`);
        values.push(...filters.asignaturaIds); // Agrega todos los IDs al array de valores
    }

    // 3. Ensambla la consulta
    if (whereClauses.length > 0) {
        query += ` WHERE ` + whereClauses.join(' AND ');
    }

    const result = await db.query(query, values);
    return result.rows;
}

/**
 * Inserta el registro principal del Ensayo y retorna su ID.
 * @param {object} data - { id_asignatura, id_profesor, dificultad }
 * @param {object} client - Conexión individual de la DB
 */
async function createEnsayo(data, client) {
    const result = await client.query(
        `INSERT INTO "ENSAYO" (id_asignatura, id_profesor, dificultad)
         VALUES ($1, $2, $3) RETURNING id`,
        [data.id_asignatura, data.id_profesor, data.dificultad]
    );
    return result.rows[0].id;
}

/**
 * Inserta múltiples relaciones ENSAYO_PREGUNTA.
 * @param {number} id_ensayo - ID del Ensayo creado.
 * @param {Array<number>} preguntas - Array de IDs de preguntas.
 * @param {object} client - Conexión individual de la DB
 */
async function addPreguntasToEnsayo(id_ensayo, preguntas, client) {
    // Construye el array de promesas de inserción
    const insertPromises = preguntas.map((id_pregunta) =>
        client.query(
            `INSERT INTO "ENSAYO_PREGUNTA" (id_ensayo, id_pregunta) VALUES ($1, $2)`,
            [id_ensayo, id_pregunta]
        )
    );
    // Ejecuta todas las inserciones simultáneamente
    await Promise.all(insertPromises);
    return true; // Retorna éxito
}

/**
 * Obtiene todas las preguntas y sus alternativas asociadas a un Ensayo.
 * @param {number} ensayoId - ID del ensayo.
 * @returns {Array} Lista de preguntas con sus alternativas (formato JSON_AGG).
 */
async function findPreguntasByEnsayoId(ensayoId) {
    const result = await db.query(`
        SELECT 
            P.id AS pregunta_id,
            P.enunciado AS pregunta,
            JSON_AGG(JSON_BUILD_OBJECT(
                'id', A.id,
                'texto', A.texto
            )) AS alternativas
        FROM "ENSAYO_PREGUNTA" EP
        JOIN "PREGUNTA" P ON EP.id_pregunta = P.id
        JOIN "ALTERNATIVA" A ON A.id_pregunta = P.id
        WHERE EP.id_ensayo = $1
        GROUP BY P.id, P.enunciado
    `, [ensayoId]);

    return result.rows;
}

/**
 * Obtiene las respuestas correctas (ID de alternativa) para todas las preguntas de un ensayo.
 * @param {number} ensayoId - ID del ensayo.
 * @param {object} client - Conexión individual de la DB
 * @returns {Array} Lista de { pregunta_id, alternativa_correcta }.
 */
async function findRespuestasCorrectas(ensayoId, client) {
    const { rows } = await client.query(`
        SELECT P.id AS pregunta_id, A.id AS alternativa_correcta
        FROM "ENSAYO_PREGUNTA" EP
        JOIN "PREGUNTA" P ON EP.id_pregunta = P.id
        JOIN "ALTERNATIVA" A ON A.id_pregunta = P.id AND A.es_correcta = true
        WHERE EP.id_ensayo = $1
    `, [ensayoId]);
    
    return rows;
}

/**
 * Inserta el resultado final del ensayo realizado por un alumno.
 * @param {number} alumnoId - ID del alumno.
 * @param {object} resultado - Objeto con los resultados calculados.
 * @param {object} client - Conexión individual de la DB
 */
async function saveResultado(alumnoId, resultado, client) {
    await client.query(`
        INSERT INTO "RESULTADO" (
            id_alumno,
            id_ensayo,
            puntaje_obtenido,
            cantidad_correctas,
            cantidad_erroneas,
            cantidad_omitidas,
            tiempo_empleado
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
        alumnoId, 
        resultado.ensayoId, 
        resultado.puntaje, 
        resultado.correctas, 
        resultado.erroneas, 
        resultado.omitidas, 
        resultado.tiempo
    ]);
    return true;
}

async function findAllEnsayoResults() {
    // Ejemplo de consulta compleja para obtener resultados y detalles.
    const result = await db.query(`
        SELECT 
            r.*, 
            e.dificultad, 
            a.nombre AS asignatura_nombre
        FROM "RESULTADO" r
        JOIN "ENSAYO" e ON r.id_ensayo = e.id
        JOIN "ASIGNATURA" a ON e.id_asignatura = a.id
        ORDER BY r.id DESC
    `);
    return result.rows;
}

/**
 * Actualiza la información principal de un ensayo (asignatura y dificultad).
 * @param {number} ensayoId - ID del ensayo.
 * @param {string} idAsignatura 
 * @param {string} dificultad
 * @param {object} client - Cliente de la transacción.
 */
async function updateEnsayo(ensayoId, idAsignatura, dificultad, client) {
    await client.query(
        `UPDATE "ENSAYO"
         SET id_asignatura = $1, dificultad = $2
         WHERE id = $3`,
        [idAsignatura, dificultad, ensayoId]
    );
}

/**
 * Elimina todas las preguntas asociadas a un ensayo (limpieza de la relación).
 * @param {number} ensayoId - ID del ensayo.
 * @param {object} client - Cliente de la transacción.
 */
async function deleteEnsayoPreguntas(ensayoId, client) {
    await client.query(
        `DELETE FROM "ENSAYO_PREGUNTA" WHERE id_ensayo = $1`,
        [ensayoId]
    );
}

/**
 * Inserta las nuevas preguntas asociadas a un ensayo.
 * @param {number} ensayoId - ID del ensayo.
 * @param {Array<number>} preguntas - Array de IDs de preguntas.
 * @param {object} client - Cliente de la transacción.
 */
async function insertEnsayoPreguntas(ensayoId, preguntas, client) {
    // Mapeamos el array de IDs a un array de promesas de inserción
    const inserts = preguntas.map(id_pregunta =>
        client.query(
            `INSERT INTO "ENSAYO_PREGUNTA" (id_ensayo, id_pregunta)
             VALUES ($1, $2)`,
            [ensayoId, id_pregunta]
        )
    );
    // Ejecutamos todas las inserciones concurrentemente
    await Promise.all(inserts);
}

/**
 * Busca un ensayo por su ID.
 * @param {number} id - ID del ensayo.
 * @returns {object | null} El objeto ensayo o null si no se encuentra.
 */
async function findEnsayoById(id) {
    const result = await db.query(
        'SELECT * FROM "ENSAYO" WHERE id = $1',
        [id]
    );
    return result.rows[0]; 
}

/**
 * Elimina las entradas de la tabla de relación ENSAYO_PREGUNTA para un conjunto de ensayos.
 * @param {Array<number>} ensayoIds - IDs de los ensayos a limpiar.
 * @param {object} client - Cliente de la transacción.
 */
async function deleteEnsayoPreguntasByIds(ensayoIds, client) {
    // Usamos $1::int[] para manejar el array de enteros en la cláusula ANY
    await client.query(
        `DELETE FROM "ENSAYO_PREGUNTA"
         WHERE id_ensayo = ANY($1::int[])`,
        [ensayoIds]
    );
}

/**
 * Elimina los ensayos principales, verificando que el id_profesor coincida con el autor.
 * @param {Array<number>} ensayoIds - IDs de los ensayos a eliminar.
 * @param {number} idProfesor - ID del profesor que intenta eliminar (autorización).
 * @param {object} client - Cliente de la transacción.
 * @returns {Array<object>} IDs de los ensayos eliminados.
 */
async function deleteEnsayos(ensayoIds, idProfesor, client) {
    const result = await client.query(
        `DELETE FROM "ENSAYO"
         WHERE id = ANY($1::int[]) AND id_profesor = $2
         RETURNING id`,
        [ensayoIds, idProfesor]
    );
    return result.rows; // Devuelve los objetos { id: X } de los ensayos eliminados
}



module.exports = {
    findEnsayosWithFilters,
    createEnsayo,
    addPreguntasToEnsayo,
    findPreguntasByEnsayoId,
    findRespuestasCorrectas,
    saveResultado,
    findAllEnsayoResults,
    updateEnsayo,
    deleteEnsayoPreguntas,
    insertEnsayoPreguntas,
    findEnsayoById,
    deleteEnsayoPreguntasByIds,
    deleteEnsayos,
};