const express = require('express');
const delay = require('delay');

const testData = require('./data/testData.json');


const app = express();
const port = 4088;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


const delayResponseSec = 2; //this is just to simulate network lagg



app.get('/', (req, res, next) => res.send('Hello Friend, welcome to the API!'));

app.get('/simpleTest', (req, res, next) => res.json(testData));

app.get('/delayedTest', (req, res, next) => {
    (async() => {
    await delay(delayResponseSec * 1000);  // Executes after 3 seconds later
        res.json(testData)
    })();
});

app.get('/parmTest', (req, res, next) => {
    (async() => {

    ///fixme parameters are currently not working! server needs to return object with requested ID. returns fixed object for now
    //example request; GET /something?color1=red&color2=blue
    //if(req.query.id && req.query.id === 'red'){}
        res.json(testData)
    })();
});




app.listen(port, () => console.log(`Example app listening on port ${port}!`));