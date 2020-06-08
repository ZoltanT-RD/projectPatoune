const router = require('express').Router();

const htmlBuilder = require('../../helpers/htmlBuilder');
const httpCodes = require('../../../enums/HTTPstatusCodes');

///todo this is incomplete

router.route('/').get((req, res) => {
    res.send(htmlBuilder.getHTML(descriptor));
});

let descriptor = {
    title: "Database Handler Engine",
    basePath: "/db",
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
        }
    ]
};

module.exports = router;