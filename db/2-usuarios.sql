CREATE TYPE tipo_usuario AS ENUM ('profesor', 'alumno', 'visualizador');

CREATE TABLE USUARIO (
    id SERIAL PRIMARY KEY,
    rut VARCHAR(20) UNIQUE NOT NULL CHECK (Rut ~ '^[0-9]+-[0-9K]$'),
    contraseña VARCHAR(255) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL CHECK (Correo ~ '@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
    tipo tipo_usuario NOT NULL
);
