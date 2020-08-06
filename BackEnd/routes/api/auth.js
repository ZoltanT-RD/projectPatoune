
const router = require('express').Router();
//const passport = require('passport');

const httpCodes = require('../../../enums/HTTPstatusCodes');
const htmlBuilder = require('../../helpers/htmlBuilder');

const env = require('../../_env');

require('../../auth/authHandler');

/*
///fixme can't figure out how to make these work here... they're in the main server.js file for now
router.route('/login').get((req, res) => {
    .
    .
    .
});

router.route('/googleCallback').get((req, res) => {
    .
    .
    .
});

*/

///todo need to figure out where to send the user after logout...
router.route('/logout').get((req, res) => {
    // this is clearly a hack, but apperantly, there's no other "proper way"!!! Google needs to get its sh*t togherher man....
    res.send(`
    <html>
        <body onload='window.location.replace("${env.BackendServerBaseURL}:${env.BackendServerPort}/api");'>
            logging you out...
            <img style="display:none" src="https://www.google.com/accounts/Logout" />
        </body>
    </html>`);
});


router.route('/failed').get((req, res) => {
    res.status(httpCodes._403_forbidden).send('You Failed to log in!');
});


router.route('/').get((req, res) => {
    res.send(htmlBuilder.getHTML(descriptor));
});


let descriptor = {
    title: "Auth Handler Engine",
    basePath: "/auth",
    options: [
        {
            type: "GET",
            route: "/",
            responses: [
                {
                    statusCode: httpCodes._200_ok,
                    description: "serve up this page"
                }
            ]
        },
        {
            type: "GET (SHOULD BE POST !!!)",
            route: "/login",
            responses: [
                {
                    statusCode: httpCodes._200_ok,
                    description: "serve up Google 'login' page."
                }
            ],
        },
        {
            type: "GET",
            route: "/googleCallback",
            responses: [
                {
                    //statusCode: httpCodes._318_intendedRedirect,
                    description: "this is internal only, don't use this, does nothing useful"
                }
            ],
        },
        ,
        {
            type: "GET (should be DELETE?)",
            route: "/logout",
            responses: [
                {
                    statusCode: httpCodes._318_intendedRedirect,
                    description: "terminates the active session, and redirects to server/googleAuth."
                }
            ],
        },
        {
            type: "GET",
            route: "/failed",
            responses: [
                {
                    statusCode: httpCodes._403_forbidden,
                    description: "sends message 'You Failed to log in !'"
                }
            ],
        }
    ]
};


module.exports = router;