
const router = require('express').Router();
const necesitaAuth = require('../middlewares/necesitaAuth'); 
const ensayosController = require('../controllers/ensayos.controllers');
// GET /ensayos (la nueva ruta)
router.get('/', necesitaAuth, ensayosController.obtenerEnsayos); 
router.post('/', necesitaAuth, ensayosController.crearEnsayo); 
router.get('/:id/preguntas', ensayosController.obtenerPreguntas);
router.post('/:id/responder', necesitaAuth, ensayosController.responderEnsayo); 
router.get('/data-and-facets', ensayosController.obtenerResultadosYFacetas); 
router.put('/:id', necesitaAuth, ensayosController.actualizarEnsayo); 
router.get('/:id', necesitaAuth, ensayosController.obtenerEnsayoPorId);
router.delete('/', necesitaAuth, ensayosController.eliminarEnsayos); 

module.exports = router;