const fs = require('fs');

const { v4: uuidv4 } = require('uuid'); //uuidv4(); //eg '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const rp = require('request-promise');

const sh = require('../../../helpers/StringHelper');
const { BookRequestStatus } = require('../../../enums/BookRequestStatus');
const env = require('../../_env');


async function getGoogleBooksID(isbn){
    let rawGoogleIDAPIData = JSON.parse(
        sh.getStringFromTo(await rp({
            method: 'GET',
            uri: env.getGoogleBooksInfoAPIURL(isbn)
        }).catch((e) => {
            throw new Error(e);
        }),
        'info(', 5, ')', 0)
    );

    if (rawGoogleIDAPIData[`ISBN${isbn}`]){
        let gid = sh.getStringFromTo(rawGoogleIDAPIData[`ISBN${isbn}`].info_url, `?id=`, 4, `&source`, 0);
        //console.log(gid);
        return (gid);
    }
    else{
        //console.log("GBid not found!");
        return null;
    }
}


async function generateDBDocs() {

    let books = JSON.parse(fs.readFileSync('../../bookDataScraper/data/bookDataAndAuthor-merged.json', 'utf8'));

    let csv = JSON.parse(fs.readFileSync('../../bookDataScraper/data/bookCSVData.json', 'utf8'));

    let DBUsers = JSON.parse(fs.readFileSync('../DBUsers.json', 'utf8'));



    let out = [];

    //let b = books[0];

    for (let index = 0; index < books.length; index++) {
        const b = books[index];

        let book = b["Book"];

        let csvBook = csv.find((b) => { return b["Calculated-ASIN"] == book["ASIN"] });

        if (!csvBook) {
            throw new Error(`${book["ASIN"]} was not found in the CSV file`)
        }

        let GoogleBooksID = await getGoogleBooksID(book["ASIN"].toString());

        let DBUser = DBUsers.find((u) => { return u["email"] == csvBook["UserEmail-linked"] });

        if (!DBUser) {
            throw new Error(`User with the email ${csvBook["UserEmail-linked"]} was not found in the DB!!!`)
        }


        let obj = {};

        obj["_id"] = `book::${uuidv4()}`;
        obj["docType"] = "book";

        obj["title"] = book["Title"];
        obj["userProvidedTitle"] = csvBook["userProvided-BookTitle"].trim() == book["Title"] ? null : csvBook["userProvided-BookTitle"].trim();
        obj["subTitle"] = '';

        obj["summaryText"] = book["SummaryText"].trim();
        obj["authors"] = book["Authors"];
        obj["userProvidedAuthors"] = csvBook["UserProvided-Authors"].trim();



        obj["externalIDs"] = {
            "ISBN-10": book["ASIN"].toString(),
            "ISBN-13": null,    ///todo this needs googleAPI
            "ASIN": book["ASIN"].toString(),
            "GoogleBooksID": GoogleBooksID
        };

        obj["details"] = {
            "edition": book["SubTitle"].trim(),
            "pageCount": book["Details"]["Paperback"] ? book["Details"]["Paperback"] : book["Details"]["Hardcover"],
            "publisher": book["Details"]["Publisher"],
            "language": book["Details"]["Language"],
            "productDimensions": book["Details"]["ProductDimensions"],
            "amazonCustomerReviews": {
                stars: book["Details"]["CustomerReviews"]["totalCustomerRatings"] ? book["Details"]["CustomerReviews"]["stars"] : null,
                totalCount: book["Details"]["CustomerReviews"]["totalCustomerRatings"]
            }
        },

            obj["isVerifiedImport"] = false,


            obj["request"] = {
                "createdTimeStamp": csvBook["UNIX timeStamp"],
                "byUserID": DBUser["_id"],
                "byUserEmail": csvBook["UserEmail-linked"],
                "status": BookRequestStatus.unconfirmed,

                "userProvidedAmazonURL": csvBook["UserProvided-URL"],
                "userComment": "",
                "adminComment": ""
            }

        //out.push(obj);
        console.log(JSON.stringify(obj));
        //sh.yout(obj);

    }


    //sh.yout(out);
    //console.log(JSON.stringify(out));

}

generateDBDocs();