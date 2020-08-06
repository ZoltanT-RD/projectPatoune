const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const passport = require('passport');
require("./auth/authHandler");

const sh = require('../helpers/StringHelper');
const env = require('./_env');

const app = express();



///section configuration
const port = env.BackendServerPort;
app.use(cors());
///todo this is built in now, look it up/update it
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(passport.initialize());


///fixme these should be in api/auth but can't figure out how to make it work there...
app.get('/api/auth/login',
    passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));

app.get('/api/auth/googleCallback', function (req, res, next) {
    passport.authenticate('google', { session: false }, function (err, user, info) {

        if (err) {
            res.redirect('/api/auth/failed');
        }
        else if (!user) {
            res.redirect('/api/auth/login');
        }
        else if (user) {
            console.log(user);
            res.json({ loggedIn: true })
        }
        else {
            res.redirect('/api/auth/failed');
        }
    })(req, res, next);
});


///section routers
app.use('/auth', require('./routes/api/auth'));
app.use('/api', require('./routes/api'));
app.use('/sandbox', require('./routes/sandBox'));
app.use('/', require('./routes/index'));


///section start the server
app.listen(port, () => console.log(`BackEnd server listening on port ${port}!`));