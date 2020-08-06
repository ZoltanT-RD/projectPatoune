const path = require('path');
const fs = require('fs');
const router = require('express').Router();

const sh = require('../../helpers/StringHelper');
const env = require('../_env');

router.route('/').get((req, res) => {

    ///fixme line below is for testing
    if (req.user){
        sh.yout(req.user.displayName);
    }

    console.warn("functionality is now limited to the API section...");
    res.redirect('/api');

});


module.exports = router;