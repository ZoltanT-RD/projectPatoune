/**
 * @author Zoltan Tompa
 * @email zoltan@resdiary.com
 * @create date 2018-12-06 11:26:27
 * @modify date 2019-01-04 12:15:25
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

*/

///todo implement Promise-chain + use "timeout trick" for api taking too long?



///section IMPORTS
const http = require('http');

const chatty = require('./chatty');
const localFileStore = require('./localFileStore');
const coverDownloader = require('./coverDownloader');
const HTTPstatusCodes = require('./HTTPstatusCodes');



//this has to be set for every module
const moduleName = "base";



process.on("beforeExit", () => {
  zout.out(chatty.emoticons.whaleOut);
});




///todo do request query parsing, eg. remove - s from isbn, remove funky characters etc...

///todo console messages need testing properly

///idea: add christmass easter-eggs! eg. santa hat to the logo, snow falling, "ho ho ho" to texts, etc...



const server = http.createServer((req, resp) =>{
  httpRouter(req, resp);
});

const fileNotFoundRule = {
  returnError: 0,
  returnPlaceholderImage: 1
};

const zout = {
  out: (msg)=>{chatty.toConsole.out(msg)},
  debug: (msg)=>{chatty.toConsole.debug(msg,moduleName)},
  info: (msg)=>{chatty.toConsole.info(msg,moduleName)},
  warn: (msg)=>{chatty.toConsole.warn(msg,moduleName)},
  error: (msg)=>{chatty.toConsole.error(msg,moduleName)},
};


///section SETTINGS
///todo move these over to proper config handling ... https://codewithmosh.com/courses/293204/lectures/4509846 (express advenced / 7. lecture)
const settings = {
  enableExternalFileFetching : true,
  fileNotFoundRule: fileNotFoundRule.returnPlaceholderImage,
  fileNotFoundImage: '_coverNotFound',
  consoleChattyness: chatty.consoleChattynessRule.debugAndAbove,
  webserverPortNo: process.env.PORT || 1966
};
chatty.setConsoleChattyness(settings.consoleChattyness);



///section INVOKED FUNCTIONS

function startServer() {
  server.listen(settings.webserverPortNo);
  zout.info(`Listening on port ${settings.webserverPortNo}`);
  zout.out(chatty.text.emptyLine);
}

async function httpRouter(req,resp){

  if(!req || !resp){
    zout.error("Internal server error!");
    return;
  }

  //only allow GET requests
  if (req.method !== 'GET') {
    resp.statusCode = HTTPstatusCodes.methodNotAllowed;
    resp.write(chatty.text.hello);
    resp.write(chatty.text.onlyGet);
    resp.end();
  }

  let reqObject = require('url').parse(req.url);
  let pathArray =  reqObject.pathname.split("/");

  pathArray.shift(); //[0] is always empty, so remove that
  pathArray.forEach((element)=> { //convert strings to lowercase
    element = element.toLowerCase;
  });

  zout.info(`NEW REQUEST (${req.method}) for *${pathArray}*`);
  zout.debug(`the method of the request was: ${req.method}`);
  zout.debug(`the path-part of the request:*${pathArray}*`);

  switch (pathArray[0]) {
    case '':
      resp.statusCode = HTTPstatusCodes.ok;
      resp.write(chatty.text.hello);
      resp.end();
      return;

    case 'me':
      resp.statusCode = HTTPstatusCodes.ok;
      resp.write(chatty.text.me);
      resp.end();
      return;

    case 'teapot':
      resp.statusCode = HTTPstatusCodes.ImATeapot;
      resp.write("Im a teapot :P");
      resp.end();
      ///idea: implement teapot protocol/response! eg.; https://www.google.com/teapot  -> http://ascii.co.uk/art/teapot (the middle one)
      return;

    case 'givemeanimage':
      localFileStore.serveUpImageFile('_testImage')
        .then((fromResolve)=>{
          resp.statusCode = fromResolve.statusCode;
          resp.setHeader(fromResolve.header.type,fromResolve.header.value);
          resp.end(fromResolve.data);
          zout.info("REQUEST was fulfilled "+ chatty.emoticons["*\\(^o^)/*"]);
          zout.out(chatty.text.emptyLine);
        }).catch((fromReject)=>{
          zout.debug(`/givemeanimage fromReject: ${JSON.stringify(fromReject)}`);
          resp.statusCode = fromReject.statusCode;
          resp.write = fromReject.msg;
          resp.end();
      });
      return;

    case 'bookcover':
      switch (pathArray[1]) {
        case 'isbn10':
          zout.info(`you were searching for: ISBN10 : *${reqObject.query}*`);

          if(isQueriedStringValid(reqObject.query,'isbn10')) {
            zout.debug(`the query sting *${reqObject.query}* is VALID!`);

            try{
              let fromResolve = await tryToFindFile(reqObject.query,'isbn10');

              zout.info(`requested file being served...`);
              resp.statusCode = fromResolve.statusCode;
              resp.setHeader(fromResolve.header.type,fromResolve.header.value);
              resp.end(fromResolve.data);
              zout.info("REQUEST was fulfilled "+ chatty.emoticons["*\\(^o^)/*"]);
              zout.out(chatty.text.emptyLine);
            }
            catch (error) {
              zout.error(`this have been rejected: ${JSON.stringify(resp)}`);
              resp.statusCode = resp.statusCode;
              resp.write(resp.msg);
              resp.end();
            };
          }
          else{
            zout.warn(`the query sting *${reqObject.query}* is INVALID!`);
            resp.write(`error: the query sting *${reqObject.query}* is INVALID!`);
            resp.end();
          }

          return;

        case 'isbn13':
          zout.info(`you were searching for: ISBN13: *${reqObject.query}*`);
          resp.write(`you were searching for: ISBN13: *${reqObject.query}*`);
          resp.write(chatty.text.xNotImplemented("isbn13"));
          ///todo implement isbn 13

          resp.end();
          return;

        case 'asin':
          resp.statusCode = HTTPstatusCodes.notFound;
          resp.write(chatty.text.xNotImplemented('ASIN'));
          resp.end();
          ///todo implement asin
          return;

        case 'ean':
          resp.statusCode = HTTPstatusCodes.notFound;
          resp.write(chatty.text.xNotImplemented('EAN'));
          resp.end();
          ///todo implement ean
          return;

        default:
          resp.write('Are you looking for a book-cover?! You\'re at the right place my friend! '+ chatty.emoticons["(^_*)"]);
          resp.write('\n simply type "isbn10" / "isbn13" / "asin" / " ean" a "?" and the identifier itself.');

          resp.end();
          return;
      }

    default:
      resp.statusCode = HTTPstatusCodes.badRequest;
      resp.write(chatty.text.badRequest);
      resp.write(JSON.stringify(reqObject));
      zout.warn("REQUEST was REJECTED "+ chatty.emoticons["(-,,-)"]);
      zout.out(chatty.text.emptyLine);
      resp.end();
      return;
  }
}

///idea consider switching to this lib. instead, tho' not mandatory.... https://www.npmjs.com/package/joi
function isQueriedStringValid(q,type){
  let regNumbersOnly = new RegExp("^[0-9]*$");

  if (q && type && q !=='' && type !== '') {
    zout.debug(`type of the "${q}" is ${typeof parseInt(q)}`);

    switch (type) {
      case 'isbn10':
        if (q.length === 10 && regNumbersOnly.test(q)) {
          return true;
        }
        zout.error(chatty.text.xIsInvalid("isbn10"));
        return false;

      case 'isbn13':
        if (q.length === 13 && regNumbersOnly.test(q)) {
          return true;
        }
        zout.error(chatty.text.xIsInvalid("isbn13"));
        return false;

      default:
        zout.error(chatty.text.xIsInvalid());
        return false;
    }
  }
  else
    zout.error("type or q is invalid!");
    return false;
}

async function tryToFindFile(query,type){

  let returnObj = {};

  if (!query || !type) {
    returnObj.statusCode = HTTPstatusCodes.badRequest;
    returnObj.msg ="bad parameters supplied";
    zout.error(returnObj.msg);
    return Promise.reject(returnObj);
  }

  if(localFileStore.isItemAvailable(query)){
    return Promise.resolve(localFileStore.serveUpImageFile(query));
  }

  else { //if file not found locally

    if(settings.enableExternalFileFetching){

      try {
        const externalResults = await coverDownloader.queryExternalApis(query);
        zout.debug(externalResults);
        zout.debug("THAT'S ME HEREEEEEEEEEEE");
        return Promise.resolve(localFileStore.serveUpImageFile(query));
      } catch (error) {
        //if APIs couldn't find the file
        zout.warn(externalResults);

        if (settings.fileNotFoundRule === fileNotFoundRule.returnPlaceholderImage) {
          zout.info("as per fileNotFoundRule setting; serving up returnPlaceholderImage instead of the requested (not found) file.");
          return Promise.resolve(localFileStore.serveUpImageFile(settings.fileNotFoundImage));
        }
        else if (settings.fileNotFoundRule === fileNotFoundRule.returnError) {
              returnObj.statusCode = HTTPstatusCodes.notFound;
              returnObj.msg = `Error getting the file. It's not found locally, and extrenal services are disabled!`;
              zout.error(returnObj.msg);
              return Promise.reject(returnObj);
            }
        }
      }

    else { //if external APIs are disabled in settings

      if (settings.fileNotFoundRule === fileNotFoundRule.returnPlaceholderImage) {
        return Promise.resolve(localFileStore.serveUpImageFile(settings.fileNotFoundImage));
      }
      else if (settings.fileNotFoundRule === fileNotFoundRule.returnError) {
        return new Promise((resolve, reject) => {
          returnObj.statusCode = HTTPstatusCodes.notFound;
          returnObj.msg = `Error getting the file. It's not found locally, and extrenal services are disabled!`;
          zout.error(returnObj.msg);
          reject(returnObj);
        });
      }
      else {
        return new Promise((resolve, reject) => {
            zout.error(`settings.fileNotFoundRule is not handled properly!`);
            returnObj.statusCode = HTTPstatusCodes.InternalServerError;
            reject(returnObj);
        });
      }
    }
  }



};



function init(){

  /*** INITIALISE */
  zout.out(chatty.emoticons.whaleIn);
  zout.out(chatty.text.hello);
  zout.info("Initialising...");

  localFileStore.indexLocalFileStorage()
  .then((fromResolve)=>{
    zout.info("Initialising DONE.");
    zout.out(chatty.text.emptyLine);
    zout.info("Starting webserver");
    startServer();
  })
  .catch((fromReject)=>{
    zout.error(`${fromReject.msg}`);
    zout.error("application terminated!");
    zout.out(chatty.emoticons.whaleOut);
  });
}


///section launch the app
init();