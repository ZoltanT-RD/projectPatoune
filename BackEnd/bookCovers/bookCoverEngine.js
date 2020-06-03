const path = require('path');
const fs = require('fs');

const imageSizeProbe = require('probe-image-size');

const sh = require('../../helpers/StringHelper');
const bh = require('../../helpers/BookHelper');

const amazon = require('../helpers/amazon');
const google = require('../helpers/googleBooks');

let storedCoversArray = fs.readdirSync(path.join(__dirname, './covers/'));
/*
    + read in the folder content - build an array (use function, so it can be re-run laterif needed)
    + add check function to see if requested cover exists (then let route serve it up)
        - return false if not found (let route serve up 404)
    - add function to search for cover, download it, add it to the list
*/

async function getBiggestDimension(filename){


    let imageFileStream = fs.createReadStream(`./covers/variants/${filename}`);

    try {
        let result = await imageSizeProbe(imageFileStream);
        imageFileStream.destroy();

       // console.log(`looking at ${filename}`);
       // console.log(result);

        if (result.width > result.height) {
            return result.width;
        }
        else {
            return result.height;
        }
    } catch (error) {
        imageFileStream.destroy();
    }
}


async function findLargestImage(bookIDStub) {

    //list all the files in ./variants that thas the requested filenameStub
    let allFileArray = fs.readdirSync(path.join(__dirname, './covers/variants/'));
    //sh.yout(allFileArray);
    let matchingFileArray = allFileArray.filter(f => { return sh.getStringTill(f, "_") === bookIDStub});
    //sh.yout(matchingFileArray);

    //loop through all of them, poking at the image dimensions; pick the bigger value from W or H; return the biggest filename
    let biggestImage = { filename: matchingFileArray[0], biggestDimension: await getBiggestDimension(matchingFileArray[0])};
    //sh.yout(biggestImage);

    for (let i = 1; i < matchingFileArray.length; i++) {
        const element = matchingFileArray[i];
        const currentElementSize = await getBiggestDimension(element);
        if (currentElementSize > biggestImage.biggestDimension){
            biggestImage = { filename: element, biggestDimension: currentElementSize};
        }
    }

    //sh.yout(biggestImage);

    return biggestImage.filename;
}


function getTestData(){
    amazon.downloadBookCovers('99999999-9999-9999-9999-999999999999','1912599007');
    google.downloadAllBookCovers('99999999-9999-9999-9999-999999999999', '1912599007');
}
//getTestData();


exports.isCoverAvailableLocally = isCoverAvailableLocally;
function isCoverAvailableLocally(bookID){
    //eg; "_id": "book::6b9ff436-47f8-4507-93ec-d9b6af80bfd7",

    return storedCoversArray.find((x) => { return (sh.getStringTill(x,".") === bh.getFilenameFromFullBookID(bookID) ? x : null)});
}


exports.tryFetchNewCover = tryFetchNewCover;
async function tryFetchNewCover(isbn10,bookID){

    // download images from google and amazon
    const targetFileName = bh.getFilenameFromFullBookID(bookID);

    const amazonResponse = amazon.downloadBookCovers(targetFileName, isbn10);
    const googleResponse = google.downloadAllBookCovers(targetFileName, isbn10);

    let apiResponses = await Promise.allSettled([amazonResponse,googleResponse]);
    //sh.yout(apiResponses);
    if(!apiResponses.find(e => { return e.status === "fulfilled" })){
        return Promise.reject("APIs found no usable image");
    };

    // pick the biggest file from the downloaded ones
    let biggestImage = await findLargestImage(targetFileName);
    //sh.yout(biggestImage);

    //copy the biggest file from ./variants to ./
    //fs.copyFileSync(`./covers/variants/${biggestImage}`, `./covers/${sh.getStringTill(biggestImage, "_")}.jpg`);
    await fs.copyFile(`./covers/variants/${biggestImage}`, `./covers/${sh.getStringTill(biggestImage, "_")}.jpg`, (err) => {
            if (err) throw err;
        console.log(`file ${biggestImage} copied to main folder.`);
        });

    //add to active array
    storedCoversArray.push(`${sh.getStringTill(biggestImage, "_")}.jpg`);

    return Promise.resolve(`requested cover for bookID ${bookID} is now available through the API`);
}

//tryFetchNewCover('1909414786', 'book::09408bc4-b300-4f88-b513-1befa7dc9e05');

//getBiggestDimension('09408bc4-b300-4f88-b513-1befa7dc9e05_Aapi3.jpg');

//findLargestImage('8409e83e-cda3-47de-bfae-9464e0762f5f');