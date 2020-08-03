const env = require('../../_env');

const nano = require('nano')(`http://${env.DBUserName}:${env.DBPass}@${env.DBURL}:${env.DBPort}/${env.DBName}`);

const BookRequestStatus = require('../../../enums/BookRequestStatus');

const testData1 = require('./testData1.json');


//EMULATE_DB

async function readDB(request) {

    let options = {
        'skip': request.itemsFrom
    };

    if (request.itemLimit) {
        options.limit = request.itemLimit
    };

    if (request.disableFilters) {
        return await nano.view('getBookCardData', 'default', options);
    }
    else{
        //because of poor paging support I've abbandoned this approach.... loading all data and filtering on the UI now...
        options.keys = request.filtersArray;
        return await nano.view('getBookCardData', 'filteringByStatus', options);
    }

}


exports.getResults = getResults;
async function getResults(reqQuery) {

    const request = {
        itemsFrom: reqQuery.itemsFrom && +reqQuery.itemsFrom ? +reqQuery.itemsFrom : 0,
        itemLimit: reqQuery.itemLimit && +reqQuery.itemLimit ? +reqQuery.itemLimit : null,
        searchTerm: (typeof reqQuery.searchTerm === "string" && reqQuery.searchTerm.length > 0) ? reqQuery.searchTerm : null,

        filtersArray: Object.keys(BookRequestStatus).filter(x => Object.keys(reqQuery).includes(x)),


        ///todo admins only... also not working for now...
        isVerifiedImport: typeof reqQuery.isVerifiedImport != "undefined" ? true : false,

        disableFilters: typeof reqQuery.disableFilters != "undefined" ? true : false
    };


    const data = env.emulateDB ? testData1 : await readDB(request);

    return (data);

};