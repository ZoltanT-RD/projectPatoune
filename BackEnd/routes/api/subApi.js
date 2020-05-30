const router = require('express').Router();


router.route('/').get((req, res) => {
    res.send('this is SubApi !!!')
});

module.exports = router;