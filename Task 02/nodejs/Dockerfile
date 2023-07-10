FROM node:latest

WORKDIR /app
COPY *.js ./

COPY package*.json ./
RUN npm install
# COPY node_modules ./node_modules

CMD ["node", "/app/index.js"]