FROM postgres
ENV POSTGRES_PASSWORD root
ENV POSTGRES_USER root
ENV POSTGRES_DB baza
EXPOSE 5432

RUN apt-get update && apt-get install -y ca-certificates curl python3

ARG NODE_VERSION=14.16.0
ARG NODE_PACKAGE=node-v$NODE_VERSION-linux-x64
ARG NODE_HOME=/opt/$NODE_PACKAGE

ENV NODE_PATH $NODE_HOME/lib/node_modules
ENV PATH $NODE_HOME/bin:$PATH

RUN curl https://nodejs.org/dist/v$NODE_VERSION/$NODE_PACKAGE.tar.gz | tar -xzC /opt/

WORKDIR /app

RUN npm i pg
RUN npm i --unsafe-perm argon2
RUN npm i express

COPY package*.json ./ 

COPY index.js ./

COPY db.sql /docker-entrypoint-initdb.d/

#
COPY runner.sh /docker-entrypoint-initdb.d/
#