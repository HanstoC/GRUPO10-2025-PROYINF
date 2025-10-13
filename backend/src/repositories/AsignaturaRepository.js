
const db = require('../config/db'); 

async function findAll() {
    const result = await db.query('SELECT * FROM "ASIGNATURA" ORDER BY nombre');
    return result.rows;
}

async function findByName(nombre, connector = db) {
    const result = await connector.query(
        'SELECT * FROM "ASIGNATURA" WHERE LOWER(nombre) = LOWER($1)',
        [nombre]
    );
    return result.rows[0]; 
}

async function create(nombre, connector = db) {
    const result = await connector.query(
        'INSERT INTO "ASIGNATURA" (nombre) VALUES ($1) RETURNING *',
        [nombre]
    );
    return result.rows[0];
}

/**
 * Busca una asignatura por su nombre (búsqueda insensible a mayúsculas/minúsculas).
 * @param {string} nombre - Nombre de la asignatura.
 * @returns {object | null} La asignatura encontrada o null si no existe.
 */
async function findOneByName(nombre) {
    const result = await db.query(
        'SELECT * FROM "ASIGNATURA" WHERE LOWER(nombre) = LOWER($1)',
        [nombre]
    );
    // Retorna el primer resultado o undefined si no se encontró nada
    return result.rows[0]; 
}

module.exports = {
    findAll,
    findByName,
    create,
    findOneByName,
};

