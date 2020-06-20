const path = require('path');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');
const fs = require('fs');

const sh = require('../helpers/StringHelper');
const env = require('./_env');

const app = express();


///section check for static content
if (fs.readdirSync(path.join(__dirname, '../FrontEnd/build-test/')).length === 0){
    throw Error("the 'build-test' folder is empty! (run webpack-build-dev, then try again)");
}

///section configure webserver
const port = env.WebServerPort;
app.use(cors());
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded

///todo configure this properly...
// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
    name: 'patoune',
    keys: ['key1', 'key2']
}));

///todo revisit this bit
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

///section auth & session bits
require('./auth/googlePassportSetup');
app.use(passport.initialize());
app.use(passport.session()); //initializes passport and passport sessions



// Auth Routes
app.get('/googleAuth', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/google/callback', passport.authenticate('google',
    {
        failureRedirect: '/auth/failed'
    }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);

///section routers
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.use('/sandbox', require('./routes/sandBox'));
app.use('/', require('./routes/index')); //this has to be the last one!


///section static routes
app.use(express.static(path.join(__dirname, '..//FrontEnd/build-test/img'))); //enable static serving





///section start the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));