const router = require('express').Router();

const htmlBuilder = require('../../helpers/htmlBuilder');
const httpCodes = require('../../../enums/HTTPstatusCodes');

const LibrabyConnector = require('../../db/connectors/LibraryConnector');

router.route('/').get((req, res) => {
    res.send(htmlBuilder.getHTML(descriptor));
});


router.route('/pages/library').get(async (req, res) => {


    /*
        itemsFrom [defaults to 0]
        itemsTo []
        searchTerm  [defaults to *]

        isRequested  [defaults to true]
        isOrdered [defaults to true]
        isAvailable [defaults to true]
        isDeclined [defaults to true]

        //admins only
        isVerifiedImport [defaults to true]
        isUnconfirmed [defaults to false]
    */

    try {
        let a = await LibrabyConnector.getResults(req.query);
        res.send(a);
    } catch (e) {
        console.log(e);
    }


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
        },
        {
            type: "GET",
            route: "/pages/library? params",
            params: [
                "itemsFrom[defaults to 0]",
                "itemsTo[]",
                "searchTerm[defaults to *]",

                "requested[defaults to true]",
                "ordered[defaults to true]",
                "available[defaults to true]",
                "declined[defaults to true]",

                //admins only ||
                "isVerifiedImport[defaults to true]",
                "unconfirmed[defaults to false]"
            ],
            responses: [
                {
                    statusCode: httpCodes._200_ok,
                    description: "serve up this page"
                }
            ],
            notes: ""

        }
    ]
};

module.exports = router;