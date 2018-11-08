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
    GoogleBooksAPIkey: 'AIzaSyCSnMvBVmL7KFOeEqtDWeQsiQuN8SCCxPo',

    sayHello: function () {
        console.warn("Hello =)");
    },
    jqTester: function(){
        $("#main p").css("color","orange");
    },
    fetchTestBook: function(){
        $.ajax({
            url: 'https://www.googleapis.com/books/v1/volumes?q=intitle:the+power+of+a+positive+no',
            type: 'GET',
            dataType: 'json',
            success: function(json) { console.log(json) },
            error: function(err) { console.error(err) }
        });
    }
};

$( document ).ready(function() {
    bookFetcher.sayHello();
    bookFetcher.jqTester();
    bookFetcher.fetchTestBook();
});