
const docentesData = require('../../api_sim/docentes.json'); // Asumo esta ruta

/**
 * Función que obtiene el listado completo de docentes.
 */
function getDocentesList() {
    // Retorna la data sin procesar
    return docentesData; 
}

const findDocenteByRut = (rut) => {
    const docente = docentes.find(docente => docente.rut === rut);
    if (!docente) return null;
    
    return {
        ...docente,
        nombre: docente.nombres
    };
}

module.exports = {
    getDocentesList,
    findDocenteByRut,
};