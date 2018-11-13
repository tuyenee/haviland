db.haviland.drop();
db.users.insertMany([
    {
        "_id": (new ObjectId("5be2570e76e440ab73cd81a6")),
        "name": "John Doe",
        "username": "jsmith",
        "password": "fcccb02b53f4bcba0c5ec3bc209f6c6a629b44cfb38ec91cbfc3078214398bfcfaac154442cc5eab0d0ff226f7bfbd19ae7f82ac26ef9f056ffc5fb32b994ad8",
        "salt": "896dc38e08",
        "phone": "01252517108",
        "email": "jsmith@gmail.com",
        "age": 40,
        "admin": true
    },
    {
        "_id": (new ObjectId("5be2570e76e440ab73cd81a7")),
        "name": "Jen Deer",
        "username": "jford",
        "password": "61f0d30fd44f23cef1309205ec4392424eb5760225bafe4bb7166f9efe2bba9b094b03acc9c9c5df17a0c466e80628e2a1941f7b73a273c0b858dfbd955942fb",
        "salt": "3dbe69cb73",
        "phone": "01692660670",
        "email": "jford@gmail.com",
        "age": 45,
        "admin": false
    }
]);
db.rooms.insertMany([
    {
        "building": "DTH",
        "address": "65/5 Dinh Tien Hoang, Hai Chau, Da Nang",
        "number": 201,
        "price": 2800000,
        "secret": "rTt8kC"
    },
    {
        "building": "DTH",
        "address": "65/5 Dinh Tien Hoang, Hai Chau, Da Nang",
        "number": 202,
        "occupant": "5be2570e76e440ab73cd81a6",
        "price": 3000000,
        "secret": "ueM2RZ"
    },
    {
        "building": "DTH",
        "address": "65/5 Dinh Tien Hoang, Hai Chau, Da Nang",
        "number": 101,
        "price": 4800000,
        "secret": "AfyT5s"
    },
]);