
const directivosData = require('../../api_sim/directivos.json'); // Asumo esta ruta

/**
 * Función que obtiene el listado completo de docentes.
 */
function getDirectivosList() {
    // Retorna la data sin procesar
    return directivosData; 
}

const findDirectivoByRut = (rut) => {
    const directivos= getDirectivosList();
    const directivo = directivos.find(d => d.rut === rut);
    if (!directivo) return null;
    
    return {
        ...directivo,
        nombre: directivo.nombres
    };
}

module.exports = {
    getDirectivosList,
    findDirectivoByRut,
};