
const router = require('express').Router();
const necesitaAuth = require('../middlewares/necesitaAuth');
const asignaturasController = require('../controllers/asignaturas.controller');

router.get('/', necesitaAuth, asignaturasController.obtenerTodas);
router.post('/', necesitaAuth, asignaturasController.crearAsignatura);
router.get('/nombre/:nombre', necesitaAuth, asignaturasController.obtenerPorNombre); 

module.exports = router;