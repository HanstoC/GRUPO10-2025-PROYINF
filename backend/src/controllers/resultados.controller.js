
const resultadosService = require('../services/resultados.service');

async function obtenerResultados(req, res) {
    // 1. Obtener datos de sesión y query
    const tipo = req.session.user?.tipo;
    const userId = req.session.user?.id;
    const alumnoQueryId = req.query.alumno;

    // Validación de autenticación (aunque `necesitaAuth` debería manejar el 401)
    if (!userId || !tipo) {
        return res.status(401).send('No autenticado o sesión expirada');
    }
    
    try {
        // 2. Llamar al servicio, delegando la lógica de autorización
        const resultados = await resultadosService.obtenerResultados(tipo, userId, alumnoQueryId);
        
        // 3. Responder
        res.json(resultados);

    } catch (err) {
        // 4. Manejo de errores específicos lanzados por el Servicio
        if (err.message.includes('Falta el parámetro alumno')) {
            return res.status(400).send('Falta el parámetro alumno');
        }
        if (err.message.includes('Acceso denegado')) {
            return res.status(403).send('Acceso denegado');
        }

        // Manejo de errores genéricos de DB
        console.error('Error al obtener resultados del alumno:', err);
        res.status(500).send('Error al obtener resultados del alumno');
    }
}

module.exports = {
    obtenerResultados,
};