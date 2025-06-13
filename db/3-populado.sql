INSERT INTO "ASIGNATURA" (nombre) VALUES ('Matemáticas');
INSERT INTO "ASIGNATURA" (nombre) VALUES ('Lenguaje');
INSERT INTO "ASIGNATURA" (nombre) VALUES ('Historia');
INSERT INTO "ASIGNATURA" (nombre) VALUES ('Ciencias');

INSERT INTO
    USUARIO (rut, contraseña, correo, tipo)
VALUES
    (
        '11223344-5',
        'profesor123',
        'profesor@miinstituto.cl',
        'profesor'
    );

INSERT INTO
    USUARIO (rut, contraseña, correo, tipo)
VALUES
    (
        '55667788-9',
        'alumnocomun',
        'alumno@miinstituto.cl',
        'alumno'
    );

INSERT INTO
    USUARIO (rut, contraseña, correo, tipo)
VALUES
    (
        '22334455-6',
        'visualizadorcomun',
        'visualizador@miinstituto.cl',
        'visualizador'
    );