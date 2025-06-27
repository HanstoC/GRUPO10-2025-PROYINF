const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// --- Configuración de la Base de Datos ---
const dbConfig = {
    user: process.env.DB_USER || 'user',      //  <-- CAMBIA ESTO
    host: process.env.DB_HOST || 'postgres_db',
    database: process.env.DB_NAME || 'mydb',  //  <-- CAMBIA ESTO
    password: process.env.DB_PASSWORD || 'password', //  <-- CAMBIA ESTO
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
};

const pool = new Pool(dbConfig);

// --- Rutas a los archivos JSON ---
const preguntasFilePath = path.join(__dirname, 'preguntas.json'); // Asegúrate de que esta ruta es correcta
const alumnosFilePath = path.join(__dirname, 'api_sim', 'alumnos.json'); // Asegúrate de que esta ruta es correcta

// --- Asignaturas objetivo para crear ensayos ---
const asignaturasParaEnsayos = [
    'Matemáticas M1',
    'Matemáticas M2',
    'Competencia Comprensión Lectora',
    'Historia y Ciencias Sociales',
    'Ciencias Química',
    'Ciencias Biologia',
    'Ciencias Física'
];

// --- ID de profesor por defecto (asumimos que existe un profesor con ID 1) ---
const ID_PROFESOR_DEFAULT = 1;

async function runPopulationScript() {
    console.log('Iniciando script de población de base de datos...');
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Iniciar transacción

        console.log('Cargando datos desde archivos JSON...');
        const preguntasData = JSON.parse(fs.readFileSync(preguntasFilePath, 'utf8'));
        const alumnosData = JSON.parse(fs.readFileSync(alumnosFilePath, 'utf8'));

        const asignaturaMap = new Map(); // nombre_asignatura -> id_asignatura
        const tematicaMap = new Map();   // asignatura_id-nombre_tematica -> id_tematica
        const preguntaMap = new Map();   // id_pregunta -> { original_correcta_char, alternativas: [{id, texto, es_correcta}] }
        const asignaturaPreguntasMap = new Map(); // id_asignatura -> [id_pregunta]
        
        const allAlumnosIds = [];
        alumnosData.forEach(curso => {
            curso.alumnos.forEach(alumno => {
                allAlumnosIds.push(alumno.id);
            });
        });
        console.log(`Total de alumnos encontrados: ${allAlumnosIds.length}`);

        // 1. Insertar ASIGNATURAS
        console.log('Insertando o verificando asignaturas...');
        const uniqueAsignaturas = [...new Set(preguntasData.map(p => p.asignatura))];
        for (const nombre of uniqueAsignaturas) {
            const res = await client.query(
                `INSERT INTO "ASIGNATURA" (nombre) VALUES ($1) ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre RETURNING id;`,
                [nombre]
            );
            asignaturaMap.set(nombre, res.rows[0].id);
            asignaturaPreguntasMap.set(res.rows[0].id, []); // Inicializar array para preguntas por asignatura
        }
        console.log(`Asignaturas procesadas: ${uniqueAsignaturas.length}`);

        // 2. Insertar TEMATICAS
        console.log('Insertando o verificando temáticas...');
        const uniqueTematicas = new Map(); // Para almacenar 'asignatura_id-tematica_nombre'
        for (const pregunta of preguntasData) {
            const id_asignatura = asignaturaMap.get(pregunta.asignatura);
            const tematicaKey = `${id_asignatura}-${pregunta.tematica}`;
            if (!uniqueTematicas.has(tematicaKey)) {
                const res = await client.query(
                    `INSERT INTO "TEMATICA" (id_asignatura, nombre) VALUES ($1, $2) ON CONFLICT (id_asignatura, nombre) DO UPDATE SET nombre = EXCLUDED.nombre RETURNING id;`,
                    [id_asignatura, pregunta.tematica]
                );
                tematicaMap.set(tematicaKey, res.rows[0].id);
                uniqueTematicas.set(tematicaKey, true); // Marcar como procesada
            }
        }
        console.log(`Temáticas procesadas.`);


        // 3. Insertar PREGUNTAS y ALTERNATIVAS
        console.log('Insertando preguntas y alternativas...');
        for (const pregunta of preguntasData) {
            const id_asignatura = asignaturaMap.get(pregunta.asignatura);
            const tematicaKey = `${id_asignatura}-${pregunta.tematica}`;
            const id_tematica = tematicaMap.get(tematicaKey);

            const resPregunta = await client.query(
                `INSERT INTO "PREGUNTA" (id_asignatura, id_profesor, id_tematica, enunciado, efectividad) VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
                [id_asignatura, ID_PROFESOR_DEFAULT, id_tematica, pregunta.enunciado, 0]
            );
            const id_pregunta = resPregunta.rows[0].id;
            
            // Guardar ID de pregunta en el mapa por asignatura
            asignaturaPreguntasMap.get(id_asignatura).push(id_pregunta);

            const alternativas = [];
            const alternativeChars = ['A', 'B', 'C', 'D'];
            for (const char of alternativeChars) {
                const es_correcta = (pregunta.correcta === char);
                const resAlternativa = await client.query(
                    `INSERT INTO "ALTERNATIVA" (id_pregunta, texto, es_correcta) VALUES ($1, $2, $3) RETURNING id;`,
                    [id_pregunta, pregunta[char], es_correcta]
                );
                alternativas.push({ id: resAlternativa.rows[0].id, es_correcta: es_correcta });
            }
            preguntaMap.set(id_pregunta, { original_correcta_char: pregunta.correcta, alternativas: alternativas });
        }
        console.log(`Total de preguntas y alternativas insertadas: ${preguntasData.length}`);

        // 4. Crear ENSAYOS por ASIGNATURA
        console.log('Creando ensayos para cada asignatura objetivo...');
        const ensayosCreados = []; // [{ id_ensayo, id_asignatura, preguntas_ids: [] }]
        for (const nombreAsignatura of asignaturasParaEnsayos) {
            const id_asignatura = asignaturaMap.get(nombreAsignatura);
            if (!id_asignatura) {
                console.warn(`Advertencia: Asignatura "${nombreAsignatura}" no encontrada. Saltando creación de ensayo.`);
                continue;
            }

            const preguntasDeAsignatura = asignaturaPreguntasMap.get(id_asignatura);
            if (preguntasDeAsignatura.length === 0) {
                console.warn(`Advertencia: No hay preguntas para la asignatura "${nombreAsignatura}". Saltando creación de ensayo.`);
                continue;
            }
            
            // Limitamos a 65 preguntas si hay más, o usamos todas las disponibles
            const preguntasParaEnsayo = preguntasDeAsignatura.slice(0, 65);
            console.log(`Creando ensayo para "${nombreAsignatura}" con ${preguntasParaEnsayo.length} preguntas.`);

            const resEnsayo = await client.query(
                `INSERT INTO "ENSAYO" (id_asignatura, dificultad, id_profesor) VALUES ($1, $2, $3) RETURNING id;`,
                [id_asignatura, 'Media', ID_PROFESOR_DEFAULT]
            );
            const id_ensayo = resEnsayo.rows[0].id;
            ensayosCreados.push({ id_ensayo, id_asignatura, preguntas_ids: preguntasParaEnsayo });

            // Llenar ENSAYO_PREGUNTA
            for (const id_pregunta of preguntasParaEnsayo) {
                await client.query(
                    `INSERT INTO "ENSAYO_PREGUNTA" (id_ensayo, id_pregunta) VALUES ($1, $2);`,
                    [id_ensayo, id_pregunta]
                );
            }
        }
        console.log(`Total de ensayos creados: ${ensayosCreados.length}`);

        // 5. Simular RESPUESTAS y RESULTADOS para cada alumno y ensayo
        console.log('Simulando respuestas y resultados de alumnos...');
        for (const alumnoId of allAlumnosIds) {
            for (const ensayo of ensayosCreados) {
                let correctas = 0;
                let erroneas = 0;
                let omitidas = 0; // Para este script, asumiremos 0 omitidas en simulación aleatoria.
                
                for (const id_pregunta of ensayo.preguntas_ids) {
                    const preguntaDetalle = preguntaMap.get(id_pregunta);
                    const alternativas = preguntaDetalle.alternativas;

                    // Elegir una alternativa aleatoria
                    const randomAltIndex = Math.floor(Math.random() * alternativas.length);
                    const selectedAlternativa = alternativas[randomAltIndex];

                    const estado = selectedAlternativa.es_correcta ? 'correcta' : 'erronea';
                    if (estado === 'correcta') {
                        correctas++;
                    } else {
                        erroneas++;
                    }

                    await client.query(
                        `INSERT INTO "RESPUESTA" (id_ensayo, id_pregunta, id_alternativa, id_alumno, estado) VALUES ($1, $2, $3, $4, $5);`,
                        [ensayo.id_ensayo, id_pregunta, selectedAlternativa.id, alumnoId, estado]
                    );
                }

                // Calcular puntaje (ejemplo simple: 100 puntos por correcta, 0 por errónea/omitida)
                let puntaje_obtenido = (correctas / 65)*100;
                puntaje_obtenido = parseFloat(puntaje_obtenido.toFixed(2));
                const tiempo_empleado = Math.floor(Math.random() * (120 - 30 + 1) + 30) * 60; // entre 30 y 120 minutos en segundos

                await client.query(
                    `INSERT INTO "RESULTADO" (id, id_alumno, id_ensayo, puntaje_obtenido, cantidad_correctas, cantidad_omitidas, cantidad_erroneas, tiempo_empleado) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7);`,
                    [alumnoId, ensayo.id_ensayo, puntaje_obtenido, correctas, omitidas, erroneas, tiempo_empleado]
                );
            }
        }
        console.log('Simulación de respuestas y resultados completada.');

        await client.query('COMMIT'); // Confirmar transacción
        console.log('¡Script de población finalizado con éxito!');

    } catch (error) {
        await client.query('ROLLBACK'); // Revertir en caso de error
        console.error('Error durante la ejecución del script:', error);
    } finally {
        client.release();
        await pool.end(); // Cerrar la conexión
    }
}

// Para ejecutar el script
runPopulationScript();