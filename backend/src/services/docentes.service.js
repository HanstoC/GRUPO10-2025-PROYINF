
const docentesData = require('../../api_sim/docentes.json'); // Asumo esta ruta

/**
 * Función que obtiene el listado completo de docentes.
 */
function getDocentesList() {
    // Retorna la data sin procesar
    return docentesData; 
}

module.exports = {
    getDocentesList,
};