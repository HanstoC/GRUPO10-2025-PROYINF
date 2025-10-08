
const router = require('express').Router();
const necesitaAuth = require('../middlewares/necesitaAuth'); 
const respuestasController = require('../controllers/respuestas.controller');

// POST / (que se mapeará a /respuestas)
router.post('/', necesitaAuth, respuestasController.crearRespuesta); 

module.exports = router;