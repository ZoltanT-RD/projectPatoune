const http = require('http');
const fs = require('fs');
const request = require('request');

/*  GUIDES AND RESOURCES
https://adrianmejia.com/blog/2016/08/24/building-a-node-js-static-file-server-files-over-http-using-es6/

https://adrianmejia.com/blog/2016/08/24/building-a-node-js-static-file-server-files-over-http-using-es6/

//JS Promises
https://www.youtube.com/watch?v=s6SH72uAn3Q
https://stackoverflow.com/questions/35318442/how-to-pass-parameter-to-a-promise-function

*/

//test target= http://ec2.images-amazon.com/images/P/1942788002.01._SCRM_.jpg

//http://ec2.images-amazon.com/images/P/<<ASIN / ISBN-10>>._SCRM_.jpg
//needs testing as well… might not work with all books...


//amazonAPI https://images-na.ssl-images-amazon.com/images/P/1720651353.jpg //isbn10
//googleAPI https://www.googleapis.com/books/v1/volumes?q=isbn:1537732730 //this needs parsing json = items[0].imageLinks.thumbnail (none of the props are guaranteed)
//openLib http://covers.openlibrary.org/b/isbn/9780451498298-L.jpg
//also this works; https://images-na.ssl-images-amazon.com/images/P/1720651353.jpg
//but both fail to find a lot...




// maps file extention to MIME types
const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
//  '.pdf': 'application/pdf',
//  '.doc': 'application/msword',
//  '.eot': 'appliaction/vnd.ms-fontobject',
//  '.ttf': 'aplication/font-sfnt'
};

const HTTPstatusCodes = {
  ok: 200, //Standard response for successful HTTP requests
  created: 201, //The request has been fulfilled, resulting in the creation of a new resource
  accepted: 202, //The request has been accepted for processing, but the processing has not been completed.
  noContent: 204, //The server successfully processed the request and is not returning any content
  badRequest: 400, //The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing)
  unauthorised: 401, //Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource.
  forbidden: 403, //The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource, or may need an account of some sort.
  notFound: 404, //The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
  methodNotAllowed: 405, //A request method is not supported for the requested resource; for example, a GET request on a form that requires data to be presented via POST, or a PUT request on a read-only resource.
  ImATeapot: 418, //This code was defined in 1998 as one of the traditional IETF April Fools' jokes,
  InternalServerError: 500 //A generic error message, given when an unexpected condition was encountered and no more specific message is suitable
};


var bookCoverIndex = [];

//todo: shake up texts by adding some of these...
/*
*\(^o^)/*

p(^_^)q

(^_^)

(^-^)

(^o^)

(^ v ^)

(@^_^@)

(^_*)

(@^o^@)

*/


const text = {
  hello: 'Hello there! =]  Welcome to the cover-store API! >(-\\/-)<',
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
  console.log("Listening on port 1966");
}

function httpRouter(req,resp){

  //only allow GET requests
  if (req.method !== 'GET') {
    resp.statusCode = HTTPstatusCodes.methodNotAllowed;
    resp.write(text.hello);
    resp.write(text.onlyGet);
    resp.end();
  }

  let reqObject = require('url').parse(req.url);
  let pathArray =  reqObject.pathname.split("/");

  pathArray.shift(); //[0] is always empty, so remove that
  pathArray.forEach((element)=> { //convert strings to lowercase
    element = element.toLowerCase;
  });

/*
  console.log(`the method of the request was: ${req.method}`);
  console.log(`the path-part of the request:*${pathArray}*`);
  console.log("the whole object: ",reqObject);
*/


switch (pathArray[0]) {
    case '':
      resp.statusCode = HTTPstatusCodes.ok;
      resp.write(text.hello);
      resp.end();
      return;

    case 'me':
      resp.statusCode = HTTPstatusCodes.ok;
      resp.write(text.me);
      resp.end();
      return;

    case 'teapot':
      resp.statusCode = HTTPstatusCodes.ImATeapot;
      resp.write("Im a teapot :P");
      resp.end();
      //todo: implement teapot protocol/response! eg.; https://www.google.com/teapot  -> http://ascii.co.uk/art/teapot (the middle one)
      return;

    case 'givemeanimage':
      serveUpImageFile('_testImage')
        .then((fromResolve)=>{
          console.log(fromResolve);
          resp.statusCode = fromResolve.statusCode;
          resp.setHeader(fromResolve.header.type,fromResolve.header.value);
          resp.end(fromResolve.data);
        }).catch(function(fromReject){
          resp.statusCode = fromReject.statusCode;
          resp.write = fromReject.msg;
          resp.end();
      });
      return;

    case 'bookcover':
      switch (pathArray[1]) {
        case 'isbn10':
          resp.write(`you were searching for: ISBN10 : *${reqObject.query}*`);
          resp.write(`the rest of the features are still under development`);
          console.log(`the query sting *${reqObject.query}* is *${isQueriedStringValid(reqObject.query,pathArray[1])}*`);
          resp.end();
          break;

        case 'isbn13':
          resp.write(`you were searching for: ISBN13 : *${reqObject.query}*`);
          resp.write(`the rest of the features are still under development`);
          console.log(`the query sting *${reqObject.query}* is *${isQueriedStringValid(reqObject.query,pathArray[1])}*`);
          resp.end();
          break;

        case 'asin':
          resp.statusCode = HTTPstatusCodes.notFound;
          resp.write(text.xNotImplemented('ASIN'));
          resp.end();
          break;

        case 'ean':
          resp.statusCode = HTTPstatusCodes.notFound;
          resp.write(text.xNotImplemented('EAN'));
          resp.end();
          break;

        default:
          resp.write('Are you looking for a book-cover?! You\'re at the right place my friend!');
          resp.write('simply type "isbn10" / "isbn13" / "asin" / " ean" a "?" and the identifier');

          //http://localhost:1966/bookcover/isbn10?1234567890

          resp.end();
          break;
      }
      return;

    default:
      resp.statusCode = HTTPstatusCodes.badRequest;
      resp.write(text.badRequest);
      resp.write(JSON.stringify(reqObject));
      resp.end();
      return;
  }
}

function isQueriedStringValid(q,type){
  let regNumbersOnly = new RegExp("^[0-9]*$");

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


function serveUpImageFile(filename = '_testImage'){

  let returnObj = {};
  let pathName = `./bookCovers/${filename}.jpg`;

  return new Promise((resolve,reject)=>{

    // read file from file system
    fs.readFile(pathName, function(err, data){
      if(!err){
        // if the file is found, set Content-type and send data
        returnObj.statusCode = HTTPstatusCodes.ok;
        returnObj.header = {type: 'Content-type', value: 'image/jpeg'};
        returnObj.msg = `serving up file: ${filename}`;
        returnObj.data = data;
        console.log(`serving up file: ${pathName}`);
        resolve(returnObj);
      }
      else {
        returnObj.statusCode = HTTPstatusCodes.InternalServerError;
        returnObj.msg = `Error getting the file: ${err}.`;
        console.log(`Error getting the file: ${err}.`);
        reject(returnObj);
      }
    });
  });
};



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