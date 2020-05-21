const rp = require('request-promise');
const htmlToJson = require('html-to-json');
const sh = require('../../helpers/StringHelper');

const fs = require('fs');

const BaseWebURL = 'https://www.amazon.co.uk/dp/';
const BaseAPIURL = 'https://www.amazon.co.uk/gp/search-inside/service-data';

const APIHeaders = {
    'User-Agent': 'PostmanRuntime/7.21.0',
    'Accept': '*/*',
    'Cache-Control': 'no-cache',
    'Postman-Token': '5ab8f635-08ee-4294-ad26-f3169506c294',
    'Host': 'www.amazon.co.uk',
    'Cookie': 'x-wl-uid=1FXH8gA1q9bwFizAW6FAoyA5Y3QWsu9CWUVcdw+h/dbtfQcYijU6BhV+DnxkIkTYMkqcsOFk4afU=; session-id-time=2082758401l; session-id=261-1684768-1717066; ubid-acbuk=258-5357078-0450038; session-token=k+qp62WpJ/00QiZosrko1vYoX0yQ6+jBAFXIKTUZbXocPDhs6vBxeSEJ/yFb1dIcPXQHtBvqOhAUH5HQ8t2e68xQju+gVgJHgQ8A66KNASperdLuLVC8U141zTxATygZw0W+uXrGGA2DzVDsk7iQbp4FwhI/tcwD5elxEcwOxiRvKYh3Acy9zMwYOyvxv6UzratchxGnLabv6ioFfENHovCzeX1EhnALq2ldhdbzlDVr9CYkMHlN3yaeQYvpxlAktmQx0XY3IUI=',
    'Connection': 'keep-alive'
};


///todo move this to Helpers
function sleep(sec) {
    return new Promise((resolve) => {
        setTimeout(resolve, sec*1000);
    });
}


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


async function getBasicParse(rawHTML,asin){
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
            'Gallery': extractImageGalleryFromRawHTML(rawHTML),
            'SummaryText': extractBookDescriptionFromRawHTML(rawHTML),
            'Details': [
                '#detail_bullets_id ul li', function ($item) {
                    return extractDetails($item);
                }
            ]
        }
    }).catch(e => {
        //sh.yout(e);
    });

    //console.log(basicParse);
    return basicParse;
}

///todo this has to be braken up so they can be called inividually...
async function getInfo(asin) {


    console.log(`requested asin: ${asin}`);
    let rawHTML = await rp({ 'uri': `${BaseWebURL}${asin}`, headers: APIHeaders})

    //sh.yout(rawHTML);
    /*
    let rawAPIData = await rp({
        method: 'POST',
        uri: BaseAPIURL,//`${BaseAPIURL}?asin=1118960874&method=getBookData`,
        form: {
            asin: asin,
            method: 'getBookData'
        },
        //headers: APIHeaders,
        json: true // Automatically stringifies the body to JSON
    });

    return ({asin: asin, authorArray: rawAPIData.authorNameList});

    //sh.yout(rawAPIData);
*/

    //sh.yout(rawHTML);
    let basicParse = await getBasicParse(rawHTML,asin);

    //sh.yout(basicParse);

    //parse gallery
    basicParse.Book.Gallery = JSON.parse(basicParse.Book.Gallery);
    //rawAPIData.jumboImageUrls["1"]

    basicParse.Book.Details = conditionDetails(basicParse.Book.Details);

    //basicParse.Book.Authors = rawAPIData.authorNameList;

    //console.log(basicParse);
    return basicParse;
}

///todo this should be moved to a Helper module
function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const testASINList = [ //random list for testing
    '190941414X',
    '0753820161',
    '1627793518',   //api rejects response
    '1847924468',  //funny author
    '0008166099',
    '1784703931',
];


async function getMassInfo(asinArray){  //this must be run in Bash with the following command `node.exe > out.json`


/*

    const maxRetrys = asinArray.length * 3; ///todo this is soft of a cheat, but whatever...
    let count = 0;

    while (asinArray.length > 0 && count < maxRetrys) {
        let wait = randomIntFromInterval(5, 10);
        console.log(`waiting ${wait}sec...`);
        await sleep(wait); //wait anywhere between 1 and 10 sec.
        console.log(`waiting over!`);
        let element = asinArray.shift();
        console.log(element);
        count++;
        let res = await getInfo(element)
        .catch(e => {
            asinArray.push(element);
            //console.log('There has been a problem: ' + e.message);
            //throw new Error("Error: " + JSON.stringify(e))
        });

        console.log(JSON.stringify(res));
        console.log(", ");
    }
*/



    await Promise.all(asinArray.map(async asin => {
        await sleep(randomIntFromInterval(5, 15)); //wait anywhere between 1 and 10 sec.
        let res = await getInfo(asin).catch(e => {
            console.log('There has been a problem: ' + e.message);
            throw new Error("Error: " + JSON.stringify(e))
        });
        //outArray.push(res);
        console.log(JSON.stringify(res));
        console.log(", ");
        }))

}

const missingasinsWRONG = [
    'B01D25LZD0', 'B01IUPJ4K8',
    'B075M48QKK', 'B008CQA9TQ', 'B00C5SLL9Y',
    'B01M10L837', 'B077Y49KF4', 'B007L50HE6',
    'B006X2QEQS', 'B01ERQ4HU6', 'B002BWQBEE',
    'B07545NQTX', 'B002BWQBEE', 'B00AZRBLHO',
    'B01N9XFORV', 'B06X416QQ4', 'B01BLGAQAU',
    'B07FCV2VVG', 'B01KGKR6MI', 'B0052G1KW4',
    'B07FCV2VVG', 'B07Q25L5NM', 'B07BDQCQPQ',
    'B082KQYZXK'
]


const realMissingAsins = [
    '1910751693',
    '1786570661',
    '1785041851',
    '1449328342',
    '0596527357',
    '1786330334',
    '1973470756',
    '1983805912',
    '1593273894',
    '1480830445',
    '0975568612',
    '140593820X',
    '1942788290',
    '0749474114',
    '1473608996',
    '1509804374',
    '1492034142',
    '1680501232',
    '1463552432',
    '1979571740',
    '3907269586'
];




getMassInfo(realMissingAsins);


/*
getInfo('0753820161').catch(e => {
    console.log('There has been a problem: ' + e.message);
    throw new Error("Error: " + JSON.stringify(e))
});
*/

//console.log(fs.readFileSync('tmp/B01N1F24U7.html', 'utf8'));
/*
getBasicParse(fs.readFileSync('tmp/B01N1F24U7.html', 'utf8'),'B01N1F24U7');


const fullASINList = JSON.parse(fs.readFileSync('fullASINList.json', 'utf8'));
const amazonBookData = JSON.parse(fs.readFileSync('amazonBookData.json', 'utf8'));

const amazonBookDataAsin = [];
amazonBookData.forEach((e) => { amazonBookDataAsin.push(e.Book.ASIN)});

function getMissing() {

    let missing = [];
    fullASINList.forEach(element => {
        if(!amazonBookDataAsin.includes(element)){
            missing.push(element);
        }
    });
    return missing;

}
*/
//console.log(`still missing: ${getMissing().length}`);
//console.log(getMissing());
