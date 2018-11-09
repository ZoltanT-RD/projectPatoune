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


/*
    get title from amazon page url;
    $("#detail_bullets_id ul").innerHTML

    get isbn-s:
    $("#detail_bullets_id ul li:nth-child(4n)").innerHTML
    $("#detail_bullets_id ul li:nth-child(5n)").innerHTML
*/

let bookFetcher = {
    rawOutput: '',

    sayHello: function () {
        console.warn("Hello =)");
    },
    jqTester: function(){
        $("#main p").css("color","orange");
    },
    searchBook: function(urlParams,callback){
        $.ajax({
            url: 'https://www.googleapis.com/books/v1/'+urlParams,
            type: 'GET',
            dataType: 'json',
            success: function(json) { callback(bookFetcher,json) },
            error: function(err) { console.error(err) }
        });
    },

    searchBookByTitleAndAuthorOrISBN: function(author, title,isbn){

        let slug = 'volumes?q=';

        if(isbn.length != 0){
            console.warn(bookFetcher.rawOutput = 'Searching for ISBN: '+isbn);
            bookFetcher.rawOutput = 'Searching for ISBN: '+isbn;
            slug += 'isbn:'+ isbn;
        }
        else{
            console.warn(bookFetcher.rawOutput = 'Searching for '+title+' by '+author);
            bookFetcher.rawOutput = 'Searching for "'+title+'" by "'+author+'"';

            if (author.length === 0 && title.length === 0) {
                console.error("Both Title and Author can NOT be empty!");
                bookFetcher.rawOutput = "Both Title and Author can NOT be empty!";
                bookFetcher.renderOutput();
                return;
            }
            if (author.length !=0 ) {
                slug += 'inauthor:'+ author;
            }
            if (title.length != 0 ) {
                slug += 'intitle:'+title;
            }
        }

        bookFetcher.searchBook(slug,bookFetcher.buildResults);
    },
    searchTestBook: function(){
        bookFetcher.searchBook('volumes?q=intitle:the+power+of+a+positive+no',function(tmp,json){console.log(json)});
    },
    buildResults: function(self,rawJson){
        console.log("raw json pased in:");
        console.log(rawJson);

        if (rawJson.totalItems == 0) {
            bookFetcher.rawOutput += "NO RESULTS FOUND...";
        }
        else{
            for (let index = 0; index < rawJson.items.length; index++) {
                const item = rawJson.items[index];
                self.buildResult(item);
            }
        }
        bookFetcher.renderOutput();
    },
    buildResult: function(item){
        bookFetcher.rawOutput += '<div class="result">';
        bookFetcher.rawOutput += '<img src="'+ bookFetcher.inserTextOrNA(item,["volumeInfo","imageLinks","thumbnail"],"https://via.placeholder.com/200x300") +'" />';
        bookFetcher.rawOutput += '<p><span class="bookTitle">'+ item.volumeInfo.title +'</span>-';
        bookFetcher.rawOutput += '<span class="bookSubtitle">'+ bookFetcher.inserTextOrNA(item,["volumeInfo","subtitle"],"") +'</span>(';
        bookFetcher.rawOutput += '<span class="publishYear">'+ bookFetcher.inserTextOrNA(item,["volumeInfo","publishedDate"],"n/a") +'</span>)</p>';
        bookFetcher.rawOutput += '<p class="listOfAuthors"> by ';
        if(typeof item.volumeInfo.authors != "undefined" ){
            for (let index = 0; index < item.volumeInfo.authors.length; index++) {
                const element = item.volumeInfo.authors[index];
                bookFetcher.rawOutput += '<span class="bookAuthor">'+ element +'</span>';
            }
        }
        else{
            bookFetcher.rawOutput += ' n/a';
        }
        bookFetcher.rawOutput += '</p>';
        for (let index = 0; index < item.volumeInfo.industryIdentifiers.length; index++) {
            const element = item.volumeInfo.industryIdentifiers[index];
            bookFetcher.rawOutput += '<p>'+ element.type+': <span class="'+element.type+'">'+ element.identifier +'</span> |';
        }
        bookFetcher.rawOutput += '<p> GoogleID: <span class="googleID">'+ item.id +'</span></p>';
        bookFetcher.rawOutput += '</div>';
    },
    inserTextOrNA: function(obj,propArray,NAtext){
        if (typeof obj === undefined) {
            return NAtext;
        }
        else{
            let tmpObj = obj;
            for (let index = 0; index < propArray.length; index++) {
                const element = propArray[index];

                if (typeof tmpObj[element] != "undefined") {
                    tmpObj = tmpObj[element];
                }
                else{
                    return NAtext;
                }
            }
            return tmpObj;
        }
    },
    renderOutput: function () {
        $('#results').html("<p>"+bookFetcher.rawOutput+"</p>");
    }
};

$(document).ready(function() {
    bookFetcher.sayHello();
    bookFetcher.jqTester();
    bookFetcher.searchTestBook();
});