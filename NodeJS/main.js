/**
 * @author Zoltan Tompa
 * @email zoltan@resdiary.com
 * @create date 2018-12-06 11:26:27
 * @modify date 2019-01-02 12:40:38
 * @desc some description herere
*/

///idea .
///todo .
///fixme .
///section .

///section GUIDES AND RESOURCES
/*
//node server
https://adrianmejia.com/blog/2016/08/24/building-a-node-js-static-file-server-files-over-http-using-es6/

//JS Promises
https://www.youtube.com/watch?v=s6SH72uAn3Q
https://stackoverflow.com/questions/35318442/how-to-pass-parameter-to-a-promise-function

//image APIs
http://ec2.images-amazon.com/images/P/<<ASIN / ISBN-10>>._SCRM_.jpg
test target= http://ec2.images-amazon.com/images/P/1942788002.01._SCRM_.jpg

amazonAPI https://images-na.ssl-images-amazon.com/images/P/1720651353.jpg //isbn10 or asin only!
  also this works;
  but both fail to find a lot...
googleAPI https://www.googleapis.com/books/v1/volumes?q=isbn:1537732730 //isbn10 or 13
https://developers.google.com/books/docs/v1/using#RetrievingBookshelf

openLib http://covers.openlibrary.org/b/isbn/0385472579-L.jpg //isbn10 or 13

*/

///todo implement Promise-chain + use "timeout trick" for api taking too long?


///todo break everyting up into modules


///section IMPORTS
const http = require('http');
const https = require('https');
const fs = require('fs');
const request = require('request');



///section CONSTANTS

///todo this has to be set for every module
const moduleName = "base";

const externalApiUrls = {
  amazon1: (isbn10)=> {return `http://ec2.images-amazon.com/images/P/${isbn10}.01._SCRM_.jpg`;},
  amazon2: (isbn10)=> {return `https://images-na.ssl-images-amazon.com/images/P/${isbn10}.jpg`;},
  googleJSON: (isbn)=> {return `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&fields=items(volumeInfo/imageLinks)`;},
  openLib: (isbn)=> {return `http://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;}
};

const mimeTypes = {
  ico: 'image/x-icon',
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  json: 'application/json',
  png: 'image/png',
  jpg: 'image/jpeg',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  doc: 'application/msword',
  eot: 'appliaction/vnd.ms-fontobject',
  ttf: 'aplication/font-sfnt'
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


///todo do request query parsing, eg. remove - s from isbn, remove funky characters etc...

///todo console messages need testing properly

///idea: add christmass easter-eggs! eg. santa hat to the logo, snow falling, "ho ho ho" to texts, etc...
///idea: shake up texts by adding some of these...

const emoticons = {
  '*\\(^o^)/*': '*\\(^o^)/*',
  'p(^_^)q': 'p(^_^)q',
  '(^_^)': '(^_^)',
  '(^-^)': '(^-^)',
  '(^o^)': '(^o^)',
  '(^ v ^)': '(^ v ^)',
  '(@^_^@)': '(@^_^@)',
  '(^_*)': '(^_*)',
  '(@^o^@)': '(@^o^@)',
  '(o_O)': '(o_O)',
  '(0_0)': '(0_0)',
  "(-_-')": "(-_-')",
  "(-,,-)": "(-,,-)",
  '=]': '=]',
  'whaleOut': '        \n'+
'          .     '+'\n'+
'         ":"    '+'\n'+
'       ___:____     |"\/"|'+ '\n' +
"     ,'        `.    \  /"+ '\n' +
'     |  O        \___/  |'+ '\n' +
'   ~^~^~^~^~^~^~^~^~^~^~^~^~  (logo: Riitta Rasimus)'+ '\n' +
' PROJECT PATOUNE BOOK-COVER API '+ '\n',

'whaleIn': '        \n'+
'\n        '
+'\n'+'                      .          '
+'\n'+'                     ":"         '
+'\n'+'      |"\/"|     ____:___       '
+'\n'+"       \  /    .`        ',     "
+'\n'+'        | \___/        O  |     '
+'\n'+'    ~^~^~^~^~^~^~^~^~^~^~^~^~   (logo: Riitta Rasimus)'
+'\n'+'  PROJECT PATOUNE BOOK-COVER API '
+'\n'


  //  *\(^o^)/*  p(^_^)q  (^_^)   (^-^)   (^o^)   (^ v ^)   (@^_^@)   (^_*)   (@^o^@)
};

const text = {
  hello: `Hello there! ${emoticons["=]"]} Welcome to the cover-store API! ${emoticons["(^_^)"]}`,
  onlyGet: 'Only GET requests are allowed, sorry.... (not really '+emoticons["(^ v ^)"]+' )',
  badRequest: 'not sure what you mean by this request '+emoticons["(0_0)"]+' ...',
  me: 'I am the cover-store API! '+emoticons["(@^_^@)"],
  xNotImplemented: (x = "this feature")=> {
    return `${x} is NOT implemented yet! ${emoticons["p(^_^)q"]}`;
  },
  xIsInvalid: (x = "this")=> {
    return `${x} is invalid ${emoticons["(-_-')"]} ...`;
  },
  emptyLine: ''
};

const server = http.createServer((req, resp) =>{
  httpRouter(req, resp);
});

const fileNotFoundRule = {
  returnError: 0,
  returnPlaceholderImage: 1
};

const consoleChattynessRule = {
  debugAndAbove: 0,
  infoAndAbove: 1,
  warnAndAbove: 2,
  onlyErrors: 3
};


///section SETTINGS
const settings = {
  enableExternalFileFetching : true,
  fileNotFoundRule: fileNotFoundRule.returnError,
  fileNotFoundImage: '_coverNotFound',
  consoleChattyness: consoleChattynessRule.debugAndAbove,
  webserverPortNo: 1966
};

const toConsole = {
  out: (msg = "")=>{
    if(typeof msg ==="object"){
      msg = JSON.stringify(msg);
    };
    console.log(`${msg}`);
  },
  debug: (msg = "")=>{
    if(settings.consoleChattyness === consoleChattynessRule.debugAndAbove){
      if(typeof msg ==="object"){
        msg = JSON.stringify(msg);
      };
      writeToConsole(`[${(new Date()).toISOString()}] ${moduleName}Module: ${msg}`,true);
      //console.log(`[${(new Date()).toISOString()}] ${moduleName}Module: ${msg}`);
    }
  },
  info: (msg = "")=>{
    if(settings.consoleChattyness === consoleChattynessRule.debugAndAbove ||
      settings.consoleChattyness === consoleChattynessRule.infoAndAbove){
      if(typeof msg ==="object"){
        msg = JSON.stringify(msg);
      };
      writeToConsole(`[${(new Date()).toISOString()}] ${moduleName}Module: ${msg}`);
      //console.log(`[${(new Date()).toISOString()}] ${moduleName}Module: ${msg}`);
    }
  },
  warn: (msg = "")=>{
    if(settings.consoleChattyness === consoleChattynessRule.debugAndAbove ||
      settings.consoleChattyness === consoleChattynessRule.infoAndAbove ||
      settings.consoleChattyness === consoleChattynessRule.warnAndAbove){
      if(typeof msg ==="object"){
        msg = JSON.stringify(msg);
      };
      writeToConsole(`[${(new Date()).toISOString()}] ${moduleName}Module [warn]: ${msg}`);
      //console.log(`[${(new Date()).toISOString()}] ${moduleName}Module [warn]: ${msg}`);
    }
  },
  error: (msg = "")=>{
    if(settings.consoleChattyness === consoleChattynessRule.debugAndAbove ||
      settings.consoleChattyness === consoleChattynessRule.infoAndAbove ||
      settings.consoleChattyness === consoleChattynessRule.warnAndAbove ||
      settings.consoleChattyness === consoleChattynessRule.onlyErrors){
      if(typeof msg ==="object"){
        msg = JSON.stringify(msg);
      };
      writeToConsole(`[${(new Date()).toISOString()}] ${moduleName}Module [ERROR]: ${msg}`,true);
      //console.log(`[${(new Date()).toISOString()}] ${moduleName}Module [ERROR]: ${msg}`);
    }
  }
};

const writeToConsole = function(msg = "",doFullStack = false){
  if(msg===""){
    return;
  }
  else if(doFullStack){
    console.log((new Error(msg)).toString().substring(7));
  }
  else{
    let c = new Error(msg).stack.split('\n');
    let d = c[0].replace("Error: ", "") + " -- " + c[3].substring(4, c[3].indexOf("(")-1) + "()";

    console.log(d);
  }
}

var bookCoverIndex = []; //this is used to store the locally stored coverId-s, populated on every init()!


let isbnTestArray = ['0451498291','1942788002','1720651353','ERRORTEST','1788996402','1491904909','0955683645','1947667009','1537732730'];



///section INVOKED FUNCTIONS


function startServer() {
  server.listen(settings.webserverPortNo);
  toConsole.info(`Listening on port ${settings.webserverPortNo}`);
  toConsole.out(text.emptyLine);
}

function httpRouter(req,resp){

  if(!req || !resp){
    toConsole.error("Internal server error!");
    return;
  }

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

  toConsole.info(`NEW REQUEST (${req.method}) for *${pathArray}*`);
  toConsole.debug(`the method of the request was: ${req.method}`);
  toConsole.debug(`the path-part of the request:*${pathArray}*`);
  //toConsole.debug("the whole object: ",JSON.stringify(reqObject));

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
      ///idea: implement teapot protocol/response! eg.; https://www.google.com/teapot  -> http://ascii.co.uk/art/teapot (the middle one)
      return;

    case 'givemeanimage':
      serveUpImageFile('_testImage')
        .then((fromResolve)=>{
          //toConsole.debug(`/givemeanimage fromResolve: ${JSON.stringify(fromResolve)}`);
          resp.statusCode = fromResolve.statusCode;
          resp.setHeader(fromResolve.header.type,fromResolve.header.value);
          resp.end(fromResolve.data);
          toConsole.info("REQUEST was fulfilled "+ emoticons["*\\(^o^)/*"]);
          toConsole.out(text.emptyLine);
        }).catch((fromReject)=>{
          toConsole.debug(`/givemeanimage fromReject: ${JSON.stringify(fromReject)}`);
          resp.statusCode = fromReject.statusCode;
          resp.write = fromReject.msg;
          resp.end();
      });
      return;

    case 'bookcover':
      switch (pathArray[1]) {
        case 'isbn10':
          toConsole.info(`you were searching for: ISBN10 : *${reqObject.query}*`);

          if(isQueriedStringValid(reqObject.query,'isbn10')) {
            toConsole.debug(`the query sting *${reqObject.query}* is VALID!`);

            tryToFindFile(reqObject.query,'isbn10')
            .then((fromResolve)=>{
              toConsole.info(`requested file being served...`);
              resp.statusCode = fromResolve.statusCode;
              resp.setHeader(fromResolve.header.type,fromResolve.header.value);
              resp.end(fromResolve.data);
              toConsole.info("REQUEST was fulfilled "+ emoticons["*\\(^o^)/*"]);
              toConsole.out(text.emptyLine);
            }).catch((fromReject)=>{
              toConsole.error(`this have been rejected: ${JSON.stringify(fromReject)}`);
              resp.statusCode = fromReject.statusCode;
              resp.write(fromReject.msg);
              resp.end();
            });
          }
          else{
            toConsole.warn(`the query sting *${reqObject.query}* is INVALID!`);
            resp.write(`error: the query sting *${reqObject.query}* is INVALID!`);
            resp.end();
          }

          return;

        case 'isbn13':
          toConsole.info(`you were searching for: ISBN13 : *${reqObject.query}*`);
          resp.write(`you were searching for: ISBN13 : *${reqObject.query}*`);
          resp.write(text.xNotImplemented("isbn13"));
          ///todo implement isbn 13

          resp.end();
          return;

        case 'asin':
          resp.statusCode = HTTPstatusCodes.notFound;
          resp.write(text.xNotImplemented('ASIN'));
          resp.end();
          ///todo implement asin
          return;

        case 'ean':
          resp.statusCode = HTTPstatusCodes.notFound;
          resp.write(text.xNotImplemented('EAN'));
          resp.end();
          ///todo implement ean
          return;

        default:
          resp.write('Are you looking for a book-cover?! You\'re at the right place my friend! '+ emoticons["(^_*)"]);
          resp.write('\n simply type "isbn10" / "isbn13" / "asin" / " ean" a "?" and the identifier itself.');

          resp.end();
          return;
      }

    default:
      resp.statusCode = HTTPstatusCodes.badRequest;
      resp.write(text.badRequest);
      resp.write(JSON.stringify(reqObject));
      toConsole.warn("REQUEST was REJECTED "+ emoticons["(-,,-)"]);
      toConsole.out(text.emptyLine);
      resp.end();
      return;
  }
}

function isQueriedStringValid(q,type){
  let regNumbersOnly = new RegExp("^[0-9]*$");

  if (q && type && q !=='' && type !== '') {
    toConsole.debug(`type of the "${q}" is ${typeof parseInt(q)}`);

    switch (type) {
      case 'isbn10':
        if (q.length === 10 && regNumbersOnly.test(q)) {
          return true;
        }
        toConsole.error(text.xIsInvalid("isbn10"));
        return false;

      case 'isbn13':
        if (q.length === 13 && regNumbersOnly.test(q)) {
          return true;
        }
        toConsole.error(text.xIsInvalid("isbn13"));
        return false;

      default:
        toConsole.error(text.xIsInvalid());
        return false;
    }
  }
  else
    toConsole.error("type or q is invalid!");
    return false;
}


function tryToFindFile(query,type){

  return new Promise((resolve, reject) => {

    let returnObj = {};

    if (!query || !type) {
      returnObj.statusCode = HTTPstatusCodes.badRequest;
      returnObj.msg ="bad parameters supplied";
      toConsole.error(returnObj.msg);
      reject(returnObj);
    }

    toConsole.info(`looking for the file ${query} of type ${type} ...`);

    if(isItemAvailableLocally(query,bookCoverIndex)){
      resolve(serveUpImageFile(query));
    }
    else {

      if(settings.enableExternalFileFetching){

        queryExternalApis(query)
        .then((fromResolve)=>{
          toConsole.debug(JSON.stringify(fromResolve));
          resolve(serveUpImageFile(query));
        })
        .catch((fromReject)=>{
          toConsole.err(JSON.stringify(fromReject));

          if (settings.fileNotFoundRule === fileNotFoundRule.returnPlaceholderImage) {
            resolve(serveUpImageFile(settings.fileNotFoundImage));
          }
          else {
            return new Promise((resolve, reject) => {
              if (settings.fileNotFoundRule === fileNotFoundRule.returnError) {
                returnObj.statusCode = HTTPstatusCodes.notFound;
                returnObj.msg = `Error getting the file. It's not found locally, and extrenal services are disabled!`;
                toConsole.error(returnObj.msg);
                reject(returnObj);
              }
              else {
                toConsole.error(`settings.fileNotFoundRule is not handled properly!`);
                returnObj.statusCode = HTTPstatusCodes.InternalServerError;
                reject(returnObj);
              }
            });
          }
        });
      }
      else {

        if (settings.fileNotFoundRule === fileNotFoundRule.returnPlaceholderImage) {
          resolve(serveUpImageFile(settings.fileNotFoundImage));
        }
        else {
          return new Promise((resolve, reject) => {
            if (settings.fileNotFoundRule === fileNotFoundRule.returnError) {
              returnObj.statusCode = HTTPstatusCodes.notFound;
              returnObj.msg = `Error getting the file. It's not found locally, and extrenal services are disabled!`;
              toConsole.error(returnObj.msg);
              reject(returnObj);
            }
            else {
              toConsole.error(`settings.fileNotFoundRule is not handled properly!`);
              returnObj.statusCode = HTTPstatusCodes.InternalServerError;
              reject(returnObj);
            }
          });
        }
      }
    }

  });
};


//desc: this function queries the external api-s in order and tries to find a useful image
function queryExternalApis(isbn10){

/*
[  LOGIC  ]
  1. check first api url
  2. if found, download and GOTO 12
  3. if not try next api url
  4. if found, download and GOTO 12
  5. call 'getGoogleApiImageUrl()' to get url
  6. if fails GOTO 10
  7. download google cover image
  8. if fails, GOTO 10
  9. GOTO 12
  10. try donwload image from openLib
  11. if fails GOTO 13
  12. add file to coverIndex GOTO 14 //bookCoverIndex.push(isbn) //no .jpg!
  13. return reject
  14. return resolve
*/

  toConsole.info("querying external APIs");

  let returnObj = {
    isSuccessfull: null,
    msg: null
  };

  return new Promise((resolve, reject) => {

    downloadAndSaveFile(externalApiUrls.amazon1(isbn10),`bookCovers/${isbn10}.jpg`)
        .then((resp)=>{
          toConsole.info("download from Amazon1 was successfull!");
          bookCoverIndex.push(isbn10);
          returnObj.isSuccessfull = true;
          resolve(returnObj);
        })
        .catch((resp)=>{
          toConsole.warn("download from Amazon1 FAILED");

          ///todo since this is throwing 403s all the time, for no reason, try to add a 5x try with 2 sec wait, if all 5 fails, then move to google

          toConsole.warn("tryin Google...");
          getGoogleApiImageUrl(isbn10)
          .then((val)=>{
            downloadAndSaveFile(val.url,`bookCovers/${isbn10}.jpg`)
            .then((val)=>{
                toConsole.info("download from Google was successfull!");
                bookCoverIndex.push(isbn10);
                returnObj.isSuccessfull = true;
                resolve(returnObj);
              }).catch((err)=>{
                  toConsole.warn("download from Goolge FAILED");

                  toConsole.warn("tryin openLib...");

                  downloadAndSaveFile(externalApiUrls.openLib(isbn10),`bookCovers/${isbn10}.jpg`,['fileSize']).then(
                    (val)=>{
                      toConsole.info("download from openLib was successfull!");
                      bookCoverIndex.push(isbn10);
                      returnObj.isSuccessfull = true;
                      resolve(returnObj);
                    }).catch((err)=>{
                      returnObj.msg = `none of the externail APIs found the cover ${isbn10}...`+ emoticons["(-_-')"];
                      toConsole.error(returnObj.msg);
                      returnObj.isSuccessfull = false;
                      reject(returnObj);
                  });
            });

          })
          .catch((err)=>{
            toConsole.warn("download from Goolge FAILED");

            toConsole.warn("tryin openLib...");

            downloadAndSaveFile(externalApiUrls.openLib(isbn10),`bookCovers/${isbn10}.jpg`,['fileSize']).then(
              (val)=>{
                toConsole.info("download from openLib was successfull!");
                bookCoverIndex.push(isbn10);
                returnObj.isSuccessfull = true;
                resolve(returnObj);
              }).catch((err)=>{
                returnObj.msg = `none of the externail APIs found the cover ${isbn10}...`+ emoticons["(-_-')"];
                toConsole.error(returnObj.msg);
                returnObj.isSuccessfull = false;
                reject(returnObj);
            });
          });
        });
  });
};

function getGoogleApiImageUrl(isbn){

  let returnObj = {
    isSuccessfull: null,
    msg: null,
    url: null
  };

  return new Promise((resolve, reject) => {

    if(!isbn){
      returnObj.isSuccessfull = false;
      returnObj.msg = "isbn was not supplied!";
      reject(returnObj);
    }

    https.get(externalApiUrls.googleJSON(isbn), (res) => {
      let data = '';
      res.on('data', (chunk)=> {
          data += chunk;
      });
      res.on('end', ()=> {
          if (res.statusCode === HTTPstatusCodes.ok) {
            try {
              let json = JSON.parse(data);
              // data is available here:
              toConsole.info(`getGoogleApiImageUrl() - the parsed data: ${JSON.stringify(json)}`);

              if(json.items
                && json.items.length>0
                && json.items[0]
                && json.items[0].volumeInfo
                && json.items[0].volumeInfo.imageLinks){

                  toConsole.debug("getGoogleApiImageUrl() - all base-properties are valid!!!");
                  let imageSet = json.items[0].volumeInfo.imageLinks;
                  const imageSetProps = ['extraLarge','large','medium','small','thumbnail','smallThumbnail'];

                  for (let index = 0; index < imageSetProps.length; index++) {
                    const element = imageSetProps[index];

                    if(imageSet[element]){
                      returnObj.isSuccessfull = true;
                      returnObj.msg = `*${element}* image found! url returned: ${imageSet[element]}`;
                      returnObj.url =  imageSet[element]

                      toConsole.info(`getGoogleApiImageUrl() - ${returnObj.msg}`);
                      resolve(returnObj);
                      return;
                    }
                  }

                  returnObj.isSuccessfull = false;
                  returnObj.msg = "error parsing imageSet!";
                  toConsole.error("getGoogleApiImageUrl() - "+returnObj.msg);
                  reject(returnObj);
                  return;
                }

                else{
                  returnObj.isSuccessfull = false;
                  returnObj.msg = "item not found";
                  toConsole.error("getGoogleApiImageUrl() - "+returnObj.msg);
                  reject(returnObj);
                  return;
                }

              } catch (e) {
                  returnObj.isSuccessfull = false;
                  returnObj.msg = "Error1 parsing Google API JSON!";
                  toConsole.error("getGoogleApiImageUrl() - "+returnObj.msg);
                  reject(returnObj);
                  return;
              }
          }
          else {
            returnObj.isSuccessfull = false;
            returnObj.msg = `Status:, ${res.statusCode}`;
            toConsole.error("getGoogleApiImageUrl() - "+returnObj.msg);
            reject(returnObj);
            return;
          }
      })
    }).on('error', (err)=> {
      returnObj.isSuccessfull = false;
      returnObj.msg = `Error3: ${err}`;
      toConsole.error("getGoogleApiImageUrl() - "+returnObj.msg);
      reject(returnObj);
      return;
    });
  });
};

function downloadAndSaveFile(uri, filename, ignore = []) {

  let response = {
    isSuccessfull: null,
    errors: []
  };

  toConsole.info(`tring to download file: ${uri}`);

  let options = {
    url: uri,
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3659.0 Safari/537.36'
    }
  };

  return new Promise((resolve, reject) => {

    if (!uri || !filename) {
      response.isSuccessfull = false;
      response.errors.push("supplied function argument(s) is/are invalid!");
      toConsole.error("supplied function argument(s) is/are invalid!");
      reject(response);
    }

    request.head(options, (err, res, body)=>{
      toConsole.info(`download request for ${filename} from ${uri} :`);
      toConsole.debug(`-target filename: "${filename}"`);

      if(!ignore.includes('statusCode')){
        if(res.statusCode !== HTTPstatusCodes.ok){
          response.errors.push(`External API returned a non-ok response: (${res.statusCode})`);
        }
      }

      if(!ignore.includes('mime')){
        if(res.headers['content-type'] !== mimeTypes.jpg){
          response.errors.push(`External API returned a bad MIME type: (${res.headers['content-type']})`);
        }
      }

      if(!ignore.includes('fileSize')){
        if(!res.headers['content-length'] || res.headers['content-length'] < 1){
          response.errors.push(`External API returned a small file size: (${res.headers['content-length']})`);
        }
      }

      if(response.errors.length > 0) {
        response.isSuccessfull = false;
        toConsole.warn(`Response Rejected: ${response.errors}`);
        toConsole.error(`the error was: ${err}`);
        toConsole.error(`error body: ${body}`)
        toConsole.error(`error body: ${JSON.stringify(body)}`)
        reject(response);
      }
      else{
        toConsole.info(`Response Accepted! Downloading the file...`)
        //actually download the file
        request(uri).pipe(fs.createWriteStream(filename)).on('close',()=>{
          response.isSuccessfull = true;
          resolve(response);
        });
      }
    });
  });
};

function isItemAvailableLocally(id,array) {

  if(!array || array.length === 0) {
    toConsole.error("the supplied source array is faulty!");
    return false;
  }
  else {
    if(array.indexOf(id.toString()) > -1){
      toConsole.info(`id ${id} found!`);
      return true;
    }
    else{
      toConsole.warn(`id ${id} NOT found locally! in [${array}]`);
      return false;
    }
  }
}

function serveUpImageFile(filename = '_testImage'){

  let returnObj = {};
  let pathName = `./bookCovers/${filename}.jpg`;

  return new Promise((resolve,reject)=>{

    // read file from file system
    fs.readFile(pathName, function(err, data){
      if(!err){
        // the file is found, serve it up
        returnObj.statusCode = HTTPstatusCodes.ok;
        returnObj.header = {type: 'Content-type', value: mimeTypes.jpg};
        returnObj.msg = `serving up file: ${filename}`;
        returnObj.data = data;
        toConsole.info(returnObj.msg);
        resolve(returnObj);
      }
      else {
        returnObj.statusCode = HTTPstatusCodes.InternalServerError;
        returnObj.msg = `Error getting the file: ${err}.`;
        toConsole.warn(`Error getting the file: ${err}.`);
        reject(returnObj);
      }
    });
  });
};

function indexLocalFileStorage(){
  // read the folder content

  toConsole.info("- Rebuilding local file index...");
  toConsole.info("- - reading local image store folder...");

  let returnObj = {};

  return new Promise((resolve, reject) => {
    fs.readdir('./bookCovers/',(err,content)=>{
      if (err) {
        returnObj.msg = `an error occured: ${err}`;
        returnObj.isSuccessfull = false;
        toConsole.error(`an error occured: ${err}`);
        reject(returnObj);
      }
      else {
        toConsole.info(`- - folder reading DONE. Found ${content.length} files.`);

        if (content.length > 0) {
          for (let i = 0; i < content.length; i++) {
            const element = content[i];
            bookCoverIndex.push(element.substring(0,element.lastIndexOf("."))); //strip out the filename, no folder, no extension
          }
        }
        bookCoverIndex = bookCoverIndex.sort();
        toConsole.debug(`The local image storage consists of: \n ${bookCoverIndex}`);
        returnObj.isSuccessfull = true;
        resolve(returnObj);
      }
    });
  });
}

function init(){

  /*** INITIALISE */
  toConsole.out(emoticons.whaleIn);
  toConsole.out(text.hello);
  toConsole.info("Initialising...");
  indexLocalFileStorage()
  .then((fromResolve)=>{
    toConsole.info("Initialising DONE.");
    toConsole.out(text.emptyLine);
    toConsole.info("Starting webserver");
    startServer();
  })
  .catch((fromReject)=>{
    toConsole.error(`${fromReject.msg}`);
    toConsole.error("application terminated");
    toConsole.out(emoticons.whaleOut);
  });
}

process.on("beforeExit", () => {
  toConsole.out(emoticons.whaleOut);
});



///section launch the app
init();


///section tests
//this is testing here:
//queryExternalApis();


function amazonTests() {
  //amazonAPI tests - successful:
  downloadAndSaveFile(externalApiUrls.amazon1('0451530292'),`bookCovers/${'0451530292'}-TEST1.jpg`).then(
    (val)=>{
      console.log(val);
    }).catch(
    (err)=>{
    console.log(err);
  });
/*
  //amazonAPI tests - faliure:
  downloadAndSaveFile(externalApiUrls.amazon1(1942755002),`bookCovers/${1942755002}-TEST2.jpg`)
  .then((val)=>{
    console.log(val);
    })
  .catch((err)=>{
    console.log(err);
  });

  */
};

//amazonTests();

function googleTests() {
/*
  //google imageAPI url lookup - sucess
  getGoogleApiImageUrl(9780553804577)
  .then((val)=>{
    console.log(JSON.stringify(val));
  })
  .catch((err)=>{
    console.log(JSON.stringify(err));
  });
*/
/*
  //google imageAPI url lookup faliure
  getGoogleApiImageUrl(9780556664577)
  .then((val)=>{
    console.log(JSON.stringify(val));
  })
  .catch((err)=>{
    console.log(JSON.stringify(err));
  });
*/
  //google api download test (involving successfull imageAPI)
  getGoogleApiImageUrl(9780553804577)
  .then((val)=>{
    console.log(JSON.stringify(val));

    downloadAndSaveFile(val.url,`bookCovers/${9780553804577}-TEST11.jpg`).then(
      (val)=>{
        console.log(val);
      }).catch(
      (err)=>{
      console.log(err);
    });

  })
  .catch((err)=>{
    console.log(JSON.stringify(err));
  });
};

//googleTests();

//openLib tests
function openLibTests() {
  //openLibTests - successful:
  downloadAndSaveFile(externalApiUrls.openLib('0451530292'),`bookCovers/${'0451530292'}-TEST21.jpg`,['fileSize']).then(
    (val)=>{
      console.log(val);
    }).catch(
    (err)=>{
    console.log(err);
  });

  //openLibTests - faliure:
  downloadAndSaveFile(externalApiUrls.openLib(0451530555),`bookCovers/${0451530555}-TEST2.jpg`,['fileSize'])
  .then((val)=>{
    console.log(val);
    })
  .catch((err)=>{
    console.log(err);
  });
};

//queryExternalApis tests
function queryExternalApis_Test(isbn){
/*
// this one's valid amazon isbn = 1942788002
// this one's valid google isbn = 9780553804577
// this one's valid openLib isbn = 28419896
*/

  queryExternalApis(isbn).then((val)=>{
    console.log("ended with SUCCESS");
    console.log(JSON.stringify(val));
  })
  .catch((err)=>{
    console.log("ended with FALIURE");
    console.log(JSON.stringify(err));
  });

}

//queryExternalApis_Test('28419896');