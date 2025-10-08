
const authService = require('../services/auth.service');

async function login(req, res) {
    const { rut, contraseña } = req.body;

    // Validación básica
    if (!rut || !contraseña) {
        return res.status(400).json({ error: 'Faltan RUT o contraseña' });
    }

    try {
        // 1. Llamar al servicio para obtener el usuario completo
        const userWithInfo = await authService.login(rut, contraseña);

        if (userWithInfo) {
            // 2. Éxito: Crear la sesión (SOLO la data mínima requerida para middleware)
            req.session.user = {
                id: userWithInfo.id,
                rut: userWithInfo.rut,
                tipo: userWithInfo.tipo
            };
            
            // 3. Responder con el objeto de usuario completo
            res.status(200).json({ message: 'Inicio de sesión exitoso', user: userWithInfo });
        } else {
            // 4. Fallo: Credenciales inválidas
            res.status(401).json({ error: 'Credenciales inválidas' });
        }

    } catch (err) {
        // 5. Manejo de errores
        console.error('Error durante el inicio de sesión:', err);
        // El mensaje de error debe ser genérico por seguridad
        res.status(500).send('Error interno del servidor'); 
    }
}

function checkSession(req, res) {
    // Si la función llega aquí, significa que 'necesitaAuth' ya validó 
    // la existencia de req.session.user y pasó el control.
    res.status(200).json({
        authenticated: true,
        user: req.session.user
    });
}

function logout(req, res) {
    // 1. Destruir la sesión
    req.session.destroy(err => {
        if (err) {
            // 2. Manejo de error de destrucción de sesión
            console.error('Error al destruir la sesión:', err);
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        
        // 3. Limpiar la cookie (el nombre de la cookie por defecto es 'connect.sid')
        res.clearCookie('connect.sid');
        
        // 4. Respuesta exitosa
        res.status(200).json({ message: 'Sesión cerrada correctamente' });
    });
}


module.exports = {
    login,
    checkSession,
    logout,
};