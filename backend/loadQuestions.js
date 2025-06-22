// loadQuestions.js

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const dbConfig = {
    user: process.env.DB_USER || 'user',       
    host: process.env.DB_HOST || 'postgres_db',         
    database: process.env.DB_NAME || 'mydb',   
    password: process.env.DB_PASSWORD || 'password', 
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
};


const preguntasJsonFile = path.join(__dirname, 'preguntas.json'); 


const defaultProfessorId = process.env.DEFAULT_PROFESSOR_ID ? parseInt(process.env.DEFAULT_PROFESSOR_ID) : 1;

async function insertQuestionsFromJson() {
    let client; 
    try {
        console.log("Conectando a la base de datos PostgreSQL...");
        client = new Pool(dbConfig); 
        await client.connect(); 
        console.log("Conexión exitosa.");

        
        const preguntasData = JSON.parse(fs.readFileSync(preguntasJsonFile, 'utf8'));
        console.log(`Cargadas ${preguntasData.length} preguntas desde '${preguntasJsonFile}'.`);

        
        for (let i = 0; i < preguntasData.length; i++) {
            const pregunta = preguntasData[i];
            console.log(`\nProcesando pregunta ${i + 1}/${preguntasData.length}: ${pregunta.enunciado.substring(0, 50)}...`);

            
            await client.query('BEGIN');

            try {
                const asignaturaNombre = pregunta.asignatura;
                let asignaturaId;
                let res = await client.query('SELECT id FROM "ASIGNATURA" WHERE nombre = $1', [asignaturaNombre]);

                if (res.rows.length === 0) {
                    console.log(`  Asignatura '${asignaturaNombre}' no encontrada. Insertando...`);
                    res = await client.query('INSERT INTO "ASIGNATURA" (nombre) VALUES ($1) RETURNING id', [asignaturaNombre]);
                    asignaturaId = res.rows[0].id;
                    console.log(`  Asignatura '${asignaturaNombre}' insertada con ID: ${asignaturaId}`);
                } else {
                    asignaturaId = res.rows[0].id;
                    console.log(`  Asignatura '${asignaturaNombre}' encontrada con ID: ${asignaturaId}`);
                }

                
                const tematicaNombre = pregunta.tematica;
                let tematicaId;
                res = await client.query('SELECT id FROM "TEMATICA" WHERE nombre = $1 AND id_asignatura = $2', [tematicaNombre, asignaturaId]);

                if (res.rows.length === 0) {
                    console.log(`  Temática '${tematicaNombre}' para asignatura '${asignaturaNombre}' no encontrada. Insertando...`);
                    res = await client.query('INSERT INTO "TEMATICA" (id_asignatura, nombre) VALUES ($1, $2) RETURNING id', [asignaturaId, tematicaNombre]);
                    tematicaId = res.rows[0].id;
                    console.log(`  Temática '${tematicaNombre}' insertada con ID: ${tematicaId}`);
                } else {
                    tematicaId = res.rows[0].id;
                    console.log(`  Temática '${tematicaNombre}' encontrada con ID: ${tematicaId}`);
                }

                
                const enunciado = pregunta.enunciado;
                
                res = await client.query(
                    `INSERT INTO "PREGUNTA" (id_asignatura, id_profesor, id_tematica, enunciado)
                     VALUES ($1, $2, $3, $4) RETURNING id`,
                    [asignaturaId, defaultProfessorId, tematicaId, enunciado]
                );
                const preguntaId = res.rows[0].id;
                console.log(`  Pregunta insertada con ID: ${preguntaId}`);

                
                const alternativasLetras = ['A', 'B', 'C', 'D'];
                const correctaLetra = pregunta.correcta;

                for (const altLetra of alternativasLetras) {
                    const altTexto = pregunta[altLetra]; 
                    const esCorrecta = (altLetra === correctaLetra);

                    await client.query(
                        `INSERT INTO "ALTERNATIVA" (id_pregunta, texto, es_correcta)
                         VALUES ($1, $2, $3)`,
                        [preguntaId, altTexto, esCorrecta]
                    );
                    console.log(`    Alternativa ${altLetra}: '${altTexto}' (Correcta: ${esCorrecta}) insertada.`);
                }

                
                await client.query('COMMIT');

            } catch (innerError) {
                await client.query('ROLLBACK'); 
                console.error(`Error procesando pregunta ${i + 1}: ${innerError.message}`);
                throw innerError; 
            }
        }

        console.log("\n¡Todas las preguntas han sido insertadas exitosamente!");

    } catch (error) {
        console.error(`Error general al conectar o interactuar con la base de datos: ${error.message}`);
        
    } finally {
        if (client) {
            await client.end(); 
            console.log("Conexión a la base de datos cerrada.");
        }
    }
}


insertQuestionsFromJson();