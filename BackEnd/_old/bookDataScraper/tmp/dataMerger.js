const fs = require('fs');

const sh = require('../../../helpers/StringHelper');
const mh = require('../../../helpers/MathHelper');
const ah = require('../../../helpers/AsyncHelper');


let bookData = JSON.parse(fs.readFileSync('./data/merged.json', 'utf8'));
const authorData = JSON.parse(fs.readFileSync('./data/authorDataKeyValue.json', 'utf8'));



function merge() {
    let errorAsins = [];

    let outArray = [];

    bookData.forEach((book) => {


            let ad = authorData[book.Book.ASIN];
            if (ad) {
                book.Book.Authors = ad;
                outArray.push(book);
            }
            else {
                errorAsins.push(book.Book.ASIN);
            }


    });

    console.log(JSON.stringify(bookData));

    console.log("**************");
    if (errorAsins.length > 0){
        console.log(`failed: ${errorAsins.length}`);
        console.log(`failed: ${errorAsins}`);
    }
    else{
        console.log("all merging worked");
    }
}

function hasAuthor(book) {
    return (Array.isArray(book.Book.Authors) && book.Book.Authors.length > 0);

}


function getBooksWithNoAuthor() {
    let count = 0;
    bookData.forEach((book) => {
        if (!hasAuthor(book)) {
            count++;
            console.log(book.Book.ASIN);
        }
    });

    console.log("**************");
    console.log(`missing entries: ${count} of ${bookData.length}`);
}

//**********************
//getBooksWithNoAuthor();

merge();