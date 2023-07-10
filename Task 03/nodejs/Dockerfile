FROM node:latest

WORKDIR /app
COPY *.js ./

COPY package*.json ./
RUN npm i

CMD ["node", "/app/index.js"]