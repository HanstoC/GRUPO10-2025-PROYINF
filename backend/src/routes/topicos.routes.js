
const router = require('express').Router();
const necesitaAuth = require('../middlewares/necesitaAuth'); 
const topicosController = require('../controllers/topicos.controller');

// GET /:idAsignatura (que se mapeará a /topicos/:idAsignatura)
router.get('/:idAsignatura', necesitaAuth, topicosController.obtenerPorAsignatura); 

module.exports = router;