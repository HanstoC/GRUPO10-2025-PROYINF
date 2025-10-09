
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sessionMiddleware = require('./src/config/session'); 

const app = express();  
const PORT = process.env.PORT || 8000;

const alumnosRouter = require('./src/routes/alumnos.routes');
const asignaturasRouter = require('./src/routes/asignaturas.routes');
const ensayosRouter = require('./src/routes/ensayos.routes');
const docentesRouter = require('./src/routes/docentes.routes');
const resultadosRouter = require('./src/routes/resultados.routes');
const preguntasRouter = require('./src/routes/preguntas.routes');
const respuestasRouter = require('./src/routes/respuestas.routes');
const topicosRouter = require('./src/routes/topicos.routes');
const mainRouter = require('./src/routes/main.routes'); 
const authRouter = require('./src/routes/auth.routes');

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json()); 

app.use(cookieParser());

app.use(sessionMiddleware);

//routers
app.use('/', mainRouter); 
app.use('/alumnos', alumnosRouter);
app.use('/asignaturas', asignaturasRouter);
app.use('/ensayos', ensayosRouter); 
app.use('/docentes', docentesRouter); 
app.use('/resultados', resultadosRouter);
app.use('/preguntas', preguntasRouter);  
app.use('/respuestas', respuestasRouter);
app.use('/topicos', topicosRouter); 
app.use('/login', authRouter);


app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});

