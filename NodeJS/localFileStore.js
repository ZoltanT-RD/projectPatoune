/**
 * @author Zoltan Tompa
 * @email zoltan@resdiary.com
 * @create date 2019-01-04 11:10:34
 * @modify date 2019-01-04 11:10:34
 * @desc [description]
 */

const fs = require('fs');
const chatty = require('./chatty');
const HTTPstatusCodes = require('./HTTPstatusCodes');
const mimeTypes = require('./mimeTypes');


const zout = {
    out: (msg)=>{chatty.toConsole.out(msg)},
    debug: (msg)=>{chatty.toConsole.debug(msg,moduleName)},
    info: (msg)=>{chatty.toConsole.info(msg,moduleName)},
    warn: (msg)=>{chatty.toConsole.warn(msg,moduleName)},
    error: (msg)=>{chatty.toConsole.error(msg,moduleName)},
  };

//this has to be set for every module
const moduleName = "localFileStore";

var bookCoverIndex = []; //this is used to store the locally stored coverId-s, populated on every init()!
let isbnTestArray = ['0451498291', '1942788002', '1720651353', 'ERRORTEST', '1788996402', '1491904909', '0955683645', '1947667009', '1537732730'];


function indexLocalFileStorage() {
    // read the folder content

    zout.info("- Rebuilding local file index...");
    zout.info("- - reading local image store folder...");

    let returnObj = {};

    return new Promise((resolve, reject) => {
        fs.readdir('./bookCovers/', (err, content) => {
            if (err) {
                returnObj.msg = `an error occured: ${err}`;
                returnObj.isSuccessfull = false;
                zout.error(`an error occured: ${err}`);
                reject(returnObj);
            }
            else {
                zout.info(`- - folder reading DONE. Found ${content.length} files.`);

                if (content.length > 0) {
                    for (let i = 0; i < content.length; i++) {
                        const element = content[i];
                        bookCoverIndex.push(element.substring(0, element.lastIndexOf("."))); //strip out the filename, no folder, no extension
                    }
                }
                bookCoverIndex = bookCoverIndex.sort();
                zout.debug(`The local image storage consists of: \n ${bookCoverIndex}`);
                returnObj.isSuccessfull = true;
                resolve(returnObj);
            }
        });
    });
}

function serveUpImageFile(filename = '_testImage') {

    let returnObj = {};
    let pathName = `./bookCovers/${filename}.jpg`;

    return new Promise((resolve, reject) => {

        // read file from file system
        fs.readFile(pathName, function (err, data) {
            if (!err) {
                // the file is found, serve it up
                returnObj.statusCode = HTTPstatusCodes.ok;
                returnObj.header = { type: 'Content-type', value: mimeTypes.jpg };
                returnObj.msg = `serving up file: ${filename}`;
                returnObj.data = data;
                zout.info(returnObj.msg);
                resolve(returnObj);
            }
            else {
                returnObj.statusCode = HTTPstatusCodes.InternalServerError;
                returnObj.msg = `Error getting the file: ${err}.`;
                zout.warn(returnObj.msg);
                reject(returnObj);
            }
        });
    });
};

function isItemAvailable(id) {

    zout.info(`looking for the file ${id}`);

    if (!bookCoverIndex) {
        zout.error("the supplied source array is faulty!");
        return false;
    }
    else {
        if (bookCoverIndex.indexOf(id.toString()) > -1) {
            zout.info(`id ${id} found!`);
            return true;
        }
        else {
            zout.warn(`id ${id} NOT found locally! in [${bookCoverIndex}]`);
            return false;
        }
    }
}

module.exports = {
    isItemAvailable: isItemAvailable,
    serveUpImageFile: serveUpImageFile,
    indexLocalFileStorage: indexLocalFileStorage
}