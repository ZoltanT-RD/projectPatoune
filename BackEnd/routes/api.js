const router = require('express').Router();

const htmlBuilder = require('../helpers/htmlBuilder');

router.use('/subapi', subApiRouter);
router.use('/db', require('./api/db'));


///todo this is obviously incomplete....

///todo these routes will have to implement `isLoggedIn` middleware as well!!!

router.route('/').get((req, res) => {
    res.send(htmlBuilder.getHTML(descriptor));
});

let descriptor = {
    title: "API base route",
    basePath: "/api",
    options: [
        {
            type: "GET",
            route: "/",
            responses: [
                {
                    statusCode: 200,
                    description: "serve up this page"
                }
            ]
        {
            type: "GET",
            route: "/db",
            responses: [
                {
                    statusCode: 200,
                    description: "serve up the DataBase sub-engine."
                }
            ],
        }
    ]
};


module.exports = router;