FROM mongo

COPY /initData /initData

CMD mongoimport --host mongo --db haviland --collection Users --type json --file /initData/users.json --jsonArray
CMD mongoimport --host mongo --db haviland --collection Rooms --type json --file /initData/rooms.json --jsonArray