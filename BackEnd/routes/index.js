const path = require('path');
const fs = require('fs');
const router = require('express').Router();

const sh = require('../../helpers/StringHelper');
const env = require('../_env');


if(env.EnableGoogleAuth === "true"){
    const { isLoggedIn } = require('../middleware/isLoggedIn');
    router.use(isLoggedIn); //enable route-protection
}

function getStaticFiles(type) {
    let regx;
    if (type === 'css') {
        regx = /^(mainz\.)([\w\.])+(\.css)$/
    }
    else if (type === 'js') {
        regx = /^(mainz\.)([\w\.])+(\.js)$/
    }
    else {
        throw Error("invalid paramter");
    }

    const result = fs.readdirSync(path.join(__dirname, '../../FrontEnd/build-test/')).find((x) => { return x.match(regx) });

    if (!result) {
        throw Error(`no ${type} found!`);
    }

    //console.log(result);
    return result;
}

const pageCSS = getStaticFiles("css");//'mainz.3f6c033601516626d970.css';
const pageJS = getStaticFiles("js");//'mainz.bundle.7f967bd7d8f69f027bf7.js';

//static file serving
router.route(`/${pageCSS}`).get((req, res) => {
    res.sendFile(path.join(__dirname, '../../FrontEnd/build-test', pageCSS));
});

router.route(`/${pageJS}`).get((req, res) => {
    res.sendFile(path.join(__dirname, '../../FrontEnd/build-test', pageJS));
});


router.route('/').get((req, res) => {

    ///fixme line below is for testing
    if (req.user){
        sh.yout(req.user.displayName);
    }

    res.sendFile(path.join(__dirname, '../../FrontEnd/build-test', 'index.html'));

});


module.exports = router;