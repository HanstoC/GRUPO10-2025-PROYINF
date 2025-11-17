const cursos = require('../api_sim/alumnos.json');
const docentes = require('../api_sim/docentes.json');
const directivos = require('../api_sim/directivos.json');
const fs = require('node:fs');
const { Pool } = require('pg');


const pool = new Pool({
  user: process.env.DB_USER || 'user',
  host: process.env.DB_HOST || 'postgres_db',
  database: process.env.DB_NAME || 'mydb',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});


const findAlumnoByRut = (rut) => {
    const curso = cursos.find(curso => 
        curso.alumnos.some(alumno => alumno.rut === rut)
    );

    if (!curso) return null;

    const alumno = curso.alumnos.find(alumno => alumno.rut === rut);
    
    return {
        ...alumno,
        nombre: `${alumno.nombre} ${alumno.paterno} ${alumno.materno}`.trim(),
        codigo_curso: curso.codigo_curso,
        nivel: curso.nivel,
        letra: curso.letra,
        tipo_ensenanza: curso.tipo_ensenanza
    };
}

const findDocenteByRut = (rut) => {
    const docente = docentes.find(docente => docente.rut === rut);
    if (!docente) return null;
    
    return {
        ...docente,
        nombre: docente.nombres
    };
}

const findDirectivoByRut = (rut) => {
    const directivo = directivos.find(directivo => directivo.rut === rut);
    if (!directivo) return null;
    
    return {
        ...directivo,
        nombre: directivo.nombres
    };
}

const getAllAlumnos = () => {
    let allAlumnos = [];
    cursos.forEach(curso => { 
        curso.alumnos.forEach(alumno => { 
            allAlumnos.push({
                
                id: alumno.rut,
                rut: alumno.rut,
                
                nombre: `${alumno.nombre} ${alumno.paterno} ${alumno.materno}`.trim(),
                email: alumno.email || 'No disponible',                
                curso_codigo: curso.codigo_curso,
                curso_nivel: curso.nivel,
                curso_letra: curso.letra,
                curso_tipo_ensenanza: curso.tipo_ensenanza,
            });
        });
    });
    return allAlumnos;
};


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
                const numA = Number.parseFloat(String(a.value).split('-')[0]); // Toma la primera parte del rango
                const numB = Number.parseFloat(String(b.value).split('-')[0]);
                if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
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
    try {
        // 1. Obtener datos de Alumnos y sus facetas
        const { alumnos } = getAlumnosAndFacets(); // Solo necesitamos los alumnos aquí por ahora

        // 2. Obtener datos de Ensayos y sus facetas
        const { ensayoResults } = await getEnsayoResultsAndFacetsFromDB(); // Solo necesitamos los resultados de ensayo

        // Crear un mapa para un acceso rápido a los resultados de ensayos por RUT/ID de alumno
        // Asumo que 'rut' es el campo común para unir. Si es un ID, ajusta.
        // Asegúrate de que el campo de usuario en ensayoResults sea el RUT para la unión.
        const ensayoMap = new Map();
        ensayoResults.forEach(ensayo => {
            if (ensayo.alumno_rut) { // Usamos alumno_rut del ensayo para el join
                if (!ensayoMap.has(ensayo.alumno_rut)) {
                    ensayoMap.set(ensayo.alumno_rut, []);
                }
                ensayoMap.get(ensayo.alumno_rut).push(ensayo);
            }
        });

        // Realizar el "join" lógico
        const combinedData = alumnos.map(alumno => {
            const ensayosDelAlumno = ensayoMap.get(alumno.rut) || []; // Obtener todos los ensayos para este alumno
            return {
                ...alumno, // Todos los datos del alumno
                ensayos: ensayosDelAlumno // Añadir un array con los resultados de sus ensayos
            };
        });

        // --- 3. Calcular Facetas Unificadas ---
        // Aquí debes pensar en qué facetas quieres que sean "globales" para la búsqueda.
        // Por ejemplo, podrías querer filtrar por colegio, género, asignatura del ensayo, etc.

        const unifiedFacets = {
            colegio: {},
            genero: {},
            asignatura_ensayo: {},
            // Añade más facetas unificadas que hagan sentido
            // Por ejemplo, un promedio de puntajes de ensayo, o dificultad
        };

        combinedData.forEach(item => {
            // Facetas de Alumnos (ejemplo)
            if (item.colegio) {
                unifiedFacets.colegio[item.colegio] = (unifiedFacets.colegio[item.colegio] || 0) + 1;
            }
            if (item.genero) {
                unifiedFacets.genero[item.genero] = (unifiedFacets.genero[item.genero] || 0) + 1;
            }

            // Facetas de Ensayos (ejemplo)
            item.ensayos.forEach(ensayo => {
                if (ensayo.asignatura_ensayo) {
                    unifiedFacets.asignatura_ensayo[ensayo.asignatura_ensayo] = (unifiedFacets.asignatura_ensayo[ensayo.asignatura_ensayo] || 0) + 1;
                }
                // Aquí podrías agregar lógica para rangos de puntaje combinados si quisieras
            });
        });

        // Formatear las facetas a un array de { value, count }
        const formattedUnifiedFacets = {};
        for (const key in unifiedFacets) {
            formattedUnifiedFacets[key] = Object.keys(unifiedFacets[key]).map(value => ({
                value: value,
                count: unifiedFacets[key][value]
            })).sort((a, b) => {
                if (typeof a.value === 'number') return a.value - b.value;
                return String(a.value).localeCompare(String(b.value));
            });
        }


        return {
            combinedData: combinedData,
            unifiedFacets: formattedUnifiedFacets
        };

    } catch (error) {
        console.error('Error al combinar datos de alumnos y ensayos:', error);
        throw new Error('No se pudieron combinar los datos de alumnos y ensayos.');
    }
}


module.exports = {
    findAlumnoByRut,
    findDocenteByRut,
    findDirectivoByRut,
    getAllAlumnos,
    getAlumnosAndFacets,
    getEnsayoResultsAndFacetsFromDB,
    getCombinedDataAndFacets

}