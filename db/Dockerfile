FROM postgres:15-alpine AS base

ADD 1-ensayos.sql /docker-entrypoint-initdb.d
ADD 2-usuarios.sql /docker-entrypoint-initdb.d
ADD 3-populado.sql /docker-entrypoint-initdb.d