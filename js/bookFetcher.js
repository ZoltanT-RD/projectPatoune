/*
API endpoints and features
normal lookup and search requires no api key...

ISBN Number lookup
Example: https://books.google.com/books?vid=ISBN0451522907

GoogleBookID lookup:
Example: https://www.googleapis.com/books/v1/volumes/rwI2ZnCZMd8C

free search
https://www.googleapis.com/books/v1/volumes?q=the+power+of+a+positive+no

intite:
inauthor:
https://www.googleapis.com/books/v1/volumes?q=intitle:the+power+of+a+positive+no&inauthor:william+uri



Pagination
You can paginate the volumes list by specifying two values in the parameters for the request:

startIndex - The position in the collection at which to start. The index of the first item is 0.
maxResults - The maximum number of results to return. The default is 10, and the maximum allowable value is 40.
*/


let bookFetcher = {
    rawOutput: '',

    sayHello: function() {
        console.warn("Hello =)");
    },
    jqTester: function() {
        $("#main p").css("color", "orange");
    },
    searchBook: function(urlParams, callback) {
        $.ajax({
            url: 'https://www.googleapis.com/books/v1/' + urlParams,
            type: 'GET',
            dataType: 'json',
            success: function(json) { callback(bookFetcher, json, urlParams) },
            error: function(err) { console.error(err) }
        });
    },

    searchBookByTitleAndAuthorOrISBN: function(author, title, isbn) {

        let slug = 'volumes?q=';

        if (isbn.length != 0) {
            console.warn(bookFetcher.rawOutput = 'Searching for ISBN: ' + isbn);
            bookFetcher.rawOutput = 'Searching for ISBN: ' + isbn;
            slug += 'isbn:' + isbn;
        } else {
            console.warn(bookFetcher.rawOutput = 'Searching for ' + title + ' by ' + author);
            bookFetcher.rawOutput = 'Searching for "' + title + '" by "' + author + '"';

            if (author.length === 0 && title.length === 0) {
                console.error("Both Title and Author can NOT be empty!");
                bookFetcher.rawOutput = "Both Title and Author can NOT be empty!";
                bookFetcher.renderOutput();
                return;
            }
            if (author.length != 0) {
                slug += 'inauthor:' + author;
            }
            if (title.length != 0) {
                slug += 'intitle:' + title;
            }
        }

        bookFetcher.searchBook(slug, bookFetcher.buildResults);
    },

    massFetchISBNs: function(isbns) {

        let isbnList = isbns.split(',');
        console.warn(isbnList);

        for (let index = 0; index < isbnList.length; index++) {
            const element = isbnList[index];

            let slug = 'volumes?q=isbn:' + element.replace(/-/g, "");;
            bookFetcher.searchBook(slug, bookFetcher.jsonToDBBookFormat);
        }

    },

    jsonToDBBookFormat: function(thisRef, json, originalRequestSlug) {
        //pattern: (amazonLink,ASIN,descriptionLong,descriptionShort,GoogleID,GoogleRating,ISBN10,ISBN13,pageCount,subTitle,title)

        let out = "";
        if (typeof json == "undefined" || json == "" || typeof json.items == "undefined" || json.items.length == 0 || json.totalItems < 1) {
            console.error(json);

            out = "ERROR WITH JSON!" + originalRequestSlug;

        } else {

            item = json.items[0];

            console.warn(item);

            let tmpSeparator = "<br />"; //todo set this to "" in production

            out = "<strong>original request: </strong>"+originalRequestSlug + tmpSeparator;
            out += "<strong>original JSON: </strong>"+ JSON.stringify(json) + tmpSeparator + tmpSeparator;

            out += ("null,")+tmpSeparator;
            out += ("null,")+tmpSeparator;

            out += bookFetcher.replaceUndefined(JSON.stringify(item.volumeInfo.description),'""') + ","+tmpSeparator;
            out += bookFetcher.replaceUndefined(JSON.stringify(item.searchInfo.textSnippet),'""') + ","+tmpSeparator;
            out += bookFetcher.replaceUndefined(JSON.stringify(item.id),'""') + ","+tmpSeparator;
            out += bookFetcher.replaceUndefined(JSON.stringify(item.volumeInfo.averageRating),'""') + ","+tmpSeparator;

            if (typeof item.volumeInfo.industryIdentifiers != "undefined" && item.volumeInfo.industryIdentifiers.length != 0) {
                let isbn10 = "";
                let isbn13 = "";

                for (let index = 0; index < item.volumeInfo.industryIdentifiers.length; index++) {
                    const element = item.volumeInfo.industryIdentifiers[index];

                    if (element.type == "ISBN_10") {
                        isbn10 = JSON.stringify(element.identifier);
                    }
                    if (element.type == "ISBN_13") {
                        isbn13 = JSON.stringify(element.identifier);
                    }
                }

                out += isbn10+tmpSeparator;
                out += isbn13+tmpSeparator;

            }

            out += bookFetcher.replaceUndefined(JSON.stringify(item.volumeInfo.pageCount),'""') + ","+tmpSeparator;
            out += bookFetcher.replaceUndefined(JSON.stringify(item.volumeInfo.subtitle),'""') + ","+tmpSeparator;
            out += bookFetcher.replaceUndefined(JSON.stringify(item.volumeInfo.title),'""') + ","+tmpSeparator;
        }

        $('#results').append("<p>" + out + "</p><hr/>");
    },

    replaceUndefined: function(item,replaceTo){
        if(item === undefined){
            return replaceTo;
        }
        return item;
    },

    getISBNs: function(input) {

    },

    searchTestBook: function() {
        bookFetcher.searchBook('volumes?q=intitle:the+power+of+a+positive+no', function(tmp, json) { console.log(json) });
    },
    buildResults: function(self, rawJson) {
        console.log("raw json pased in:");
        console.log(rawJson);

        if (rawJson.totalItems == 0) {
            bookFetcher.rawOutput += "NO RESULTS FOUND...";
        } else {
            for (let index = 0; index < rawJson.items.length; index++) {
                const item = rawJson.items[index];
                self.buildResult(item);
            }
        }
        bookFetcher.renderOutput();
    },
    buildResult: function(item) {
        bookFetcher.rawOutput += '<div class="result">';
        bookFetcher.rawOutput += '<img src="' + bookFetcher.inserTextOrNA(item, ["volumeInfo", "imageLinks", "thumbnail"], "https://via.placeholder.com/200x300") + '" />';
        bookFetcher.rawOutput += '<p><span class="bookTitle">' + item.volumeInfo.title + '</span>-';
        bookFetcher.rawOutput += '<span class="bookSubtitle">' + bookFetcher.inserTextOrNA(item, ["volumeInfo", "subtitle"], "") + '</span>(';
        bookFetcher.rawOutput += '<span class="publishYear">' + bookFetcher.inserTextOrNA(item, ["volumeInfo", "publishedDate"], "n/a") + '</span>)</p>';
        bookFetcher.rawOutput += '<p class="listOfAuthors"> by ';
        if (typeof item.volumeInfo.authors != "undefined") {
            for (let index = 0; index < item.volumeInfo.authors.length; index++) {
                const element = item.volumeInfo.authors[index];
                bookFetcher.rawOutput += '<span class="bookAuthor">' + element + '</span>';
            }
        } else {
            bookFetcher.rawOutput += ' n/a';
        }
        bookFetcher.rawOutput += '</p>';
        for (let index = 0; index < item.volumeInfo.industryIdentifiers.length; index++) {
            const element = item.volumeInfo.industryIdentifiers[index];
            bookFetcher.rawOutput += '<p>' + element.type + ': <span class="' + element.type + '">' + element.identifier + '</span> |';
        }
        bookFetcher.rawOutput += '<p> GoogleID: <span class="googleID">' + item.id + '</span></p>';
        bookFetcher.rawOutput += '</div>';
    },
    inserTextOrNA: function(obj, propArray, NAtext) {
        if (typeof obj === undefined) {
            return NAtext;
        } else {
            let tmpObj = obj;
            for (let index = 0; index < propArray.length; index++) {
                const element = propArray[index];

                if (typeof tmpObj[element] != "undefined") {
                    tmpObj = tmpObj[element];
                } else {
                    return NAtext;
                }
            }
            return tmpObj;
        }
    },
    renderOutput: function() {
        $('#results').html("<p>" + bookFetcher.rawOutput + "</p>");
    }
};

$(document).ready(function() {
    bookFetcher.sayHello();
    bookFetcher.jqTester();
    bookFetcher.searchTestBook();
});