const db = require('../config/db');


/**
 * Obtiene una lista simple de todos los ensayos disponibles.
 */
async function obtenerListaEnsayos() {
    const sql = `
        SELECT
            id,
            id_asignatura,
            dificultad,
            fecha_creacion
        FROM "ENSAYO"
        ORDER BY fecha_creacion DESC;
    `;
    
    // Llamada real a la DB
    const { rows } = await db.query(sql); 
    return rows;
}


/**
 * Calcula estadísticas agregadas globales (promedios por alumno y % de acierto general).
 * Cubre Requerimientos 2 y 3.
 * @param {number} ensayoId - ID del ensayo a analizar.
 * @returns {object} Datos del resumen.
 */
async function getEssaySummary(ensayoId) {
    // 1. Obtener el número total de preguntas del ensayo (N)
    const totalQuestionsSql = `
        SELECT 
            COUNT(*) AS total_questions 
        FROM "ENSAYO_PREGUNTA" 
        WHERE id_ensayo = $1;
    `;
    const totalQuestionsResult = await db.query(totalQuestionsSql, [ensayoId]);
    const totalQuestions = parseInt(totalQuestionsResult.rows[0]?.total_questions || 0, 10);
    
    if (totalQuestions === 0) {
        throw new Error("Ensayo no encontrado o sin preguntas asignadas.");
    }

    // 2. Agregación principal: Utilizamos la tabla RESULTADO, que ya contiene los totales pre-calculados.
    const aggregationSql = `
        SELECT
            AVG(cantidad_correctas) AS avg_correctas,
            AVG(cantidad_erroneas) AS avg_erroneas,
            AVG(cantidad_omitidas) AS avg_omitidas,
            SUM(cantidad_correctas) AS total_aciertos_global,
            COUNT(id_alumno) AS total_alumnos_rindieron
        FROM "RESULTADO"
        WHERE id_ensayo = $1;
    `;

    const { rows } = await db.query(aggregationSql, [ensayoId]);
    const data = rows[0];

    // Verificar si hay resultados
    if (!data || data.total_alumnos_rindieron === '0' || data.total_alumnos_rindieron === null) {
        throw new Error("No hay resultados para este ensayo.");
    }

    // 3. Cálculo del % de acierto general
    const totalAlumnos = parseInt(data.total_alumnos_rindieron, 10);
    const totalAciertosGlobal = parseFloat(data.total_aciertos_global);
    const maxPossibleAnswers = totalQuestions * totalAlumnos;

    let overallAccuracyPercentage = 0;
    if (maxPossibleAnswers > 0) {
        overallAccuracyPercentage = (totalAciertosGlobal / maxPossibleAnswers) * 100;
    }

    // 4. Formatear y retornar la respuesta
    return {
        total_alumnos: totalAlumnos,
        total_preguntas_ensayo: totalQuestions,
        promedios_por_alumno: {
            aciertos: parseFloat(data.avg_correctas).toFixed(2),
            errores: parseFloat(data.avg_erroneas).toFixed(2),
            omisiones: parseFloat(data.avg_omitidas).toFixed(2),
        },
        porcentaje_acierto_general: overallAccuracyPercentage.toFixed(2),
    };
}


/**
 * Calcula estadísticas detalladas por pregunta (conteo y promedios) para gráfico y tabla.
 * Cubre Requerimientos 4 y 5 + Temática/Tópico.
 * @param {number} ensayoId - ID del ensayo a analizar.
 * @returns {object} Datos detallados por pregunta.
 */
async function getEssayDetail(ensayoId) {
    // 1. Obtener el número de alumnos que rindieron el ensayo (para calcular promedios)
    const studentsSql = `
        SELECT 
            COUNT(DISTINCT id_alumno) AS total_alumnos 
        FROM "RESULTADO" 
        WHERE id_ensayo = $1;
    `;
    const studentsResult = await db.query(studentsSql, [ensayoId]);
    const totalAlumnos = parseInt(studentsResult.rows[0]?.total_alumnos || 0, 10);

    if (totalAlumnos === 0) {
        throw new Error("No hay alumnos que hayan rendido este ensayo para el detalle.");
    }

    // 2. Agregación por Pregunta: Contar los estados de respuesta E INCLUIR TEMÁTICA
    const detailSql = `
        SELECT
            T1.id_pregunta,
            T1.id AS ensayo_pregunta_id,
            T3.nombre AS nombre_tematica,
            
            -- Usamos LEFT JOIN, si no hay respuesta, el estado es NULL y el COUNT da 0
            COUNT(CASE WHEN T4.estado = 'correcta' THEN 1 END) AS count_acierto,
            COUNT(CASE WHEN T4.estado = 'erronea' THEN 1 END) AS count_error,
            COUNT(CASE WHEN T4.estado = 'omitida' THEN 1 END) AS count_omision
        FROM
            "ENSAYO_PREGUNTA" T1 -- TBL PRINCIPAL: Todas las preguntas del ensayo
        JOIN
            "PREGUNTA" T2 ON T1.id_pregunta = T2.id
        JOIN
            "TEMATICA" T3 ON T2.id_tematica = T3.id
        LEFT JOIN
            "RESPUESTA" T4 ON T1.id_ensayo = T4.id_ensayo AND T1.id_pregunta = T4.id_pregunta
        WHERE
            T1.id_ensayo = $1
        GROUP BY
            T1.id_pregunta, T1.id, T3.nombre
        ORDER BY 
            T1.id;
    `;

    const { rows: detailRows } = await db.query(detailSql, [ensayoId]);

    // 3. Post-Procesamiento en Node.js: Calcular promedios (eje Y del gráfico)
    const graphData = detailRows.map((row, index) => {
        const questionNumber = index + 1; // Número secuencial de la pregunta en el ensayo

        const countAcierto = parseInt(row.count_acierto, 10);
        const countError = parseInt(row.count_error, 10);
        const countOmision = parseInt(row.count_omision, 10);
        
        // Promedio por alumno (para el eje Y del gráfico de tendencia)
        const avgAcierto = (countAcierto / totalAlumnos);
        const avgError = (countError / totalAlumnos);
        const avgOmision = (countOmision / totalAlumnos);

        return {
            question_number: questionNumber, 
            nombre_tematica: row.nombre_tematica, // AÑADIDO: Temática
            
            // Requerimiento 4: Conteo total para la tabla
            aciertos_total: countAcierto,
            errores_total: countError,
            omisiones_total: countOmision,
            
            // Requerimiento 5: Promedio por alumno para el gráfico (Eje Y)
            acierto_promedio: parseFloat(avgAcierto.toFixed(4)), 
            error_promedio: parseFloat(avgError.toFixed(4)),     
            omision_promedio: parseFloat(avgOmision.toFixed(4)), 
        };
    });

    return {
        total_alumnos: totalAlumnos,
        graph_data: graphData,
    };
}

module.exports = {
    obtenerListaEnsayos,
    getEssaySummary,
    getEssayDetail,
};