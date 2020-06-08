const path = require('path');
const fs = require('fs');

const router = require('express').Router();

const httpCodes = require('../../enums/HTTPstatusCodes');
const htmlBuilder = require('../helpers/htmlBuilder');

function getStaticFiles(type){
    let regx;
    if(type === 'css'){
        regx = /^(login\.)([\w\.])+(\.css)$/
    }
    else if (type === 'js'){
        regx = /^(login\.)([\w\.])+(\.js)$/
    }
    else{
        throw Error("invalid paramter");
    }

    const result = fs.readdirSync(path.join(__dirname, '../../FrontEnd/build-test/')).find((x) => { return x.match(regx)});

    if(!result){
        throw Error(`no ${type} found!`);
    }

    //console.log(result);
    return result;
}

const pageCSS = getStaticFiles("css");//'login.3f6c033601516626d970.css';
const pageJS = getStaticFiles("js");//'login.bundle.7f967bd7d8f69f027bf7.js';

//static file serving
router.route(`/${pageCSS}`).get((req, res) => {
    res.sendFile(path.join(__dirname, '../../FrontEnd/build-test', pageCSS));
});

router.route(`/${pageJS}`).get((req, res) => {
    res.sendFile(path.join(__dirname, '../../FrontEnd/build-test', pageJS));
});


router.route('/login').get((req, res) => {
    getStaticFiles("css");
    res.sendFile(path.join(__dirname, '../../FrontEnd/build-test', 'login.html'));
});


router.route('/googleAuth').get((req, res) => {
    res.redirect('/googleAuth');
});


router.route('/logout').get((req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/auth/login');
});

router.route('/failed').get((req, res) => {
    res.status(httpCodes._403_forbidden).send('You Failed to log in !');
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
            type: "GET",
            route: "/login",
            responses: [
                {
                    statusCode: httpCodes._200_ok,
                    description: "serve up the React-built 'login' page."
                }
            ],
        },
        {
            type: "GET",
            route: "/googleAuth",
            responses: [
                {
                    statusCode: httpCodes._318_intendedRedirect,
                    description: "redirects to server/googleAuth. this is due session limitations"
                }
            ],
        },
        ,
        {
            type: "GET",
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
                    description: "sends message 'You Failed to log in !'. used by session handler"
                }
            ],
        }
    ]
};


module.exports = router;