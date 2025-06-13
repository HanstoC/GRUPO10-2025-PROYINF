FROM postgres:15-alpine

# Copy initialization scripts
COPY *.sql /docker-entrypoint-initdb.d/

# Ensure scripts are executable
RUN chmod +x /docker-entrypoint-initdb.d/*.sql