const fs = require('fs');

const env = require('../_env');

const sh = require('../../helpers/StringHelper');
const mh = require('../../helpers/MathHelper');
const ah = require('../../helpers/AsyncHelper');


const nano = require('nano')(`http://${env.DBUserName}:${env.DBPass}@${env.DBURL}:${env.DBPort}/${env.DBName}`);



/*
nano.db.list().then((body) => {
    // body is an array
    body.forEach((db) => {
        console.log(db);
    });
});
*/


async function uploadUsers(){

    const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

    //sh.yout(users);

    nano.bulk({ docs: users }).then((body) => {
        console.log(body);
    });

}

async function uploadBooks() {

    const books = JSON.parse(fs.readFileSync('./data/DBBooks.json', 'utf8'));

    nano.bulk({ docs: books }).then((body) => {
        console.log(body);
        console.log(",");
    });

}

async function test() {
    //await nano.insert({ _id: 'test:book2', happy: true });


    nano.get('user::aae52601-22a5-44da-85c7-0c8ff316a95e').then((body) => {
        console.log(body);
    });

    /*
    nano.get('test:book2').then((body) => {
        console.log(body);
    });
    */
}



uploadBooks();