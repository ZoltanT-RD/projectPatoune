/// to use curl to run through the provided array of url-s, and grab the content from the pre-set fields (html id-s)



//const https = require('https');
//const request = require('request');
const rp = require('request-promise');

const htmlToJson = require('html-to-json');

const BaseURL = 'https://www.amazon.co.uk/dp/';
const ASINList = [ //random list for testing
    '190941414X',
    '0753820161',
    '1627793518',
    '1847924468',
    '0008166099',
    '1784703931',
];

/*
function run() {

    https.get('https://www.amazon.co.uk/dp/190941414X', (resp) => {
        let data = '';

        resp.setEncoding('utf8');
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            //console.log(data);
            test6(data);
        });

    }).on("error", (err) => {
        throw new Error("Error: " + err.message);
        //console.log("Error: " + err.message);
    })
}

function mineData() {
    console.log("html mining baby!");

    htmlToJson.parse('<div>content</div>', {
        'text': function ($doc) {
            return $doc.find('div').text();
        }
    })
        .done((result) => {
            console.log(result);
        });

}

function test3() {
    htmlToJson.request('https://www.amazon.co.uk/dp/190941414X', {
        'images': ['img', function ($img) {
            return $img.attr('src');
        }]
    }, function (err, result) {
        console.log(result);
    });
}


function test4() {
    htmlToJson.request('https://www.amazon.co.uk/dp/190941414X', {
        socialInfo: ['#productTitle', {
            'bookTitle': function ($link) {
                return $link.text().trim();
            },
            'link': function ($link) {
                return $link.attr('href');
            }
        }]
    }, function (err, result) {
        console.log(result);
    });
}

function test5() {
    htmlToJson.request('https://www.amazon.co.uk/dp/190941414X', {
        bookInfo: [
            '#productTitle', {
                'Title': function ($link) {
                    return $link.text().trim();
                }
            },
            '#productTitle', {
                'Title2': function ($link) {
                    return $link.text().trim();
                }
            },
            '#productSubtitle', {
                'SubTitle': function ($link) {
                    return $link.text().trim();
                }
            }
        ]
    }, function (err, result) {
        console.log(result);
    });
}

/*
function test6(){
    return htmlToJson.batch(, {
        bookInfo: [
            '#productTitle', {
                'Title': function ($link) {
                    return $link.text().trim();
                }
            },
            '#productTitle', {
                'Title2': function ($link) {
                    return $link.text().trim();
                }
            },
            '#productSubtitle', {
                'SubTitle': function ($link) {
                    return $link.text().trim();
                }
            }
        ]
})}

function test10() {
    request('https://www.amazon.co.uk/dp/190941414X', function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    });
}

function test11() {

    return rp('https://www.amazon.co.uk/dp/190941414X')
        .then(function (htmlString) {

            htmlToJson.parse(htmlString, {
                socialInfo: ['#productTitle', {
                    'bookTitle': function ($link) {
                        return $link.text().trim();
                    }
                }]
            }, function (err, result) {
                console.log(result);
            });

        })
        .catch(function (err) {
            // Crawling failed...
        });

};
*/
// *************************************************************************************** //

function extractBookDescriptionFromRawHTML(html) {
    let begin = html.indexOf('bookDescEncodedData') + 23; // 23 is the searchterm lenght + "paddign"
    let end = html.indexOf('"', begin);

    return html.substring(begin, end);//  "bookDescriptionAvailableHeight"
}

function test12() {

    rp('https://www.amazon.co.uk/dp/190941414X')
        .then(function (html) {

            htmlToJson.parse(html, {
                'Book': {
                    'Title': function ($doc) {
                        return ($doc.find('#productTitle').text().trim());
                    },
                    'SubTitle': function ($doc) {
                        return ($doc.find('#productSubtitle').text().trim());
                    },
                    'Authors':
                        ['.author a', function ($item) {
                            return ({ 'Name': $item.text().trim(), 'url': $item.attr('href').trim() });
                        }],
                    'SummaryText': extractBookDescriptionFromRawHTML(html)
                }
            }).then((res, err) => {
                console.log(res);
                console.log(JSON.stringify(res));
            }).catch((err)=> {
                throw new Error("Error: " + JSON.stringify(err));
            });
        })
        .catch((err) => {
            throw new Error("Error: " + JSON.stringify(err));
        });
}


test12();