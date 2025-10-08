
const router = require('express').Router();
const mainController = require('../controllers/main.controller');

// GET / (la ruta raíz)
// Nota: No lleva `necesitaAuth` porque es un health check público.
router.get('/', mainController.healthCheck); 

module.exports = router;