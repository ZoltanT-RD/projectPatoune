const fs = require('fs');
const rp = require('request-promise');


const sh = require('../../helpers/StringHelper');
const mh = require('../../helpers/MathHelper');
const ah = require('../../helpers/AsyncHelper');

const BaseGetIDAPIURL = 'https://books.google.com/books?jscmd=viewapi&callback=info&bibkeys=ISBN'; //eg; https://books.google.com/books?jscmd=viewapi&callback=info&bibkeys=ISBN159184259X
const BaseGetDetailsAPIURL = 'https://www.googleapis.com/books/v1/volumes/';  //eg; https://www.googleapis.com/books/v1/volumes/jD4nC3S2xvcC

/// basically how this works is;
// 1. call the first api to get the google ID from the isbn
// 2. then call the 2nd api with the googeID to get the BookData



const missingAuthorlist3 = JSON.parse(fs.readFileSync('./missingAuthorList-3.json', 'utf8'));

async function getAuthors(asin){

    let rawGoogleIDAPIData = await rp({
        method: 'GET',
        uri: `${BaseGetIDAPIURL}${asin}`
    });

    let googleBookId = sh.getStringFromTo(rawGoogleIDAPIData, 'books?id=', 9, '\\u002',0);

    let rawGoogleDetailAPIData = await rp({
        method: 'GET',
        uri: `${BaseGetDetailsAPIURL}${googleBookId}`
    });

    //console.log(JSON.parse(rawGoogleDetailAPIData).volumeInfo.authors);

    console.log(`"${asin}":`);
    console.log(JSON.stringify(JSON.parse(rawGoogleDetailAPIData).volumeInfo.authors));
    console.log(',');
}


/*
missingAuthorlist3.forEach(async e => {
    await ah.sleep(mh.randomIntInclusiveBetween(5, 15)); //wait anywhere between 5 and 15 sec.
    await getAuthors(e);
});
*/


//test with one first
//getAuthors('159184259X');