const { Pool } = require('pg');
const fs = require('node:fs');
const path = require('node:path');

// --- Configuración de la Base de Datos ---
const dbConfig = {
    user: process.env.DB_USER || 'user',
    host: process.env.DB_HOST || 'postgres_db',
    database: process.env.DB_NAME || 'mydb',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT) : 5432,
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

        const dbUsersMap = new Map(); // rut -> db_id
        let defaultProfesorDbId = null;

        // --- 1. Insertar o verificar USUARIOS (Profesores y Alumnos) ---
        console.log('Insertando o verificando usuarios (profesores y alumnos)...');
        const uniqueUsersToInsert = new Map(); // rut -> { data, type }

        // Recopilar profesores de profesor_jefe
        alumnosData.forEach(curso => {
            if (curso.profesor_jefe && curso.profesor_jefe.length > 0) {
                const pj = curso.profesor_jefe[0]; // Asumiendo que siempre hay un profesor_jefe y es el primero
                if (!uniqueUsersToInsert.has(pj.rut)) {
                    uniqueUsersToInsert.set(pj.rut, {
                        rut: pj.rut,
                        nombre: pj.nombres,
                        email: `${pj.nombres.toLowerCase().replace(/\s/g, '')}.${pj.paterno.toLowerCase()}@miinstituto.cl`, // Generar email
                        tipo: 'profesor'
                    });
                }
            }
        });

        // Recopilar alumnos
        alumnosData.forEach(curso => {
            curso.alumnos.forEach(alumno => {
                if (!uniqueUsersToInsert.has(alumno.rut)) {
                    uniqueUsersToInsert.set(alumno.rut, {
                        rut: alumno.rut,
                        nombre: alumno.nombre,
                        email: alumno.email || `${alumno.nombre.toLowerCase().replace(/\s/g, '')}.${alumno.paterno.toLowerCase()}@miinstituto.cl`, // Usar email si existe, sino generar
                        tipo: 'alumno'
                    });
                }
            });
        });

        // Primero, obtener los IDs de los usuarios ya existentes en la BD para evitar conflictos con el serial
        const existingUsers = await client.query(`SELECT id, rut FROM "usuario";`);
        existingUsers.rows.forEach(row => {
            dbUsersMap.set(row.rut, row.id);
        });

        for (const [rut, userData] of uniqueUsersToInsert) {
            if (!dbUsersMap.has(rut)) { // Solo intentar insertar si el RUT no existe en nuestra lista de usuarios ya cargados/existentes
                const password = `${userData.nombre.toLowerCase()}123`; // Primer nombre + "123"
                const res = await client.query(
                    `INSERT INTO "usuario" (rut, contraseña, correo, tipo) VALUES ($1, $2, $3, $4)
                     ON CONFLICT (rut) DO NOTHING RETURNING id;`, // DO NOTHING para no sobrescribir, solo insertar si es nuevo
                    [userData.rut, password, userData.email, userData.tipo]
                );
                // Si la inserción ocurrió (es decir, no hubo conflicto y res.rows tiene algo)
                if (res.rows.length > 0) {
                    dbUsersMap.set(userData.rut, res.rows[0].id);
                } else {
                    // Si hubo conflicto y no se insertó, recupera el ID del usuario existente.
                    // Esto es necesario porque DO NOTHING no retorna el ID si hubo conflicto.
                    const existingUserRes = await client.query(`SELECT id FROM "usuario" WHERE rut = $1;`, [userData.rut]);
                    if (existingUserRes.rows.length > 0) {
                        dbUsersMap.set(userData.rut, existingUserRes.rows[0].id);
                    }
                }
            }

            // Establecer el primer profesor encontrado como default, usando su ID de la BD
            if (userData.tipo === 'profesor' && defaultProfesorDbId === null) {
                defaultProfesorDbId = dbUsersMap.get(userData.rut); 
            }
        }

        console.log(`Usuarios (profesores y alumnos) procesados. Total: ${dbUsersMap.size}`);
        if (defaultProfesorDbId === null) {
            // Esto solo se activaría si no hay profesores en el JSON Y tampoco se detectó uno previamente en la BD.
            throw new Error('No se pudo determinar un ID de profesor por defecto. Asegúrate de que hay al menos un profesor.');
        }


        // Obtener los IDs de alumnos de la BD para usar en resultados/respuestas
        const allAlumnosDbIds = [];
        alumnosData.forEach(curso => {
            curso.alumnos.forEach(alumno => {
                const dbId = dbUsersMap.get(alumno.rut);
                if (dbId) {
                    allAlumnosDbIds.push(dbId);
                } else {
                    console.warn(`Advertencia: Alumno con RUT ${alumno.rut} del JSON no tiene un ID mapeado en dbUsersMap. Esto puede indicar que no se insertó o recuperó correctamente.`);
                }
            });
        });
        console.log(`Total de IDs de alumnos de la BD para simulación: ${allAlumnosDbIds.length}`);


        // --- 2. Insertar ASIGNATURAS ---
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

        // --- 3. Insertar TEMATICAS ---
        console.log('Insertando o verificando temáticas...');
        const uniqueTematicasSet = new Set(); // Para almacenar 'asignatura_id-tematica_nombre'
        for (const pregunta of preguntasData) {
            const id_asignatura = asignaturaMap.get(pregunta.asignatura);
            if (!id_asignatura) {
                console.warn(`Asignatura "${pregunta.asignatura}" no mapeada para temática "${pregunta.tematica}".`);
                continue;
            }
            const tematicaKey = `${id_asignatura}-${pregunta.tematica}`;
            if (!uniqueTematicasSet.has(tematicaKey)) {
                try {
                    const res = await client.query(
                        `INSERT INTO "TEMATICA" (id_asignatura, nombre) VALUES ($1, $2) ON CONFLICT (id_asignatura, nombre) DO UPDATE SET nombre = EXCLUDED.nombre RETURNING id;`,
                        [id_asignatura, pregunta.tematica]
                    );
                    tematicaMap.set(tematicaKey, res.rows[0].id);
                    uniqueTematicasSet.add(tematicaKey); // Marcar como procesada
                } catch (error) {
                    console.error(`Error al insertar temática "${pregunta.tematica}" para asignatura ${pregunta.asignatura}:`, error.message);
                }
            }
        }
        console.log(`Temáticas procesadas.`);


        // --- 4. Insertar PREGUNTAS y ALTERNATIVAS ---
        console.log('Insertando preguntas y alternativas...');
        for (const pregunta of preguntasData) {
            const id_asignatura = asignaturaMap.get(pregunta.asignatura);
            const tematicaKey = `${id_asignatura}-${pregunta.tematica}`;
            const id_tematica = tematicaMap.get(tematicaKey);

            if (!id_tematica) {
                console.warn(`Saltando pregunta ID ${pregunta.numero} ("${pregunta.enunciado.substring(0, 30)}...") debido a temática no mapeada.`);
                continue; // Saltar si la temática no fue insertada
            }

            const resPregunta = await client.query(
                `INSERT INTO "PREGUNTA" (id_asignatura, id_profesor, id_tematica, enunciado, efectividad) VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
                [id_asignatura, defaultProfesorDbId, id_tematica, pregunta.enunciado, 0]
            );
            const id_pregunta = resPregunta.rows[0].id;
            
            // Guardar ID de pregunta en el mapa por asignatura
            asignaturaPreguntasMap.get(id_asignatura).push(id_pregunta);

            const alternativas = [];
            const alternativeChars = ['A', 'B', 'C', 'D'];
            for (const char of alternativeChars) {
                const es_correcta = (pregunta.correcta === char);
                // Asegura que el texto no sea null/undefined. Si es, usa una cadena vacía.
                const alternativaTexto = pregunta[char] || ''; 
                
                const resAlternativa = await client.query(
                    `INSERT INTO "ALTERNATIVA" (id_pregunta, texto, es_correcta) VALUES ($1, $2, $3) RETURNING id;`,
                    [id_pregunta, alternativaTexto, es_correcta]
                );
                alternativas.push({ id: resAlternativa.rows[0].id, es_correcta: es_correcta });
            }
            preguntaMap.set(id_pregunta, { original_correcta_char: pregunta.correcta, alternativas: alternativas });
        }
        console.log(`Total de preguntas y alternativas insertadas: ${preguntasData.length}`);

        // --- 5. Crear ENSAYOS por ASIGNATURA ---
        console.log('Creando ensayos para cada asignatura objetivo...');
        const ensayosCreados = []; // [{ id_ensayo, id_asignatura, preguntas_ids: [] }]
        for (const nombreAsignatura of asignaturasParaEnsayos) {
            const id_asignatura = asignaturaMap.get(nombreAsignatura);
            if (!id_asignatura) {
                console.warn(`Advertencia: Asignatura "${nombreAsignatura}" no encontrada en el mapa de asignaturas. Saltando creación de ensayo.`);
                continue;
            }

            const preguntasDeAsignatura = asignaturaPreguntasMap.get(id_asignatura);
            if (!preguntasDeAsignatura || preguntasDeAsignatura.length === 0) {
                console.warn(`Advertencia: No hay preguntas cargadas para la asignatura "${nombreAsignatura}". Saltando creación de ensayo.`);
                continue;
            }
            
            // Limitamos a 65 preguntas si hay más, o usamos todas las disponibles
            const preguntasParaEnsayo = preguntasDeAsignatura.slice(0, 65);
            console.log(`Creando ensayo para "${nombreAsignatura}" con ${preguntasParaEnsayo.length} preguntas.`);

            const resEnsayo = await client.query(
                `INSERT INTO "ENSAYO" (id_asignatura, dificultad, id_profesor) VALUES ($1, $2, $3) RETURNING id;`,
                [id_asignatura, 'Media', defaultProfesorDbId]
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

        // --- 6. Simular RESPUESTAS y RESULTADOS para cada alumno y ensayo ---
        console.log('Simulando respuestas y resultados de alumnos...');
        for (const alumnoDbId of allAlumnosDbIds) { // Usar los IDs de la DB de los alumnos
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
                        [ensayo.id_ensayo, id_pregunta, selectedAlternativa.id, alumnoDbId, estado]
                    );
                }

                // Calcular puntaje: (correctas / 65) con dos decimales, sobre 100
                let puntaje_obtenido = (correctas / 65) * 100; // Ahora sobre 100
                puntaje_obtenido = Number.parseFloat(puntaje_obtenido.toFixed(2));
                
                const tiempo_empleado = Math.floor(Math.random() * (120 - 30 + 1) + 30) * 60; // entre 30 y 120 minutos en segundos

                await client.query(
                    `INSERT INTO "RESULTADO" (id_alumno, id_ensayo, puntaje_obtenido, cantidad_correctas, cantidad_omitidas, cantidad_erroneas, tiempo_empleado) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
                    [alumnoDbId, ensayo.id_ensayo, puntaje_obtenido, correctas, omitidas, erroneas, tiempo_empleado]
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