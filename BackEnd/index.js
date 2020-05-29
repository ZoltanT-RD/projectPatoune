const express = require('express');
const path = require('path');
const delay = require('delay');

const env = require('./_env');

const testData = require('./data/testData.json');


const app = express();
const port = env.WebServerPort;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(express.static(path.join(__dirname, '..//FrontEnd/build-test')));


const delayResponseSec = 2; //this is just to simulate network lagg

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..//FrontEnd/build-test', 'index.html'));
});

app.get('/api', (req, res, next) => res.send('Hello Friend, welcome to the API!'));

app.get('/api/simpleTest', (req, res, next) => res.json(testData));

app.get('/api/delayedTest', (req, res, next) => {
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