FROM node:lts-bullseye-slim
RUN apt-get update && apt-get upgrade -y
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
