FROM node:latest

WORKDIR /app
COPY index.js ./

RUN npm i pg
RUN npm i argon2
RUN npm i express
RUN npm i express-session

CMD ["node", "/app/index.js"]