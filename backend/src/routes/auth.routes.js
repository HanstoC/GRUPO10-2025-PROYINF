
const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const necesitaAuth = require('../middlewares/necesitaAuth'); // Debe importarse aquí


// POST / (que se mapeará a /login)
// NOTA: Las rutas de login/logout NUNCA llevan necesitaAuth
router.post('/', authController.login); 
router.get('/check-session', necesitaAuth, authController.checkSession);
router.get('/logout', authController.logout);

module.exports = router;