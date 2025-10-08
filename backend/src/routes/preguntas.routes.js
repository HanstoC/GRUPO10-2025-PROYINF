
const router = require('express').Router();
const necesitaAuth = require('../middlewares/necesitaAuth'); 
const preguntasController = require('../controllers/preguntas.controller');

// POST / (que se mapeará a /preguntas)
router.post('/', necesitaAuth, preguntasController.crearPregunta); 
router.get('/', necesitaAuth, preguntasController.obtenerPreguntas); 
router.get('/:id', preguntasController.obtenerPreguntaPorId);
router.put('/:id', necesitaAuth, preguntasController.actualizarPregunta); 

module.exports = router;