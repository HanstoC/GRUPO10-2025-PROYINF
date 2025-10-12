const express = require('express');
const router = express.Router();
const analisisController = require('../controllers/analisis.controller'); 

/**
 * =========================================================================
 * RUTAS DE ANALÍTICAS
 * Base URL: /api/analytics
 * =========================================================================
 */

// 1. Obtener lista simple de todos los ensayos disponibles (para el selector)
// GET /api/analytics/essays
router.get('/essays', analisisController.getEssays);

// 2. Resumen Global del Ensayo (Promedios por alumno y % de acierto general)
// GET /api/analytics/essays/:essayId/summary
router.get('/essays/:essayId/summary', analisisController.getEssaySummary);

// 3. Detalle por Pregunta (Datos para el Gráfico de Tendencia y la Tabla)
// GET /api/analytics/essays/:essayId/detail
router.get('/essays/:essayId/detail', analisisController.getEssayDetail);


module.exports = router;