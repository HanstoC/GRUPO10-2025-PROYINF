
const db = require('../config/db'); 

/**
 * Busca un usuario por RUT y contraseña.
 * @param {string} rut
 * @param {string} contraseña - NOTA: En producción, NUNCA debe ser texto plano.
 * @returns {object | null} Los datos del usuario o null.
 */
async function findUserByCredentials(rut, contraseña) {
    const result = await db.query(
        'SELECT id, rut, tipo FROM "usuario" WHERE rut = $1 AND contraseña = $2',
        [rut, contraseña]
    );
    // NOTA: No seleccionar la contraseña para el objeto retornado.
    return result.rows[0];
}

module.exports = {
    findUserByCredentials,
};

