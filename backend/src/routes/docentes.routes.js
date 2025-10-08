
const router = require('express').Router();
const necesitaAuth = require('../middlewares/necesitaAuth'); 
const docentesController = require('../controllers/docentes.controller');

router.get('/', necesitaAuth, docentesController.obtenerLista); 

module.exports = router;