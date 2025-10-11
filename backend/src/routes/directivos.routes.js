const router = require('express').Router();
const necesitaAuth = require('../middlewares/necesitaAuth'); 
const directivosController = require('../controllers/directivos.controller');

router.get('/', necesitaAuth, directivosController.obtenerLista); 

module.exports = router;