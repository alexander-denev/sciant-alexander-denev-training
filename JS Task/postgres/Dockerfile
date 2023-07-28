FROM postgres:latest

COPY db_structure.sql /docker-entrypoint-initdb.d/

HEALTHCHECK --interval=10s --timeout=3s --retries=2 CMD [ "pg_isready" ]
