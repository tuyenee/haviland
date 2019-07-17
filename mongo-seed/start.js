db.haviland.drop();
db.users.insertMany([
    {
        "_id": (new ObjectId("5be2570e76e440ab73cd81a6")),
        "name": "John Doe",
        "username": "jsmith",
        "password": "50036c8c95c99b78fa4e363eaab91f470f275cb5b4cce5fc69ff71893f6ce58325aff6e8b1954775130aad85ba400a8967dea4888f17369b4bc032a70beaa222",
        "salt": "896dc38e08",
        "phone": "01252517108",
        "email": "jsmith@gmail.com",
        "age": 40,
        "room": (new ObjectId("5beaa2b064c5fe74a27df04c")),
        "admin": true
    },
    {
        "_id": (new ObjectId("5be2570e76e440ab73cd81a7")),
        "name": "Jen Deer",
        "username": "jford",
        "password": "526bc8a587242bd53639f1e65e4b10479426ce17bdfb37930fc048b8f2ce7992fb7348b5c14e6f995c4a37b68e8eddc24bb7908b9b7f37bce3a507ca5654095f",
        "salt": "3dbe69cb73",
        "phone": "01692660670",
        "email": "jford@gmail.com",
        "age": 45,
        "admin": false
    }
]);
db.rooms.insertMany([
    {
        "_id": (new ObjectId("5beaa2b064c5fe74a27df04b")),
        "building": "DTH",
        "address": "65/5 Dinh Tien Hoang, Hai Chau, Da Nang",
        "number": 201,
        "price": 2800000,
        "secret": "rTt8kC"
    },
    {
        "_id": (new ObjectId("5beaa2b064c5fe74a27df04c")),
        "building": "DTH",
        "address": "65/5 Dinh Tien Hoang, Hai Chau, Da Nang",
        "number": 202,
        "occupant": (new ObjectId("5be2570e76e440ab73cd81a6")),
        "price": 3000000,
        "secret": "ueM2RZ"
    },
    {
        "_id": (new ObjectId("5beaa2b064c5fe74a27df04d")),
        "building": "DTH",
        "address": "65/5 Dinh Tien Hoang, Hai Chau, Da Nang",
        "number": 101,
        "price": 4800000,
        "secret": "AfyT5s"
    },
]);