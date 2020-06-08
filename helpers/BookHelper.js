const ISBN = require('isbn3');

exports.getFilenameFromFullBookID = function (fullBookID) {
    //eg; "_id": "book::6b9ff436-47f8-4507-93ec-d9b6af80bfd7"
    //retuns "6b9ff436-47f8-4507-93ec-d9b6af80bfd7"
    return fullBookID.substr(6);
}

exports.validateISBN = function (isbn) {
    let parsedISBN = ISBN.parse(isbn);

    if (!parsedISBN) {
        return Promise.reject("isbn is INVALID");
    }
    else{
        return Promise.resolve(parsedISBN);
    }
}
