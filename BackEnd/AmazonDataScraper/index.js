const rp = require('request-promise');
const htmlToJson = require('html-to-json');
const sh = require('../../helpers/StringHelper');

const BaseURL = 'https://www.amazon.co.uk/dp/';
const ASINList = [ //random list for testing
    '190941414X',
    '0753820161',
    '1627793518',
    '1847924468',
    '0008166099',
    '1784703931',
];


function extractBookDescriptionFromRawHTML(html) {
    let begin = html.indexOf('bookDescEncodedData') + 23; // 23 is the searchterm lenght + "paddign"
    let end = html.indexOf('"', begin);

    return html.substring(begin, end);
}

function extractDetails(text){

    raw = text.toString().trim();
    if (raw.startsWith('<li><b>')){
        let key = raw.substring(7, raw.indexOf('</b>') - 1).trim().replace(':','');
        let valueSring = raw.substring(raw.indexOf('</b>') + 4, raw.indexOf('</li>')).trim();

        if (key === 'Customer reviews'){
            value = {};
            value.stars = valueSring.substring(valueSring.indexOf('<span class="a-icon-alt">') + 25, valueSring.indexOf('</span>')).trim();

            let fragment = valueSring.substring(valueSring.indexOf('href="/product-reviews/'));
            value.totalCustomerRatings = parseInt(fragment.substring(fragment.indexOf('>') + 1, fragment.indexOf('customer')).trim());
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

    let begin = html.indexOf('imageGalleryData') + 20; // 23 is the searchterm lenght + "paddign"
    let end = html.indexOf('}],', begin) + 2;

    let out = html.substring(begin, end)

    return (out);
}

function getInfo(asin) {

    rp(`${BaseURL}${asin}`)
        .then(function (html) {

            htmlToJson.parse(html, {
                'Book': {
                    'Title': function ($doc) {
                        return ($doc.find('#productTitle').text().trim());
                    },
                    'SubTitle': function ($doc) {
                        return ($doc.find('#productSubtitle').text().trim());
                    },
                    'Authors': [
                        '#bylineInfo .author .a-link-normal', function ($item) {
                            sh.yout($item);
                            return ({ 'Name': $item.text().trim(), 'Url': $item.attr('href').trim() });
                        }
                    ],
                    'Gallery': extractImageGalleryFromRawHTML(html),
                    'SummaryText': extractBookDescriptionFromRawHTML(html),
                    'Details': [
                        '#detail_bullets_id ul li', function ($item) {
                            return extractDetails($item);
                        }
                    ]
                }
            }).then((res, err) => {
                return(conditionResult(res));
            }).catch((err)=> {
                throw new Error("Error: " + JSON.stringify(err));
            });
        })
        .catch((err) => {
            throw new Error("Error: " + JSON.stringify(err));
        });
}

function conditionResult(results){

    let details = {};
    results.Book.Details.forEach(element => {
        if(element){
            details[Object.keys(element)] = element[Object.keys(element)];
        }
    });
    results.Book.Details = details;
    results.Book.Gallery = JSON.parse(results.Book.Gallery);

    sh.yout(results);

}

///fixme Author field is still broken with some books, eg this one;
getInfo('1847924468');