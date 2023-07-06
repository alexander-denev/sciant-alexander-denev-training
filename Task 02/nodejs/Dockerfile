FROM node:latest

WORKDIR /app
COPY *.js ./

RUN npm i pg
RUN npm i argon2
RUN npm i express
RUN npm i jsonwebtoken

CMD ["node", "/app/index.js"]