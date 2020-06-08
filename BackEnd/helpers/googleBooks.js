// https://developers.google.com/books/docs/v1/reference/volumes#resource

const rp = require('request-promise');
const path = require('path');

const sh = require('../../helpers/StringHelper');
const bh = require('../../helpers/BookHelper');
const rh = require('./RequestHelper');


const getGoogleIdURL = (isbn) =>{
     //eg; https://books.google.com/books?jscmd=viewapi&callback=info&bibkeys=ISBN159184259X
    return `https://books.google.com/books?jscmd=viewapi&callback=info&bibkeys=ISBN${isbn}`;
};

const getGoogleDetailsAPIURL = (GoogleBookID) => {
    //eg; https://www.googleapis.com/books/v1/volumes/jD4nC3S2xvcC
    return `https://www.googleapis.com/books/v1/volumes/${GoogleBookID}`;
};

async function getGoogleBookID(isbn) {

    try {
       await bh.validateISBN(isbn);
    } catch (error) {
        return (error);
    }

    let rawGoogleIDAPIData;
    try {
            rawGoogleIDAPIData = await rp({
            method: 'GET',
            uri: getGoogleIdURL(isbn)
        });
    } catch (err) {
        return Promise.reject(`googleIDapi failed; ${err}`);
    };

    //handle result
    let googleBookId = sh.getStringFromTo(rawGoogleIDAPIData, 'books?id=', 9, '\\u002', 0);

    ///fixme this is really hacky =S
    if (googleBookId === 'info({})'){
        return Promise.reject("book was not found in the Google system!");
    }
    else{
        return Promise.resolve(googleBookId);
    }
}

async function getGoogleBookAPIResponse(isbn) {

    //get the google book id
    let GoogleBookID = await getGoogleBookID(isbn);

    //sh.yout(GoogleBookID);

    //get the google book details
    let GoogleBookAPIResponse;
    try {
        GoogleBookAPIResponse = rh.getJSON(getGoogleDetailsAPIURL(GoogleBookID));
        //sh.yout(JSON.parse(GoogleBookAPIResponse));
        return Promise.resolve(GoogleBookAPIResponse);
    } catch (error) {
        return error;
    }
}

exports.getGoogleBookAuthors = getGoogleBookAuthors;
async function getGoogleBookAuthors(isbn) {

    //call getGoogleBookAPIResponse
    let rawGoogleIDAPIData;
    try {
        rawGoogleIDAPIData = await getGoogleBookAPIResponse(isbn);
        //sh.yout(rawGoogleIDAPIData);
    } catch (error) {
        return error;
    }

    //get the bits I need from it
    if (rawGoogleIDAPIData && rawGoogleIDAPIData.volumeInfo && rawGoogleIDAPIData.volumeInfo.authors && rawGoogleIDAPIData.volumeInfo.authors.length > 0){
        return Promise.resolve(rawGoogleIDAPIData.volumeInfo.authors);
    }
    else{
        return Promise.reject("Authors array was not found, or empty!");
    }
};


exports.downloadAllBookCovers = downloadAllBookCovers;
async function downloadAllBookCovers(bookID,isbn) {


    //call getGoogleBookAPIResponse
    let rawGoogleIDAPIData;
    try {
        rawGoogleIDAPIData = await getGoogleBookAPIResponse(isbn);
        //sh.yout(rawGoogleIDAPIData);
    } catch (error) {
        return error;
    }

    //donwload the cover
    if (rawGoogleIDAPIData && rawGoogleIDAPIData.volumeInfo && rawGoogleIDAPIData.volumeInfo.imageLinks){
        /*
        "imageLinks": {
            "smallThumbnail":   "" //Image link for small thumbnail size (width of ~80 pixels). (in LITE projection)
            "thumbnail":        "" //Image link for thumbnail size (width of ~128 pixels). (in LITE projection)
            "small":            "" //Image link for small size (width of ~300 pixels). (in LITE projection)
            "medium":           "" //Image link for medium size (width of ~575 pixels). (in LITE projection)
            "large":            "" //Image link for large size (width of ~800 pixels). (in LITE projection)
            "extraLarge":       "" //Image link for extra large size (width of ~1280 pixels). (in LITE projection)
        }
        */

        const apiPromises = [];

        if (rawGoogleIDAPIData.volumeInfo.imageLinks.smallThumbnail) {
            apiPromises.push(rh.downloadImage(rawGoogleIDAPIData.volumeInfo.imageLinks.smallThumbnail, path.join(__dirname, `../bookCovers/covers/variants/${bookID}_Gapi${0}.jpg`)));
        }
        if (rawGoogleIDAPIData.volumeInfo.imageLinks.thumbnail) {
            apiPromises.push(rh.downloadImage(rawGoogleIDAPIData.volumeInfo.imageLinks.thumbnail, path.join(__dirname, `../bookCovers/covers/variants/${bookID}_Gapi${1}.jpg`)));
        }
        if (rawGoogleIDAPIData.volumeInfo.imageLinks.small) {
            apiPromises.push(rh.downloadImage(rawGoogleIDAPIData.volumeInfo.imageLinks.small, path.join(__dirname, `../bookCovers/covers/variants/${bookID}_Gapi${2}.jpg`)));
        }
        if (rawGoogleIDAPIData.volumeInfo.imageLinks.medium) {
            apiPromises.push(rh.downloadImage(rawGoogleIDAPIData.volumeInfo.imageLinks.medium, path.join(__dirname, `../bookCovers/covers/variants/${bookID}_Gapi${3}.jpg`)));
        }
        if (rawGoogleIDAPIData.volumeInfo.imageLinks.large) {
            apiPromises.push(rh.downloadImage(rawGoogleIDAPIData.volumeInfo.imageLinks.large, path.join(__dirname, `../bookCovers/covers/variants/${bookID}_Gapi${4}.jpg`)));
        }
        if (rawGoogleIDAPIData.volumeInfo.imageLinks.extraLarge) {
            apiPromises.push(rh.downloadImage(rawGoogleIDAPIData.volumeInfo.imageLinks.extraLarge, path.join(__dirname, `../bookCovers/covers/variants/${bookID}_Gapi${5}.jpg`)));
        }

        let finalResults = await Promise.allSettled(apiPromises);
        //sh.yout(finalResults);
        return finalResults.find(e => { return e.status === "fulfilled" }) ? Promise.resolve("download successful") : Promise.reject("json was processed, but downloads failed!");
    }
    else{
        return Promise.reject("json was processed, but had no usable image-data");
    }
}