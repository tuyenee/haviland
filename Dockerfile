FROM node:10

WORKDIR /usr/src/app

RUN npm install -fg nodemon

COPY package*.json ./
COPY ./wait-for-it.sh ./

RUN chmod +x ./wait-for-it.sh
RUN npm install

COPY . .

EXPOSE 8080

#CMD ["nodemon", "index.js"]
CMD ./wait-for-it.sh mongo:27017 -t 30 -- nodemon index.js