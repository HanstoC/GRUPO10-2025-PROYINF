
const router = require('express').Router();
const necesitaAuth = require('../middlewares/necesitaAuth'); 
const resultadosController = require('../controllers/resultados.controller');

// GET / (que se mapeará a /resultados)
router.get('/', necesitaAuth, resultadosController.obtenerResultados); 

module.exports = router;