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


//setting response Status
    //res.send("a status 200 is sent out by default");
    //res.status(404).send('Sorry, we cannot find that!')
    //res.status(500).send({ error: 'something blew up' })

//param test
router.route('/parmTests').get((req, res) => {
    res.send('pass me a "color" parameter, eg; "http://localhost:4088/sandbox/parmTest/blue"')
});
router.route('/parmTest/:color').get((req, res) => {
    res.send('you asked for <b>' + req.params.color + '</b>')
});
/*
///todo should figure out something like this for named params... https://www.google.com/search?client=firefox-b-m&q=los16+trebuchet+home+app+default+desktop&oq=los16+trebuchet+home+app+default+desktop&aqs=heirloom-srp;
router.route('/parmTest/:color+:shape').get((req, res) => {
    console.log(req.params);
    res.send('you asked for a <b>' + req.params.color + '</b>  ' + req.params.shape)
});
*/
module.exports = router;