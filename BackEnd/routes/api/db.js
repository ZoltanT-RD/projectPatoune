const router = require('express').Router();

const htmlBuilder = require('../../helpers/htmlBuilder');
const httpCodes = require('../../../enums/HTTPstatusCodes');

const LibrabyConnector = require('../../db/connectors/LibraryConnector');

router.route('/').get((req, res) => {
    res.send(htmlBuilder.getHTML(descriptor));
});


router.route('/pages/library').get(async (req, res) => {

    let a = await LibrabyConnector.getResults(req.query);
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

    res.send(JSON.stringify(a));
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

                "isRequested[defaults to true]",
                "isOrdered[defaults to true]",
                "isAvailable[defaults to true]",
                "isDeclined[defaults to true]",

                //admins only ||
                "isVerifiedImport[defaults to true]",
                "isUnconfirmed[defaults to false]"
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