FROM node:10

WORKDIR /usr/src/app

RUN npm install -fg nodemon

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["nodemon", "index.js"]