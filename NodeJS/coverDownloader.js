/**
 * @author Zoltan Tompa
 * @email zoltan@resdiary.com
 * @create date 2019-01-04 11:12:57
 * @modify date 2019-01-04 11:12:57
 * @desc [description]
 */

/*
//image APIs
http://ec2.images-amazon.com/images/P/<<ASIN / ISBN-10>>._SCRM_.jpg
test target= http://ec2.images-amazon.com/images/P/1942788002.01._SCRM_.jpg

amazonAPI https://images-na.ssl-images-amazon.com/images/P/1720651353.jpg //isbn10 or asin only!
  also this works;
  but both fail to find a lot...
googleAPI https://www.googleapis.com/books/v1/volumes?q=isbn:1537732730 //isbn10 or 13
https://developers.google.com/books/docs/v1/using#RetrievingBookshelf

openLib http://covers.openlibrary.org/b/isbn/0385472579-L.jpg //isbn10 or 13

*/

const fs = require('fs');
const request = require('request');
const https = require('https');

const chatty = require('./chatty');
const mimeTypes = require('./mimeTypes');
const HTTPstatusCodes = require('./HTTPstatusCodes');



const zout = {
    out: (msg) => { chatty.toConsole.out(msg) },
    debug: (msg) => { chatty.toConsole.debug(msg, moduleName) },
    info: (msg) => { chatty.toConsole.info(msg, moduleName) },
    warn: (msg) => { chatty.toConsole.warn(msg, moduleName) },
    error: (msg) => { chatty.toConsole.error(msg, moduleName) },
};

//this has to be set for every module
const moduleName = "coverDownloader";


const externalApiUrls = {
    amazon1: (isbn10) => { return `http://ec2.images-amazon.com/images/P/${isbn10}.01._SCRM_.jpg`; },
    amazon2: (isbn10) => { return `https://images-na.ssl-images-amazon.com/images/P/${isbn10}.jpg`; },
    googleJSON: (isbn) => { return `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&fields=items(volumeInfo/imageLinks)`; },
    openLib: (isbn) => { return `http://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`; }
};


//desc: this function queries the external api-s in order and tries to find a useful image
function queryExternalApis(isbn10) {

    /*
    [  LOGIC  ]
      1. check first api url
      2. if found, download and GOTO 12
      3. if not try next api url
      4. if found, download and GOTO 12
      5. call 'getGoogleApiImageUrl()' to get url
      6. if fails GOTO 10
      7. download google cover image
      8. if fails, GOTO 10
      9. GOTO 12
      10. try donwload image from openLib
      11. if fails GOTO 13
      12. add file to coverIndex GOTO 14 //bookCoverIndex.push(isbn) //no .jpg!
      13. return reject
      14. return resolve
    */

    zout.info("querying external APIs");

    let returnObj = {
        isSuccessfull: null,
        msg: null
    };

    return new Promise((resolve, reject) => {

        downloadAndSaveFile(externalApiUrls.amazon1(isbn10), `bookCovers/${isbn10}.jpg`)
            .then((resp) => {
                zout.info("download from Amazon1 was successfull!");
                bookCoverIndex.push(isbn10);
                returnObj.isSuccessfull = true;
                resolve(returnObj);
            })
            .catch((resp) => {
                zout.warn("download from Amazon1 FAILED");

                ///todo since this is throwing 403s all the time, for no reason, try to add a 5x try with 2 sec wait, if all 5 fails, then move to google

                zout.warn("tryin Google...");
                getGoogleApiImageUrl(isbn10)
                    .then((val) => {
                        downloadAndSaveFile(val.url, `bookCovers/${isbn10}.jpg`)
                            .then((val) => {
                                zout.info("download from Google was successfull!");
                                bookCoverIndex.push(isbn10);
                                returnObj.isSuccessfull = true;
                                resolve(returnObj);
                            }).catch((err) => {
                                zout.warn("download from Goolge FAILED");

                                zout.warn("tryin openLib...");

                                downloadAndSaveFile(externalApiUrls.openLib(isbn10), `bookCovers/${isbn10}.jpg`, ['fileSize']).then(
                                    (val) => {
                                        zout.info("download from openLib was successfull!");
                                        bookCoverIndex.push(isbn10);
                                        returnObj.isSuccessfull = true;
                                        resolve(returnObj);
                                    }).catch((err) => {
                                        returnObj.msg = `none of the externail APIs found the cover ${isbn10}...` + chatty.emoticons["(-_-')"];
                                        zout.error(returnObj.msg);
                                        returnObj.isSuccessfull = false;
                                        reject(returnObj);
                                    });
                            });

                    })
                    .catch((err) => {
                        zout.warn("download from Goolge FAILED");

                        zout.warn("tryin openLib...");

                        downloadAndSaveFile(externalApiUrls.openLib(isbn10), `bookCovers/${isbn10}.jpg`, ['fileSize']).then(
                            (val) => {
                                zout.info("download from openLib was successfull!");
                                bookCoverIndex.push(isbn10);
                                returnObj.isSuccessfull = true;
                                resolve(returnObj);
                            }).catch((err) => {
                                returnObj.msg = `none of the externail APIs found the cover ${isbn10}...` + chatty.emoticons["(-_-')"];
                                zout.error(returnObj.msg);
                                returnObj.isSuccessfull = false;
                                reject(returnObj);
                            });
                    });
            });
    });
};

function getGoogleApiImageUrl(isbn) {

    let returnObj = {
        isSuccessfull: null,
        msg: null,
        url: null
    };

    return new Promise((resolve, reject) => {

        if (!isbn) {
            returnObj.isSuccessfull = false;
            returnObj.msg = "isbn was not supplied!";
            reject(returnObj);
        }

        https.get(externalApiUrls.googleJSON(isbn), (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === HTTPstatusCodes.ok) {
                    try {
                        let json = JSON.parse(data);
                        // data is available here:
                        zout.info(`getGoogleApiImageUrl() - the parsed data: ${JSON.stringify(json)}`);

                        if (json.items
                            && json.items.length > 0
                            && json.items[0]
                            && json.items[0].volumeInfo
                            && json.items[0].volumeInfo.imageLinks) {

                            zout.debug("getGoogleApiImageUrl() - all base-properties are valid!!!");
                            let imageSet = json.items[0].volumeInfo.imageLinks;
                            const imageSetProps = ['extraLarge', 'large', 'medium', 'small', 'thumbnail', 'smallThumbnail'];

                            for (let index = 0; index < imageSetProps.length; index++) {
                                const element = imageSetProps[index];

                                if (imageSet[element]) {
                                    returnObj.isSuccessfull = true;
                                    returnObj.msg = `*${element}* image found! url returned: ${imageSet[element]}`;
                                    returnObj.url = imageSet[element]

                                    zout.info(`getGoogleApiImageUrl() - ${returnObj.msg}`);
                                    resolve(returnObj);
                                    return;
                                }
                            }

                            returnObj.isSuccessfull = false;
                            returnObj.msg = "error parsing imageSet!";
                            zout.error("getGoogleApiImageUrl() - " + returnObj.msg);
                            reject(returnObj);
                            return;
                        }

                        else {
                            returnObj.isSuccessfull = false;
                            returnObj.msg = "item not found";
                            zout.error("getGoogleApiImageUrl() - " + returnObj.msg);
                            reject(returnObj);
                            return;
                        }

                    } catch (e) {
                        returnObj.isSuccessfull = false;
                        returnObj.msg = "Error1 parsing Google API JSON!";
                        zout.error("getGoogleApiImageUrl() - " + returnObj.msg);
                        reject(returnObj);
                        return;
                    }
                }
                else {
                    returnObj.isSuccessfull = false;
                    returnObj.msg = `Status:, ${res.statusCode}`;
                    zout.error("getGoogleApiImageUrl() - " + returnObj.msg);
                    reject(returnObj);
                    return;
                }
            })
        }).on('error', (err) => {
            returnObj.isSuccessfull = false;
            returnObj.msg = `Error3: ${err}`;
            zout.error("getGoogleApiImageUrl() - " + returnObj.msg);
            reject(returnObj);
            return;
        });
    });
};

function downloadHandler(uri, filename, ignore = []) {

    ///todo maybe try this? https://stackoverflow.com/questions/42429590/retry-on-javascript-promise-reject-a-limited-number-of-times-or-until-success

    let failCounter = 0;

    downloadAndSaveFile(uri, filename, ignore = [])
        .then((resp) => { })
        .catch((resp) => { });


    if (failCounter < 5) {
        setTimeout(function () {
            zout.warn("trying again. with failcounter:" + failCounter++);
            downloadAndSaveFile(uri, filename, ignore, (failCounter++));
        }, 1500) //try again after 1.5 seconds

    }
}

function downloadAndSaveFile(uri, filename, ignore = []) {

    let response = {
        isSuccessfull: null,
        errors: []
    };

    zout.info(`tring to download file: ${uri}`);

    let options = {
        url: uri,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3659.0 Safari/537.36'
        }
    };

    return new Promise((resolve, reject) => {

        if (!uri || !filename) {
            response.isSuccessfull = false;
            response.errors.push("supplied function argument(s) is/are invalid!");
            zout.error("supplied function argument(s) is/are invalid!");
            reject(response);
        }

        request.head(options, (err, res, body) => {
            zout.info(`download request for ${filename} from ${uri} :`);
            zout.debug(`-target filename: "${filename}"`);

            if (!ignore.includes('statusCode')) {
                if (res.statusCode !== HTTPstatusCodes.ok) {
                    response.errors.push(`External API returned a non-ok response: (${res.statusCode})`);
                }
            }

            if (!ignore.includes('mime')) {
                if (res.headers['content-type'] !== mimeTypes.jpg) {
                    response.errors.push(`External API returned a bad MIME type: (${res.headers['content-type']})`);
                }
            }

            if (!ignore.includes('fileSize')) {
                if (!res.headers['content-length'] || res.headers['content-length'] < 1) {
                    response.errors.push(`External API returned a small file size: (${res.headers['content-length']})`);
                }
            }

            if (response.errors.length > 0) {
                response.isSuccessfull = false;
                zout.warn(`Response Rejected: ${response.errors}`);
                zout.error(`the error was: ${err}`);
                zout.error(`error body: ${body}`)
                zout.error(`error body: ${JSON.stringify(body)}`)
                reject(response);
            }
            else {
                zout.info(`Response Accepted! Downloading the file...`)
                //actually download the file
                request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
                    response.isSuccessfull = true;
                    resolve(response);
                });
            }
        });
    });
};



module.exports = {
    queryExternalApis: queryExternalApis
}