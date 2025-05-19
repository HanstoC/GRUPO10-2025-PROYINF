CREATE TABLE
    "ASIGNATURA" (
        "id" serial PRIMARY KEY,
        "nombre" varchar(100) UNIQUE NOT NULL
    );

CREATE TABLE
    "TEMATICA" (
        "id" serial PRIMARY KEY,
        "id_asignatura" INTEGER REFERENCES "ASIGNATURA" (id) NOT NULL,
        "nombre" varchar(100)
    );

CREATE TABLE
    "ENSAYO" (
        "id" serial PRIMARY KEY,
        "id_asignatura" INTEGER REFERENCES "ASIGNATURA" (id) NOT NULL,
        "dificultad" varchar(100) NOT NULL,
        "id_profesor" INTEGER NOT NULL,
        "fecha_creacion" DATE
    );

CREATE TABLE
    "RESULTADO" (
        "id" serial PRIMARY KEY,
        "id_alumno" INTEGER NOT NULL,
        "id_ensayo" INTEGER REFERENCES "ENSAYO" (id) NOT NULL,
        "puntaje_obtenido" float NOT NULL,
        "cantidad_correctas" INTEGER NOT NULL,
        "cantidad_omitidas" INTEGER NOT NULL,
        "cantidad_erroneas" INTEGER NOT NULL,
        "tiempo_empleado" INTEGER
    );

CREATE TABLE
    "ENSAYO_PREGUNTA" (
        "id" serial PRIMARY KEY,
        "id_ensayo" INTEGER REFERENCES "ENSAYO" (id) UNIQUE NOT NULL,
        "id_pregunta" INTEGER NOT NULL
    );

CREATE TABLE
    "PREGUNTA" (
        "id" serial PRIMARY KEY,
        "id_asignatura" INTEGER REFERENCES "ASIGNATURA" (id) NOT NULL,
        "id_profesor" INTEGER NOT NULL,
        "id_tematica" INTEGER REFERENCES "TEMATICA" (id) NOT NULL,
        "enunciado" TEXT,
        "imagen" TEXT,
        "efectividad" float
    );

CREATE TABLE
    "ALTERNATIVA" (
        "id" serial PRIMARY KEY,
        "id_pregunta" INTEGER REFERENCES "PREGUNTA" (id) NOT NULL,
        "contenido" TEXT,
        "es_correcta" boolean
    );

CREATE TABLE
    "RESPUESTA" (
        "id" serial PRIMARY KEY,
        "id_ensayo" INTEGER REFERENCES "ENSAYO" (id) NOT NULL,
        "id_pregunta" INTEGER REFERENCES "PREGUNTA" (id) NOT NULL,
        "id_alternativa" INTEGER REFERENCES "ALTERNATIVA" (id) NOT NULL,
        "id_alumno" INTEGER NOT NULL,
        "estado" varchar(100)
    )