const router = require('express').Router();

const subApiRouter = require('./api/subApi');

router.use('/subapi', subApiRouter);

///todo this is obviously incomplete....

///todo these routes will have to implement `isLoggedIn` middleware as well!!!

router.route('/').get((req, res) => {
    res.send('Hello Friend, welcome to the API!')
});


module.exports = router;