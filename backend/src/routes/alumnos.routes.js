
const router = require('express').Router();
const necesitaAuth = require('../middlewares/necesitaAuth'); 
const alumnosController = require('../controllers/alumnos.controller');

router.get('/AllAlumnos', alumnosController.obtenerTodos); 
router.get('/', necesitaAuth, alumnosController.obtenerLista);
router.get('/data-and-facets', alumnosController.obtenerAlumnosYFacetas);  
router.get('/data/combined', alumnosController.obtenerDatosCombinados); 

module.exports = router;