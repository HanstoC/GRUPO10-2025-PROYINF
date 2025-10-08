
const alumnosData = require('../../api_sim/alumnos.json'); 
const EnsayoService = require('./ensayos.service'); 
const DocenteService = require('./docentes.service');

function getAllAlumnos() {
    
    const allAlumnos = [];
    alumnosData.forEach(curso => {
        curso.alumnos.forEach(alumno => {
            allAlumnos.push({
                rut: alumno.rut,
                nombre: alumno.nombre,
            });
        });
    });
    return allAlumnos;
}

function getAlumnosList() {
    return alumnosData; 
}

function getAlumnosAndFacets() {
    // 💡 Lógica Simulada de Ejemplo:
    const alumnos = alumnosData; 
    const totalAlumnos = alumnos.length;
    const cursos = [...new Set(alumnos.map(a => a.curso))];

    return {
        alumnos: alumnos,
        facets: {
            total: totalAlumnos,
            cursos_disponibles: cursos
        }
    };
}


async function getCombinedDataAndFacets() {
    // 1. Obtener datos de diferentes fuentes de forma concurrente (si es posible)
    const [alumnosData, ensayosData, docentesData] = await Promise.all([
        this.getAlumnosAndFacets(), // Asumo que esta función ya está en este servicio
        EnsayoService.getEnsayoResultsAndFacets(), // Asumo que esta función existe
        DocenteService.getDocentesList() // Asumo que esta función existe
    ]);

    // 2. Lógica de Consolidación y Facetas Globales
    const totalEntidades = alumnosData.alumnos.length + ensayosData.resultados.length + docentesData.length;
    
    // 3. Devolver la data organizada
    return {
        alumnos: alumnosData.alumnos,
        ensayos: ensayosData.resultados,
        docentes: docentesData,
        global_facets: {
            total_entidades_registradas: totalEntidades,
            // ... otras facetas combinadas
        },
        // También puedes incluir las facetas de cada servicio por separado:
        facets_alumnos: alumnosData.facets,
        facets_ensayos: ensayosData.facets,
    };
}


module.exports = {
    getAllAlumnos,
    getAlumnosList,
    getAlumnosAndFacets,
    getCombinedDataAndFacets,
};