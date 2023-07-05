FROM postgres
ENV POSTGRES_PASSWORD root
ENV POSTGRES_USER root
ENV POSTGRES_DB baza

COPY db_structure.sql /docker-entrypoint-initdb.d/
