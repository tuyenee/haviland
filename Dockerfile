FROM node:10
WORKDIR /usr/src/app
RUN npm install -fg nodemon
COPY . .
RUN chmod +x ./wait-for-it.sh
RUN npm install
EXPOSE 8080
CMD ./wait-for-it.sh mongo:27017 -t 30 -- nodemon index.js