const analisisService = require('../services/analisis.service'); 

const analisisController = {};

/**
 * -------------------------------------------------------------------------
 * ENDPOINT 1: Obtener lista de Ensayos disponibles
 * GET /api/analytics/essays
 * -------------------------------------------------------------------------
 * Permite al frontend listar los ensayos para la selección inicial.
 * Llama al servicio que realiza el SELECT simple.
 */
analisisController.getEssays = async (req, res) => {
    try {
        // La lógica de consulta SQL ahora está en analytics.service.js
        const rows = await analisisService.obtenerListaEnsayos();

        return res.status(200).json({
            message: "Lista de ensayos recuperada exitosamente.",
            data: rows
        });

    } catch (error) {
        console.error("Error al obtener ensayos:", error);
        return res.status(500).json({ error: "Error interno del servidor al consultar ensayos." });
    }
};


/**
 * -------------------------------------------------------------------------
 * ENDPOINT 2: Resumen Global y Porcentajes
 * GET /api/analytics/essays/:essayId/summary
 * * Requerimientos cubiertos: 
 * 2) Promedio de aciertos, errores, omisiones por alumno.
 * 3) % de acierto respecto al total de preguntas.
 * -------------------------------------------------------------------------
 * Llama al servicio que realiza la agregación de la tabla RESULTADO.
 */
analisisController.getEssaySummary = async (req, res) => {
    const { essayId } = req.params;

    if (!essayId || isNaN(parseInt(essayId))) {
        return res.status(400).json({ error: "ID de ensayo inválido." });
    }

    try {
        // Lógica de agregación y cálculo delegada al servicio
        const summaryData = await analisisService.getEssaySummary(essayId);

        return res.status(200).json({
            message: `Resumen analítico para el ensayo ${essayId}.`,
            data: summaryData,
            metadata: "Los promedios son por alumno. El % es global (aciertos totales / preguntas totales * alumnos)."
        });

    } catch (error) {
        // Manejamos errores específicos del servicio (ej. 404)
        if (error.message.includes("Ensayo no encontrado") || error.message.includes("No hay resultados")) {
            return res.status(404).json({ error: error.message });
        }
        
        console.error(`Error al obtener resumen del ensayo ${essayId}:`, error);
        return res.status(500).json({ error: "Error interno del servidor al obtener el resumen." });
    }
};


/**
 * -------------------------------------------------------------------------
 * ENDPOINT 3: Detalle por Pregunta (para Gráfico y Tabla)
 * GET /api/analytics/essays/:essayId/detail
 * * Requerimientos cubiertos: 
 * 4) Conteo de acierto, error, omisión por pregunta.
 * 5) Datos de promedio por pregunta para el gráfico de 3 líneas.
 * -------------------------------------------------------------------------
 * Llama al servicio que realiza la agregación de la tabla RESPUESTA y el post-procesamiento.
 */
analisisController.getEssayDetail = async (req, res) => {
    const { essayId } = req.params;
    
    if (!essayId || isNaN(parseInt(essayId))) {
        return res.status(400).json({ error: "ID de ensayo inválido." });
    }

    try {
        // Lógica de agregación y post-procesamiento delegada al servicio
        const detailData = await analisisService.getEssayDetail(essayId);

        return res.status(200).json({
            message: `Detalle por pregunta para el ensayo ${essayId}.`,
            data: detailData,
            metadata: "Contiene conteos totales por pregunta y promedios por alumno para el gráfico de tendencia."
        });

    } catch (error) {
        // Manejamos errores específicos del servicio (ej. 404)
        if (error.message.includes("No hay alumnos")) {
            return res.status(404).json({ error: error.message });
        }
        
        console.error(`Error al obtener detalle del ensayo ${essayId}:`, error);
        return res.status(500).json({ error: "Error interno del servidor al obtener el detalle." });
    }
};

module.exports = analisisController;