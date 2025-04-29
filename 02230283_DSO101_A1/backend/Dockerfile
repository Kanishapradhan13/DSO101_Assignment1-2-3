FROM node:16-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]