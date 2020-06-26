const env = require('../../_env');

const nano = require('nano')(`http://${env.DBUserName}:${env.DBPass}@${env.DBURL}:${env.DBPort}/${env.DBName}`);


const testData1 = require('./testData1.json');

/*
        itemsFrom [defaults to 0]
        itemsTo [defaults to max, if value bigger then max, then max]
        searchTerm  [defaults to *]

        isRequested  [defaults to true]
        isOrdered [defaults to true]
        isAvailable [defaults to true]
        isDeclined [defaults to true]

        //admins only
        isVerifiedImport [defaults to true]
        isUnconfirmed [defaults to false]
*/

//EMULATE_DB

async function readDB(request){

    const options = {
        'skip': request.itemsFrom
    };

    if (request.itemLimit) {
        options.limit = request.itemLimit
    }

    console.log(request);

    return await nano.view('getBookCardData', 'bookCardData', options);
}


exports.getResults = getResults;
async function getResults(reqQuery) {

    console.log('');

    const request = {
        itemsFrom: reqQuery.itemsFrom && +reqQuery.itemsFrom ? +reqQuery.itemsFrom : 0,
        itemLimit: reqQuery.itemLimit && +reqQuery.itemLimit ? +reqQuery.itemLimit : null,
        searchTerm: (typeof reqQuery.searchTerm === "string" && reqQuery.searchTerm.length > 0) ? reqQuery.searchTerm : null,

        isRequested: reqQuery.isRequested === "boolean" ? reqQuery.isRequested : true,
        isOrdered: reqQuery.isOrdered === "boolean" ? reqQuery.isOrdered : true,
        isAvailable: reqQuery.isAvailable === "boolean" ? reqQuery.isAvailable : true,
        isDeclined: reqQuery.isDeclined === "boolean" ? reqQuery.isDeclined : true,

        //admins only
        isVerifiedImport: reqQuery.isVerifiedImport === "boolean" ? reqQuery.isVerifiedImport : true,
        isUnconfirmed: reqQuery.isUnconfirmed === "boolean" ? reqQuery.isUnconfirmed : true,
        isMissing: reqQuery.isMissing === "boolean" ? reqQuery.isMissing : true
    };


    const data = env.emulateDB ? testData1 : await readDB(request);


    return (data);

};