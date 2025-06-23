const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');

const alumnos = require('./api_sim/alumnos.json');
const docentes = require('./api_sim/docentes.json');
const alumnosService = require('./services/alumnos');

const app = express();
const port = 8000;

function necesitaAuth(req, res, next) {
  if (req.session && req.session.user)
    return next();
  else
    return res.status(401).json({ error: 'No autorizado' });
}

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || "secreto-sesión-no-tan-secreto",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 86400000, // 1 día en milisegundos
  }
}));
app.use(express.json());

const db = new Pool({
  user: 'user',
  host: 'postgres_db',
  database: 'mydb',
  password: 'password',
  port: 5432
});

app.get('/AllAlumnos',(req, res) => { 
    try {
        const allAlumnosFlattened = alumnosService.getAllAlumnos();
        res.json(allAlumnosFlattened); 
    } catch (err) {
        console.error('Error al obtener todos los alumnos:', err);
        res.status(500).send('Error al obtener la lista de alumnos.');
    }
});


const pool = new Pool({
  user: process.env.DB_USER || 'user',
  host: process.env.DB_HOST || 'postgres_db',
  database: process.env.DB_NAME || 'mydb',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

(async () => {
  await pool.query('SET search_path TO "public"');
})();

app.get('/asignaturas', necesitaAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "ASIGNATURA" ORDER BY nombre');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener asignaturas:', err);
    res.status(500).send('Error al obtener las asignaturas');
  }
});

app.post('/asignaturas', necesitaAuth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { nombre } = req.body;

    const existingSubject = await client.query(
      'SELECT * FROM "ASIGNATURA" WHERE LOWER(nombre) = LOWER($1)',
      [nombre]
    );

    if (existingSubject.rows.length > 0) {
      return res.json(existingSubject.rows[0]);
    }

    const result = await client.query(
      'INSERT INTO "ASIGNATURA" (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear asignatura:', err);
    res.status(500).send('Error al crear la asignatura');
  } finally {
    client.release();
  }
});

app.get('/ensayos', necesitaAuth, async (req, res) => {
  try {
    let query = `
      SELECT e.*, a.nombre AS asignatura
      FROM "ENSAYO" e
      JOIN "ASIGNATURA" a ON e.id_asignatura = a.id
    `;
    const values = [];
    const where = [];

    if (req.query.profesor) {
      where.push(`e.id_profesor = $${values.length + 1}`);
      values.push(Number(req.query.profesor));
    }

    if (req.query.asignatura) {
      const asignaturas = Array.isArray(req.query.asignatura)
        ? req.query.asignatura
        : [req.query.asignatura];

      const placeholders = asignaturas.map((_, i) => `$${values.length + i + 1}`).join(', ');
      where.push(`e.id_asignatura IN (${placeholders})`);
      values.push(...asignaturas.map(Number));
    }

    if (where.length > 0) {
      query += ` WHERE ` + where.join(' AND ');
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener ensayos:', err);
    res.status(500).send('Error al obtener ensayos');
  }
});


app.post('/ensayos', async (req, res) => {
	const { id_asignatura, id_profesor, dificultad, preguntas } = req.body;

	if (!id_asignatura || !id_profesor || !dificultad || !Array.isArray(preguntas)) {
		return res.status(400).send('Faltan datos');
	}

	const client = await pool.connect(); //obtener client del pool

	try {
		await client.query('BEGIN');

		const ensayoResult = await client.query(
			`INSERT INTO "ENSAYO" (id_asignatura, id_profesor, dificultad)
			 VALUES ($1, $2, $3) RETURNING id`,
			[id_asignatura, id_profesor, dificultad]
		);
		const id_ensayo = ensayoResult.rows[0].id;

		const inserts = preguntas.map((id_pregunta) =>
			client.query(
				`INSERT INTO "ENSAYO_PREGUNTA" (id_ensayo, id_pregunta) VALUES ($1, $2)`,
				[id_ensayo, id_pregunta]
			)
		);
		await Promise.all(inserts);

		await client.query('COMMIT');

		res.status(201).json({ message: 'Ensayo creado', id_ensayo });
	} catch (err) {
		await client.query('ROLLBACK');
		console.error('Error al guardar ensayo:', err);
		res.status(500).send('Error interno del servidor');
	} finally {
		client.release(); //liberar conexión
	}
});

app.get('/ensayos/:id/preguntas', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT P.enunciado AS pregunta, A.texto AS respuesta, A.es_correcta AS correcta
      FROM "ENSAYO_PREGUNTA" EP
      JOIN "PREGUNTA" P ON EP.id_pregunta = P.id
      JOIN "ALTERNATIVA" A ON A.id_pregunta = P.id AND A.es_correcta = true
      WHERE EP.id_ensayo = $1
    `, [id]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo preguntas:', err);
    res.status(500).send('Error al obtener preguntas');
  }
});





app.get('/alumnos', necesitaAuth, async (req, res) => {
  try {
    // console.log(data);
    res.json(alumnos);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});


app.get('/docentes', necesitaAuth, async (req, res) => {
  try {
    // console.log(data);
    res.json(docentes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

app.get('/resultados', async (req, res) => {
  const idAlumno = req.query.alumno;

  if (!idAlumno) {
    return res.status(400).send('Falta el parámetro alumno');
  }

  try {
    const result = await pool.query(`
      SELECT 
        e.id AS id_ensayo,
        a.nombre AS asignatura,
        e.dificultad,
        r.puntaje
      FROM "RESULTADO" r
      JOIN "ENSAYO" e ON r.id_ensayo = e.id
      JOIN "ASIGNATURA" a ON e.id_asignatura = a.id
      WHERE r.id_alumno = $1
    `, [idAlumno]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener resultados del alumno:', err);
    res.status(500).send('Error al obtener resultados del alumno');
  }
});


app.get('/preguntas', necesitaAuth, async (req, res) => {
  const idAsignatura = req.query.asignatura;

  try {
    let result;
    if (idAsignatura) {
      result = await pool.query(`
        SELECT 
          p.id,
          p.enunciado,
          p.imagen_base64,
          t.nombre AS topico,
          a.nombre AS asignatura,
          u.rut AS autor
        FROM "PREGUNTA" p
        JOIN "TEMATICA" t ON p.id_tematica = t.id
        JOIN "ASIGNATURA" a ON p.id_asignatura = a.id
        JOIN "usuario" u ON p.id_profesor = u.id
        WHERE p.id_asignatura = $1
        ORDER BY p.id DESC
      `, [idAsignatura]);
    } else {
      result = await pool.query(`
        SELECT 
          p.id,
          p.enunciado,
          p.imagen_base64,
          t.nombre AS topico,
          a.nombre AS asignatura,
          u.rut AS autor
        FROM "PREGUNTA" p
        JOIN "TEMATICA" t ON p.id_tematica = t.id
        JOIN "ASIGNATURA" a ON p.id_asignatura = a.id
        JOIN "usuario" u ON p.id_profesor = u.id
        ORDER BY p.id DESC
      `);
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener preguntas:', err);
    res.status(500).send('Error al obtener preguntas');
  }
});



app.post('/preguntas', necesitaAuth, async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      id_asignatura,
      id_profesor,
      topico,
      pregunta,
      imagen,
      respuestas,
      id_tematica
    } = req.body;

    await client.query('BEGIN');

    let tematicaId = id_tematica;
    if (!id_tematica && topico?.trim()) {
      const tematicaResult = await client.query(
        'INSERT INTO "TEMATICA" (id_asignatura, nombre) VALUES ($1, $2) RETURNING id',
        [id_asignatura, topico]
      );
      tematicaId = tematicaResult.rows[0].id;
    }
    const preguntaResult = await client.query(
      `INSERT INTO "PREGUNTA" (id_asignatura, id_profesor, id_tematica, enunciado, imagen_base64)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [id_asignatura, id_profesor, tematicaId, pregunta, imagen]
    );

    const id_pregunta = preguntaResult.rows[0].id;

    for (const alt of respuestas) {
      await client.query(
        `INSERT INTO "ALTERNATIVA" (id_pregunta, texto, es_correcta)
         VALUES ($1, $2, $3)`,
        [id_pregunta, alt.texto, alt.es_correcta]
      );
    }

    await client.query('COMMIT');
    res.sendStatus(200);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error guardando pregunta:', err);
    res.status(500).send('Error al guardar la pregunta');
  } finally {
    client.release();
  }
});

app.post('/respuestas', necesitaAuth, async (req, res) => {
  const { id_ensayo, id_pregunta, id_alternativa, id_alumno, estado } = req.body;
  try {
    await db.query(
      `INSERT INTO "RESPUESTA" (id_ensayo, id_pregunta, id_alternativa, id_alumno, estado)
       VALUES ($1, $2, $3, $4, $5)`,
      [id_ensayo, id_pregunta, id_alternativa, id_alumno, estado]
    );
    res.status(200).send('Respuesta registrada');
  } catch (err) {
    console.error('Error guardando respuesta:', err);
    res.status(500).send('Error al guardar respuesta');
  }
});


app.get('/topicos/:idAsignatura', necesitaAuth, async (req, res) => {
  const idAsignatura = parseInt(req.params.idAsignatura, 10);
  console.log(idAsignatura)

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

app.get('/asignatura/nombre/:nombre', necesitaAuth, async (req, res) => {
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
  res.send('Backend corriendo');
});

app.post('/login', async (req, res) => {
  try {
    const { rut, contraseña } = req.body;
    const result = await pool.query(
      'SELECT * FROM "usuario" WHERE rut = $1 AND contraseña = $2',
      [rut, contraseña]
    );

    if (result.rows.length > 0) {
      const { id, rut, tipo } = result.rows[0]
      req.session.user = {
        id,
        rut,
        tipo
      };
      let info
      if(tipo == 'alumno'){
        info = alumnosService.findAlumnoByRut(rut);

      } else if (tipo == 'profesor'){
        info = alumnosService.findDocenteByRut(rut);

      } else {
        info = alumnosService.findDirectivoByRut(rut);
      }

      res.status(200).json({ message: 'Inicio de sesión exitoso', user:{...result.rows[0] , ...info} });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }

  } catch (err) {
    console.error('Error al actualizar ensayo:', err);
    res.status(500).send('Error al actualizar el ensayo');
  }
});

app.get("/check-session", necesitaAuth, (req, res) => {
  res.status(200).json({
    authenticated: true,
    user: req.session.user
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err)
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

