const http = require('http');
const fs = require('fs');
const request = require('request');

//amazonAPI https://images-na.ssl-images-amazon.com/images/P/1720651353.jpg //isbn10
//googleAPI https://www.googleapis.com/books/v1/volumes?q=isbn:1537732730 //this needs parsing json = items[0].imageLinks.thumbnail (none of the props are guaranteed)
//openLib http://covers.openlibrary.org/b/isbn/9780451498298-L.jpg


//also this works; https://images-na.ssl-images-amazon.com/images/P/1720651353.jpg
//but both fail to find a lot...


var bookCoverIndex = [];


//  listening http server

/* simple version
const server = http.createServer((req, resp) =>{
    if (req.url === '/') {
        resp.write('Hello there! =]');
        resp.end();
    }
});
*/


const text = {
  hello: 'Hello there! =]  Welcome to the cover-store API!',
  onlyGet: 'Only GET requests are allowed, sorry.... (not really ^^)',
  badRequest: 'not sure what you mean by this request...',
  me: 'I am the cover-store API!',
  xNotImplemented: function(x) {return `${x} is NOT implemented yet! -_-`;},
  xIsInvalid: function(x) {return `${x} is invalid...`;}
};

const server = http.createServer((req, resp) =>{
  httpRouter(req, resp);
});

function startServer() {
  server.listen(1966);
  console.log("Listening on 1966");
}


function httpRouter(req,resp){

  let reqObject = require('url').parse(req.url);

  if (req.method !== 'GET') {
    resp.write(text.hello);
    resp.write(text.onlyGet);
    resp.end();
  }

  let pathArray =  reqObject.pathname.split("/");
  pathArray.shift(); //[0] is always empty, so remove that


/*
  console.log(`the method of the request was: ${req.method}`);
  console.log(`the path-part of the request:*${pathArray}*`);
  console.log("the whole object: ",reqObject);
*/


  switch (pathArray[0]) {
    case '':
      resp.write(text.hello);
      break;

    case 'me':
      resp.write(text.me);
      break;

    case 'bookcover':
      switch (pathArray[1]) {
        case 'isbn10':
          resp.write(text.xNotImplemented('ISBN-10'));
          resp.write(`you were searching for: ISBN10 : *${reqObject.query}*`);
          console.log(`the query sting *${reqObject.query}* is *${isQueriedStringValid(reqObject.query,pathArray[1])}*`);

          break;

        case 'isbn13':
          resp.write(text.xNotImplemented('ISBN-13'));
          resp.write(`you were searching for: ISBN13 : *${reqObject.query}*`);
          console.log(`the query sting *${reqObject.query}* is *${isQueriedStringValid(reqObject.query,pathArray[1])}*`);

          break;

        case 'asin':
          resp.write(text.xNotImplemented('ASIN'));
          break;

        case 'ean':
          resp.write(text.xNotImplemented('EAN'));
          break;

        default:
          resp.write('Are you looking for a book-cover?! You\'re at the right place my friend!');
          break;
      }
      break;

    default:
      resp.write(text.badRequest);
      resp.write(JSON.stringify(reqObject));
      break;
  }

  resp.end();

}

function isQueriedStringValid(q,type){
  let regNumbersOnly = /^\d+$/; //only numbers; //todo: this is still boroken, allows letters mixed in ...

console.log(`type of the Q: ${typeof parseInt(q)}`);

  if (q && type && q !=='' && type !== '') {
    switch (type) {
      case 'isbn10':
        if (q.length === 10 && regNumbersOnly.test(q)) {
          return true;
        }
        console.log(xIsInvalid("isbn10"));
        return false;

      case 'isbn13':
        if (q.toString().length === 13 && regNumbersOnly.test(q)) {
          return true;
        }
        console.log(xIsInvalid("isbn13"));
        return false;

      default:
        console.log("type is invalid!");
        return false;
    }
  }
  else
    console.log("type or q is invalid!");
    return false;
}


function downloadAndSaveFile(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
      console.log(`filename: "${filename}"`);
      console.log('------------------------------------');

      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

  function isItemAvailable(id,array){

    if(!array || array.length === 0)
    {
      console.log("the supplied source array is faulty");
      return false;
    }
    else{
      console.log(`id ${id} found!`);
      return array.includes(id); //todo: this is potentionally wrong(?), as it returns partial finds as well!
    }
  }



//test target= http://ec2.images-amazon.com/images/P/1942788002.01._SCRM_.jpg

//http://ec2.images-amazon.com/images/P/<<ASIN / ISBN-10>>._SCRM_.jpg
//needs testing as well… might not work with all books...




let isbnTestArray = ['0451498291','1942788002','1720651353','ERRORTEST','1788996402','1491904909','0955683645','1947667009','1537732730'];

//todo: need to handle cases when image is not found...

/*

for (let index = 0; index < isbnTestArray.length; index++) {
  const element = isbnTestArray[index];

  downloadAndSaveFile(
    `http://ec2.images-amazon.com/images/P/${element}.01._SCRM_.jpg`,
    `bookCovers/${element}.jpg`,
    function(ret){
      console.log(`this is what came back: ${ret}`);
  });
}
*/


function init(callback){

  /*** INITIALISE */
  console.log("Initialising...");

  /* read the folder content */

  console.log("- Rebuilding local file index...");
  console.log("- - reading local image store folder ...");

  fs.readdir('./bookCovers/',(err,content)=>{
    if (err) {
      console.log(`!!! an error occured: ${err}`);
      return;
    }
    else {
      console.log(`- - folder reading DONE. Found ${content.length} files.`);

      if (content.length > 0) {
        for (let i = 0; i < content.length; i++) {
          const element = content[i];
          bookCoverIndex.push(element.substring(0,element.lastIndexOf(".")));
        }
      }
      bookCoverIndex = bookCoverIndex.sort();
      console.log(bookCoverIndex);

      callback();
    }
  });
}

init(()=>{
  console.log("------------------------------------------------------------");
  isItemAvailable('1942788002456',bookCoverIndex);

  startServer();

});
