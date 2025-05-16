const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Importar la conexión
const alumnos = require('./api_sim/alumnos.json'); 
const docentes= require('./api_sim/docentes.json')
const app = express();
const port = 8000;


app.use(cors());

app.use(express.json());

(async () => {
await pool.query('SET search_path TO "Public"');
})();


app.get('/asignaturas', async (req, res) => {
  try {
    const asignaturas = await pool.query('SELECT * FROM "ASIGNATURA"');
    res.json(asignaturas.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

app.get('/ensayos', async (req, res) => {
  try {
    await pool.query('SET search_path TO "Public"');
    const asignaturas = await pool.query('SELECT * FROM "ENSAYO"');
    res.json(asignaturas.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

app.get('/alumnos', async (req, res) => {
  try {
    // console.log(data);
    res.json(alumnos);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

app.get('/docentes', async (req, res) => {
  try {
    // console.log(data);
    res.json(docentes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});


app.post('/preguntas', async (req, res) => {
  const client = await pool.connect();
  await pool.query('SET search_path TO "Public"');

  try {
    const {
      id_asignatura,
      id_profesor,
      topico,
      pregunta,
      imagen,
      respuestas
    } = req.body;

    await client.query('BEGIN');

    const insertPregunta = `
      INSERT INTO pregunta (id_asignatura, id_profesor, tematica, enunciado, imagen_base64)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const { rows } = await client.query(insertPregunta, [
      id_asignatura,
      id_profesor,
      topico,
      pregunta,
      imagen
    ]);
    const id_pregunta = rows[0].id;

    for (const r of respuestas) {
      await client.query(
        'INSERT INTO alternativa (id_pregunta, texto, es_correcta) VALUES ($1, $2, $3)',
        [id_pregunta, r.texto, r.es_correcta]
      );
    }

    await client.query('COMMIT');
    res.sendStatus(201);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).send('Error al guardar la pregunta');
  } finally {
    client.release();
  }
});

app.get('/topicos/:idAsignatura', async (req, res) => {
  const idAsignatura = parseInt(req.params.idAsignatura, 10);
  console.log(idAsignatura)
  await pool.query('SET search_path TO "Public"');

  if (isNaN(idAsignatura)) {
  return res.status(400).json({ error: 'ID de asignatura inválido' });
  }
  try {
    const result = await pool.query(
      'SELECT * FROM "TEMATICA" WHERE id_asignatura = $1',
      [idAsignatura]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener tópicos:', err);
    res.status(500).send('Error al obtener los tópicos');
  }
});


app.get('/asignatura/nombre/:nombre', async (req, res) => {
  const { nombre } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM "ASIGNATURA" WHERE LOWER(nombre) = LOWER($1)',
      [nombre]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al buscar asignatura por nombre:', err);
    res.status(500).send('Error en el servidor');
  }
});
app.get('/', (req, res) => {
  res.send('¡Bienvenido! si ves este mensaje es que back se levanto de buenas.');
});

app.listen(port, () => {
  console.log(`App corriendo en http://localhost:${port}`);
});

