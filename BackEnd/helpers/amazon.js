const fs = require('fs');
const path = require('path');

const rp = require('request-promise');
const htmlToJson = require('html-to-json');

const sh = require('../../helpers/StringHelper');
const mh = require('../../helpers/MathHelper');
const rh = require('./RequestHelper');
const bh = require('../../helpers/BookHelper');



const getAmazonBookCoverDirectImageURL_1 = (isbn10) => {
    //eg; `http://ec2.images-amazon.com/images/P/${1942788002}.01._SCRM_.jpg` //isbn10 or asin only!
    return `http://ec2.images-amazon.com/images/P/${isbn10}.01._SCRM_.jpg`;
};

const getAmazonBookCoverDirectImageURL_2 = (isbn10) => {
    //eg; `https://images-na.ssl-images-amazon.com/images/P/${1720651353}.jpg` //isbn10 or asin only!
    return `https://images-na.ssl-images-amazon.com/images/P/${isbn10}.jpg`;
};

const getAmazonWebPageURL = (isbn10) => {
    //eg; 'https://www.amazon.co.uk/dp/';
    return `https://www.amazon.co.uk/dp/${isbn10}`;
};

const getAmazonAPIURL = (isbn10) => {
    //eg; 'https://www.amazon.co.uk/dp/';
    return `https://www.amazon.co.uk/gp/search-inside/service-data?asin=${isbn10}&method=getBookData`;
};

///section Book Covers

exports.downloadBookCovers = downloadBookCovers;
async function downloadBookCovers(bookID, isbn10) {

    try {
        let result = await bh.validateISBN(isbn10);
        if (!result.isIsbn10){
            return Promise.reject(`The provided ISBN (${isbn10} is not a valid ISBN10!)`);
        }
    } catch (error) {
        return (error);
    }

    //call api-s in paralel. order, download images
    //rety if needed
    //keep all files with names `${bookID}_api${x}`

    //api 0
    const apiResp0 = rh.downloadImage(getAmazonBookCoverDirectImageURL_1(isbn10), path.join(__dirname, `../bookCovers/covers/variants/${bookID}_Aapi${0}.jpg`));

    //api 1
    const apiResp1 = rh.downloadImage(getAmazonBookCoverDirectImageURL_2(isbn10), path.join(__dirname, `../bookCovers/covers/variants/${bookID}_Aapi${1}.jpg`));

    //api 2+3
    const apiResp2_3 = new Promise((resolve, reject) => {
        rh.getJSON(getAmazonAPIURL(isbn10)).then(async (jsonData) =>{
        let responses = [];
        if(jsonData){
            if (jsonData["largeImageUrls"] && jsonData["largeImageUrls"]["1"]){
                responses.push(await rh.downloadImage(jsonData["largeImageUrls"]["1"], path.join(__dirname, `../bookCovers/covers/variants/${bookID}_Aapi${2}.jpg`)));
            }
            if (jsonData["jumboImageUrls"] && jsonData["jumboImageUrls"]["1"]) {
                responses.push(await rh.downloadImage(jsonData["jumboImageUrls"]["1"], path.join(__dirname, `../bookCovers/covers/variants/${bookID}_Aapi${3}.jpg`)));
            }
            if(responses.length > 0){
                return resolve(responses);
            }
            else{
                return reject("json downloaded OK, but contained no usable image data");
            }
        }
        else{
            return reject("json downloading failed");
        }});
    });

    //api 4 -> parased html
    const apiResp4 = new Promise((resolve, reject) => {
        rh.getHTML(getAmazonWebPageURL(isbn10)).then(async (rawHTML) => {
            let imageDataArray = extractImageGalleryFromRawHTML(rawHTML);
            if (imageDataArray) {
                rh.downloadImage(imageDataArray[0].mainUrl, path.join(__dirname, `../bookCovers/covers/variants/${bookID}_Aapi${4}.jpg`)).then(r => resolve(r)).catch(e => reject(e));
            }
            else{
                reject("html code had no usable image data");
            }
        }).catch(e =>{
            reject("failed to get HTML");
        });
    });


    const promises = [apiResp0, apiResp1, apiResp2_3, apiResp4];

    let finalResults = await Promise.allSettled(promises);
    //sh.yout(finalResults);
    return finalResults.find(e => { return e.status === "fulfilled" }) ? Promise.resolve("download successful") : Promise.reject("json was processed, but downloads failed!");
};


async function testDownloadBookCovers() {
    let r = await downloadBookCovers('amazontest-3', '1912599007');
    console.log("I'm the return bit here");
    console.log(r);
}
//testDownloadBookCovers();


///section HTML scraper / parser


function extractBookDescriptionFromRawHTML(html) {
    return sh.getStringFromTo(html, "bookDescEncodedData", 23, '"', 0); // 23 is the searchterm lenght + "paddign"
}

function extractDetailsFromRawHTML(text){

    raw = text.toString().trim();
    if (raw.startsWith('<li><b>')){
        let key = raw.substring(7, raw.indexOf('</b>') - 1).trim().replace(':','');
        let valueSring = raw.substring(raw.indexOf('</b>') + 4, raw.indexOf('</li>')).trim();

        if (key === 'Customer reviews'){
            value = {};
            value.stars = sh.getStringFromTo(valueSring, '<span class="a-icon-alt">', 25, '</span>',0).trim();
            let fragment = valueSring.substring(valueSring.indexOf('href="/product-reviews/'));
            value.totalCustomerRatings = parseInt(sh.getStringFromTo(fragment,'>', 1, 'customer',0).trim());
        }
        else{
            value = valueSring;
        }

        return {
            [sh.camelize(key)] : value
        };
    }
}

function extractImageGalleryFromRawHTML(html){
    try{
        return JSON.parse(sh.getStringFromTo(html, 'imageGalleryData', 20, '}],', 2));
    }
    catch (error){
        console.log(error);
        return null;
    }
}

function conditionDetails(rawDetails) {

    let details = {};
    rawDetails.forEach(element => {
        if (element) {
            details[Object.keys(element)] = element[Object.keys(element)];
        }
    });

    return details;
}

async function getBasicParseFromRawHTML(rawHTML,asin){
    let basicParse = await htmlToJson.parse(rawHTML, {
        'Book': {
            'ASIN': asin,
            'Title': function ($doc) {
                return ($doc.find('#productTitle').text().trim());
            },
            'SubTitle': function ($doc) {
                return ($doc.find('#productSubtitle').text().trim());
            },
            'Authors': {},
            'SummaryText': extractBookDescriptionFromRawHTML(rawHTML),
            'Details': [
                '#detail_bullets_id ul li', function ($item) {
                    return extractDetailsFromRawHTML($item);
                }
            ]
        }
    }).catch(e => {
        //sh.yout(e);
    });

    //console.log(basicParse);
    return basicParse;
}

exports.getInfo = getInfo;
async function getInfo(asin) {

    try {
        let result = await bh.validateISBN(asin);
        if (!result.isIsbn10) {
            return Promise.reject(`The provided ISBN (${asin} is not a valid ISBN10!)`);
        }
    } catch (error) {
        return (error);
    }


    let rawHTML = await rh.getHTML(getAmazonWebPageURL(asin)); // await getRawHTML(asin);
    //sh.yout(rawHTML);


    //sh.yout(rawHTML);
    let basicParse = await getBasicParseFromRawHTML(rawHTML,asin);

    //sh.yout(basicParse);

    basicParse.Book.Details = conditionDetails(basicParse.Book.Details);

    //basicParse.Book.Authors = rawAPIData.authorNameList;

    //console.log(basicParse);
    return Promise.resolve(basicParse);
}
//getInfo('1912599007');