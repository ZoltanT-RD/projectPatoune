const router = require('express').Router();

const htmlBuilder = require('../../helpers/htmlBuilder');

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
                    statusCode: 200,
                    description: "serve up this page"
                }
            ]
        }
    ]
};

module.exports = router;