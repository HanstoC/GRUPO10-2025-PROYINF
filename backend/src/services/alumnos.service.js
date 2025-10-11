
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
    try {
        // ¡Aquí el cambio! 'cursos' ya es el objeto JavaScript
        const alumnosDataByCourse = cursos; 
        
        // Aplanar la estructura: de array de cursos a array plano de alumnos
        let allAlumnos = [];
        alumnosDataByCourse.forEach(curso => {
            allAlumnos = allAlumnos.concat(curso.alumnos);
        });

        // --- Lógica para generar facetas ---
        const facets = {
            agno: {},
            curso: {},
            genero: {},
            colegio: {},
            nota_final: {
                '1.0 - 3.9': 0,
                '4.0 - 4.9': 0,
                '5.0 - 5.9': 0,
                '6.0 - 7.0': 0
            }
        };

        allAlumnos.forEach(alumno => {
            // Faceta 'agno'
            if (alumno.agno) {
                facets.agno[alumno.agno] = (facets.agno[alumno.agno] || 0) + 1;
            }
            // Faceta 'curso'
            if (alumno.curso) {
                facets.curso[alumno.curso] = (facets.curso[alumno.curso] || 0) + 1;
            }
            // Faceta 'genero'
            if (alumno.genero) {
                facets.genero[alumno.genero] = (facets.genero[alumno.genero] || 0) + 1;
            }
            // Faceta 'colegio'
            if (alumno.colegio) {
                facets.colegio[alumno.colegio] = (facets.colegio[alumno.colegio] || 0) + 1;
            }
            // Faceta 'nota_final' (rangos)
            if (alumno.nota_final !== undefined && alumno.nota_final !== null) {
                if (alumno.nota_final >= 1.0 && alumno.nota_final <= 3.9) {
                    facets.nota_final['1.0 - 3.9']++;
                } else if (alumno.nota_final >= 4.0 && alumno.nota_final <= 4.9) {
                    facets.nota_final['4.0 - 4.9']++;
                } else if (alumno.nota_final >= 5.0 && alumno.nota_final <= 5.9) {
                    facets.nota_final['5.0 - 5.9']++;
                } else if (alumno.nota_final >= 6.0 && alumno.nota_final <= 7.0) {
                    facets.nota_final['6.0 - 7.0']++;
                }
            }
        });

        // Convertir los objetos de conteo a arrays de { value, count }
        const formattedFacets = {};
        for (const key in facets) {
            if (key === 'nota_final') {
                formattedFacets[key] = Object.keys(facets[key]).map(range => ({
                    value: range,
                    count: facets[key][range]
                }));
            } else {
                formattedFacets[key] = Object.keys(facets[key]).map(value => ({
                    value: value,
                    count: facets[key][value]
                }));
            }
            // Opcional: ordenar las facetas por valor o por conteo
            formattedFacets[key].sort((a, b) => {
                if (typeof a.value === 'number') return a.value - b.value;
                return String(a.value).localeCompare(String(b.value));
            });
        }

        return {
            alumnos: allAlumnos,
            facets: formattedFacets
        };

    } catch (error) {
        console.error('Error al procesar datos de alumnos y facetas en servicio:', error);
        throw new Error('No se pudieron cargar o procesar los datos de alumnos y facetas.');
    }
}

async function getEnsayoResultsAndFacetsFromDB() {
    let client; // Declara client fuera del try para que sea accesible en finally
    try {
        client = await pool.connect(); // Obtén una conexión del pool

        // --- 1. Consulta SQL para obtener los resultados de los ensayos ---
        // Aquí puedes ajustar la consulta para traer los campos que te interesan.
        // Por ejemplo, podríamos querer el puntaje, cantidad de correctas, el tipo de ensayo (asignatura), etc.
        const query = `
            SELECT
                r.id AS resultado_id,
                r.puntaje_obtenido,
                r.cantidad_correctas,
                r.cantidad_omitidas,
                r.cantidad_erroneas,
                u.id AS alumno_id,
                u.rut AS alumno_rut,
                u.correo AS alumno_correo,
                e.id AS ensayo_id,
                a.nombre AS asignatura_ensayo,
                e.dificultad AS dificultad_ensayo
            FROM "RESULTADO" r
            JOIN "usuario" u ON r.id_alumno = u.id
            JOIN "ENSAYO" e ON r.id_ensayo = e.id
            JOIN "ASIGNATURA" a ON e.id_asignatura = a.id;
        `;
        const res = await client.query(query);
        const allEnsayoResults = res.rows; // `res.rows` contiene los resultados de la consulta como un array de objetos

        console.log(`Resultados de ensayos obtenidos de la DB. Total: ${allEnsayoResults.length}`);

        // --- 2. Lógica para generar facetas a partir de allEnsayoResults ---
        const facets = {
            puntaje_obtenido_rango: {
                '0-25': 0,
                '26-50': 0,
                '51-75': 0,
                '76-100': 0
            },
            asignatura_ensayo: {},
            dificultad_ensayo: {},
            // Puedes añadir más facetas aquí, por ejemplo:
            // cantidad_correctas_rango: { '0-10': 0, ... }
        };

        allEnsayoResults.forEach(result => {
            // Faceta 'asignatura_ensayo'
            if (result.asignatura_ensayo) {
                facets.asignatura_ensayo[result.asignatura_ensayo] = (facets.asignatura_ensayo[result.asignatura_ensayo] || 0) + 1;
            }
            // Faceta 'dificultad_ensayo'
            if (result.dificultad_ensayo) {
                facets.dificultad_ensayo[result.dificultad_ensayo] = (facets.dificultad_ensayo[result.dificultad_ensayo] || 0) + 1;
            }
            // Faceta 'puntaje_obtenido_rango'
            if (result.puntaje_obtenido !== undefined && result.puntaje_obtenido !== null) {
                if (result.puntaje_obtenido >= 0 && result.puntaje_obtenido <= 25) {
                    facets.puntaje_obtenido_rango['0-25']++;
                } else if (result.puntaje_obtenido >= 26 && result.puntaje_obtenido <= 50) {
                    facets.puntaje_obtenido_rango['26-50']++;
                } else if (result.puntaje_obtenido >= 51 && result.puntaje_obtenido <= 75) {
                    facets.puntaje_obtenido_rango['51-75']++;
                } else if (result.puntaje_obtenido >= 76 && result.puntaje_obtenido <= 100) {
                    facets.puntaje_obtenido_rango['76-100']++;
                }
            }
        });

        // --- 3. Formatear las facetas a un array de objetos {value, count} y ordenar ---
        const formattedFacets = {};
        for (const key in facets) {
            formattedFacets[key] = Object.keys(facets[key]).map(value => ({
                value: value,
                count: facets[key][value]
            }));
            // Ordenar: para rangos numéricos como puntaje, ordenar por el valor numérico (parseando el rango)
            // Para strings como asignatura/dificultad, ordenar alfabéticamente
            formattedFacets[key].sort((a, b) => {
                // Intenta ordenar numéricamente si los valores parecen números
                const numA = parseFloat(String(a.value).split('-')[0]); // Toma la primera parte del rango
                const numB = parseFloat(String(b.value).split('-')[0]);
                if (!isNaN(numA) && !isNaN(numB)) {
                    return numA - numB;
                }
                // Si no son números o rangos numéricos, ordena alfabéticamente
                return String(a.value).localeCompare(String(b.value));
            });
        }
        
        return {
            ensayoResults: allEnsayoResults,
            facets: formattedFacets
        };

    } catch (error) {
        console.error('Error al obtener resultados de ensayos desde la DB o procesar facetas:', error);
        throw new Error('No se pudieron cargar o procesar los resultados de ensayos.');
    } finally {
        if (client) {
            client.release(); // Libera la conexión de vuelta al pool
        }
    }
}

async function getCombinedDataAndFacets() {
    // 1. Obtener datos de diferentes fuentes de forma concurrente (si es posible)
    const [alumnosData, ensayosData, docentesData] = await Promise.all([
        this.getAlumnosAndFacets(), // Asumo que esta función ya está en este servicio
        EnsayoService.getEnsayoResultsAndFacetsFromDB(), // Asumo que esta función existe
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

const findAlumnoByRut = (rut) => {
    const alumnos = getAlumnosList();
    const alumno = alumnos.find(d => d.rut === rut);
    if (!alumno) return null;
    
    return {
        ...alumno,
        nombre: alumno.nombres
    };
}


module.exports = {
    getAllAlumnos,
    getAlumnosList,
    getAlumnosAndFacets,
    getCombinedDataAndFacets,
    findAlumnoByRut,
    getEnsayoResultsAndFacetsFromDB
};