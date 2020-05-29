const fs = require('fs');

const { v4: uuidv4 } = require('uuid'); //uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'


/*
    User: {
        //REQUIRED
        "id": "user::UUID",

        //REQUIRED
        "docType": "user",

        //REQUIRED
        "email": "example@resdiary.com",

        //REQUIRED
        "isAdmin": false,

        //REQUIRED
        "fullName": "Jane Doe"
    }
*/



function generateDBDocs(){

    let users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));

    let out = [];

    users.forEach(user => {
        let obj = {};
        obj["_id"] = `user::${uuidv4()}`;
        obj["docType"] = "user";
        obj["isAdmin"] = false;

        obj["email"] = user["email"].trim()
        obj["fullName"] = user["name"].trim();

        out.push(obj);

    });

    console.log(JSON.stringify(out));
}

generateDBDocs();