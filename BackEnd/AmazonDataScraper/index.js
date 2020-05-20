const rp = require('request-promise');
const htmlToJson = require('html-to-json');
const sh = require('../../helpers/StringHelper');

const BaseWebURL = 'https://www.amazon.co.uk/dp/';
const BaseAPIURL = 'https://www.amazon.co.uk/gp/search-inside/service-data';


function extractBookDescriptionFromRawHTML(html) {
    return sh.getStringFromTo(html, "bookDescEncodedData", 23, '"', 0); // 23 is the searchterm lenght + "paddign"
}

function extractDetails(text){

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
    return sh.getStringFromTo(html, 'imageGalleryData', 20, '}],', 2);
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

async function getInfo(asin) {

    let rawHTML = await rp(`${BaseWebURL}${asin}`);
    let rawAPIData = await rp({
        method: 'POST',
        uri: BaseAPIURL,
        form: {
            asin: asin,
            method: 'getBookData'
        },
        json: true // Automatically stringifies the body to JSON
    });

    //sh.yout(rawAPIData);

    let basicParse = await htmlToJson.parse(rawHTML, {
        'Book': {
            'Title': function ($doc) {
                return ($doc.find('#productTitle').text().trim());
            },
            'SubTitle': function ($doc) {
                return ($doc.find('#productSubtitle').text().trim());
            },
            'Authors': {},
            'Gallery': extractImageGalleryFromRawHTML(rawHTML),
            'SummaryText': extractBookDescriptionFromRawHTML(rawHTML),
            'Details': [
                '#detail_bullets_id ul li', function ($item) {
                    return extractDetails($item);
                }
            ]
        }
    });

    //parse gallery
    basicParse.Book.Gallery = JSON.parse(basicParse.Book.Gallery);
    //rawAPIData.jumboImageUrls["1"]


    basicParse.Book.Details = conditionDetails(basicParse.Book.Details);

    basicParse.Book.Authors = rawAPIData.authorNameList;

    //sh.yout(basicParse);

    return basicParse;
}


const ASINList = [ //random list for testing
    '190941414X',
    '0753820161',
    '1627793518',   //api rejects response
    '1847924468',  //funny author
    '0008166099',
    '1784703931',
];


getInfo('1784703931').catch(e => {
    console.log('There has been a problem: ' + e.message);
    throw new Error("Error: " + JSON.stringify(e))
});
