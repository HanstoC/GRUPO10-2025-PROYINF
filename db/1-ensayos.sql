CREATE TYPE asignatura AS ENUM (
    'Competencia Matematica 1 (M1)', -- 1
    'Competencia Matematica 2 (M2)', -- 2
    'Competencia Lectora', -- 3
    'Historia y Ciencias Sociales', -- 4
    'Ciencias - Fisica', -- 5
    'Ciencias - Biologia', -- 6
    'Ciencias - Quimica' -- 7
);

CREATE TABLE
    "TIPO_CONTENIDO" (
        "id" serial PRIMARY KEY,
        "nombre" TEXT UNIQUE NOT NULL
    );

INSERT INTO
    "TIPO_CONTENIDO" ("nombre")
VALUES
    ('Eje Temático'),
    ('Unidad Temática'),
    ('Habilidad'),
    ('Conocimiento');

CREATE TABLE
    "CONTENIDO" (
        "id" serial PRIMARY KEY,
        "id_tipo_contenido" INTEGER REFERENCES "TIPO_CONTENIDO" (id) NOT NULL,
        "asignatura" asignatura NOT NULL,
        "nombre" TEXT NOT NULL,
        "id_padre" INTEGER REFERENCES "CONTENIDO" (id),
        CONSTRAINT unique_contenido_per_asignatura UNIQUE (asignatura, nombre, id_tipo_contenido)
    );

CREATE TYPE dificultad AS ENUM (
    'Muy fácil',
    'Fácil',
    'Intermedia',
    'Difícil',
    'Muy difícil',
    'Experto',
    'Imposible',
    'Divino'
);

CREATE TABLE
    "ENSAYO" (
        "id" serial PRIMARY KEY,
        "asignatura" asignatura NOT NULL,
        "id_profesor" INTEGER NOT NULL,
        "fecha_creacion" DATE DEFAULT CURRENT_DATE,
        "nombre" varchar(100) NOT NULL,
        "dificultad" dificultad NOT NULL
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
        "id_ensayo" INTEGER REFERENCES "ENSAYO" (id) NOT NULL,
        "id_pregunta" INTEGER NOT NULL
    );

CREATE TABLE
    "PREGUNTA" (
        "id" serial PRIMARY KEY,
        "id_profesor" INTEGER NOT NULL,
        "asignatura" asignatura NOT NULL,
        "enunciado" TEXT NOT NULL,
        "imagen_base64" TEXT,
        "efectividad" float DEFAULT 0,
        "dificultad" dificultad NOT NULL
    );

CREATE TABLE
    "PREGUNTA_CONTENIDO" (
        "id" serial PRIMARY KEY,
        "id_pregunta" INTEGER REFERENCES "PREGUNTA" (id) NOT NULL,
        "id_contenido" INTEGER REFERENCES "CONTENIDO" (id) NOT NULL
    );

CREATE TABLE
    "ALTERNATIVA" (
        "id" serial PRIMARY KEY,
        "id_pregunta" INTEGER REFERENCES "PREGUNTA" (id) NOT NULL,
        "texto" TEXT NOT NULL,
        "es_correcta" boolean NOT NULL
    );

CREATE TABLE
    "RESPUESTA" (
        "id" serial PRIMARY KEY,
        "id_ensayo" INTEGER REFERENCES "ENSAYO" (id) NOT NULL,
        "id_pregunta" INTEGER REFERENCES "PREGUNTA" (id) NOT NULL,
        "id_alternativa" INTEGER REFERENCES "ALTERNATIVA" (id) NOT NULL,
        "id_alumno" INTEGER NOT NULL,
        "estado" varchar(100)
    );