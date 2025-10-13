
const ResultadoRepository = require('../repositories/ResultadoRepository');

/**
 * Determina qué resultados consultar basándose en el rol del usuario.
 * @param {string} tipoUsuario - El rol del usuario (alumno, profesor, etc.).
 * @param {number} userId - ID del usuario autenticado (req.session.user.id).
 * @param {string} alumnoQueryId - El ID de alumno pasado en req.query.
 * @returns {Array} Los resultados encontrados.
 * @throws {Error} Si el acceso es denegado o falta un parámetro.
 */
async function obtenerResultados(tipoUsuario, userId, alumnoQueryId) {
    let idAlumno;

    // 1. Lógica de Negocio: Determinación del ID del alumno a consultar
    if (tipoUsuario === 'alumno') {
        idAlumno = userId;
    } else if (tipoUsuario === 'profesor') {
        idAlumno = alumnoQueryId;
        // La validación de que el parámetro exista se traslada al Controlador
        // o se hace aquí lanzando un error que el Controlador debe atrapar.
        if (!idAlumno) {
            // Este error será atrapado por el controlador y retornado como 400
            throw new Error('Falta el parámetro alumno (query) para el profesor.');
        }
    } else {
        // Este error será atrapado por el controlador y retornado como 403
        throw new Error('Acceso denegado: Tipo de usuario no válido.');
    }

    // 2. Llamada al Repositorio
    // Aseguramos que idAlumno sea un número antes de pasarlo a la DB
    return ResultadoRepository.findResultadosByAlumnoId(Number(idAlumno));
}

module.exports = {
    obtenerResultados,
};