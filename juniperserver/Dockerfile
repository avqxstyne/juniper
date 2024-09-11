FROM node:alpine3.18
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 8000 8080
CMD [ "npm", "run", "start" ]