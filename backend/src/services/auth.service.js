
const AuthRepository = require('../repositories/AuthRepository');
// NOTA: Asumo que los servicios de alumnos, docentes, etc., ya están importables
const alumnosService = require('./alumnos.service');
const docentesService = require('./docentes.service'); // Asumo la existencia de este servicio

/**
 * Intenta iniciar sesión, obtiene los datos del perfil y compone el objeto de usuario.
 * @param {string} rut
 * @param {string} contraseña
 * @returns {object | null} El objeto de usuario completo (usuario + info de perfil) o null.
 */
async function login(rut, contraseña) {
    // 1. Verificar credenciales en la DB
    const user = await AuthRepository.findUserByCredentials(rut, contraseña);

    if (!user) {
        return null; // Fallo de autenticación
    }

    let info;
    
    // 2. LÓGICA CONDICIONAL: Obtener información de perfil específica
    if (user.tipo === 'alumno') {
        info = await alumnosService.findAlumnoByRut(user.rut);
    } else if (user.tipo === 'profesor') {
        // Asumo que findDocenteByRut está implementado
        info = await docentesService.findDocenteByRut(user.rut); 
    } else {
        // Asumo que findDirectivoByRut está implementado
        info = await docentesService.findDirectivoByRut(user.rut); 
    }

    // 3. Componer el objeto de usuario final (spread operator para mezclar)
    return { ...user, ...info };
}

module.exports = {
    login,
};
