const router = require('express').Router();

const ah = require('../../helpers/AsyncHelper');

const testData = require('../db/tmp/testData.json');

router.route('/').get((req,res)=>{
    res.send('this is the SandBox route!')
});

router.route('/sb').get((req, res) => {
    res.send('this is the SandBox/sb !!')
});

//delay response
router.route('/delayedTest').get((req, res) => {

    (async () => {
        let t = 5;
        await ah.sleep(t);
        res.json({what: "test data!", delayedBy: `${t}sec`});
    })();

});

//retrurn static json
router.route('/staticJSON').get((req, res) => {
    res.json(testData);
});


//param test
    ///fixme parameters are currently not working!
router.route('/parmTest').get((req, res) => {
    (async () => {
        //example request; GET /something?color1=red&color2=blue
        //if(req.query.id && req.query.id === 'red'){}
        res.json(testData)
    })();
});





module.exports = router;