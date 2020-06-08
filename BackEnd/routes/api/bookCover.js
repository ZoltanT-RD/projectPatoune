const path = require('path');
const router = require('express').Router();

const sh = require('../../../helpers/StringHelper');
const htmlBuilder = require('../../helpers/htmlBuilder');
const httpCodes = require('../../../enums/HTTPstatusCodes');

const bookCoverEngine = require('../../bookCovers/bookCoverEngine');

let descriptor = {
    title: "Book Cover Engine",
    basePath: "/api/bookCover",
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
            route: "/{bookID}",
            responses: [
                {
                    statusCode: httpCodes._200_ok,
                    description: "serve up the cover for the book with that ID"
                },
                {
                    statusCode: httpCodes._404_notFound,
                    description: "send back 'Sorry, we cannot find that!'"
                }
            ],
        },
        {
            type: "POST",
            route: "/tryFetchNewCover",
            notes: "this is MASSIVELY untested!!!",
            responses: [
                {
                    statusCode: httpCodes._200_ok,
                    description: "Cover FOUND, and now available!"
                },
                {
                    statusCode: httpCodes._400_badRequest,
                    description: 'Bad Request! need to POST the following JSON {"isbn10":"bookisbn number here", "bookID":"internalBookUUID"}'
                },
                {
                    statusCode: httpCodes._404_notFound,
                    description: 'Sorry, we cannot find that!'
                },
                {
                    statusCode: httpCodes._409_conflict,
                    description: 'This cover already exists, no need to download it again!'
                }
            ],
        }
    ]
};

router.route('/:bookID').get((req, res) => {
    let coverFileName = bookCoverEngine.isCoverAvailableLocally(req.params.bookID);
    if (coverFileName) {
        res.sendFile(path.join(__dirname, '../../bookCovers/covers', coverFileName));
    }
    else {
        res.status(httpCodes._404_notFound).send('Sorry, we cannot find that! If you want to request it, send a POST (see BookCoverAPI)');
    }
});

router.route('/tryFetchNewCover').post(async (req, res) => {

    console.log("reqest body below:");
    sh.yout(req.body);

    if (req.body.isbn10 && req.body.bookID) {

        //check if it doesn't already exist
        if (bookCoverEngine.isCoverAvailableLocally(req.body.bookID)) {
            res.status(httpCodes._409_conflict).send('This cover already exists, no need to download it again!');
        }
        else {
            try {
                await bookCoverEngine.tryFetchNewCover(req.body.isbn10, req.body.bookID);
                res.send("Cover FOUND, and now available!");
            } catch (error) {
                res.status(httpCodes._404_notFound).send('Sorry, we cannot find that!');
            }
        }
    }
    else {
        res.status(httpCodes._400_badRequest).send('Bad Request! need to POST the following JSON {"isbn10":"bookisbn number here", "bookID":"internalBookUUID"}');
    }
});

router.route('/').get((req, res) => {
    res.send(htmlBuilder.getHTML(descriptor));
});

module.exports = router;