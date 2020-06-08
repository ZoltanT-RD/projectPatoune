const path = require('path');
const fs = require('fs');

const sh = require('../../../helpers/StringHelper');
const ah = require('../../../helpers/AsyncHelper');
const mh = require('../../../helpers/MathHelper');

const BookCoverEngine = require('../bookCoverEngine');

const books = JSON.parse(fs.readFileSync('../../db/DBBooks.json', 'utf8'));

const conversionArray = books.map(x => { return { bookID: x._id, isbn10: x.externalIDs["ISBN-10"]}});
let completedArray = [];


async function tryGetCovers(fromIndex,toIndex) {
    for (let i = fromIndex; i < toIndex; i++) {
        const element = conversionArray[i];
        console.log(`processing ${i}st/nd/th element`);

        if (!BookCoverEngine.isCoverAvailableLocally(element.bookID)){
            try {
                await BookCoverEngine.tryFetchNewCover(element.isbn10, element.bookID);
                let result = { bookID: element.isbn10, isbn10: element.bookID, isDownloadOK: true };
                completedArray.push(result);
                sh.yout(result);
            } catch (error) {
                console.log(error);
                let result = { bookID: element.isbn10, isbn10: element.bookID, isDownloadOK: false };
                completedArray.push(result);
                sh.yout(result);
            }

            let waitSec = mh.randomIntInclusiveBetween(4, 28);
            console.log(`sleeping for ${waitSec}s`);
            await ah.sleep(waitSec);

        }
        else{
            console.log("we already have the one below locally!");
            sh.yout(element);
        }

    }

    console.log(`Download done`)
    sh.yout(completedArray);
    //fs.writeFileSync('resultLog-9.json', JSON.stringify(completedArray));
}



//tryGetCovers(0, conversionArray.length - 1);//conversionArray.length -1);