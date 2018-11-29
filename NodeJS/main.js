const http = require('http');
const fs = require('fs');
const request = require('request');

var bookCoverIndex = [];

/*
  listening http server

const server = http.createServer((req, resp) =>{
    if (req.url === '/') {
        resp.write('Hello there! =]');
        resp.end();
    }
});
server.listen(9875);
console.log("Listening on 9875");
*/


function downloadAndSaveFile(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);

      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };




//test target= http://ec2.images-amazon.com/images/P/1942788002.01._SCRM_.jpg

//http://ec2.images-amazon.com/images/P/<<ASIN / ISBN-10>>._SCRM_.jpg
//needs testing as well… might not work with all books...


let ISBN10 = '0451498291';

let isbnTestArray = ['0451498291','1942788002','1720651353','1788996402','1491904909','0955683645','1947667009','1537732730'];

let imageDownloadLinkTemplate = (`http://ec2.images-amazon.com/images/P/${ISBN10}.01._SCRM_.jpg`);
//also this works; https://images-na.ssl-images-amazon.com/images/P/1720651353.jpg
//but both fail to find a lot...

let outputFileName = (`bookCovers/${ISBN10}_book_isbn10.jpg`);
console.log(`constructed download url: ${imageDownloadLinkTemplate}`);
//todo: need to handle cases when image is not found...


for (let index = 0; index < isbnTestArray.length; index++) {
  const element = isbnTestArray[index];

  downloadAndSaveFile(
    `http://ec2.images-amazon.com/images/P/${element}.01._SCRM_.jpg`,
    `bookCovers/${element}_book_isbn10.jpg`,
    function(){
      console.log('done - file downloaded');
  });
}

/*
downloadAndSaveFile(imageDownloadLinkTemplate, outputFileName, function(){
  console.log('done - file downloaded');
});
*/



function init(){

  /*** INITIALISE */
  console.log("Initialising...");

  /* read the folder content */

  console.log("- Rebuilding local file index...");
  console.log("- - reading local image store folder ...");

  fs.readdir('./bookCovers/',(err,content)=>{
    if (err) {
      console.log(`!!! an error occured: ${err}`);
    }
    else {
      console.log(`- - folder reading DONE. Found ${content.length} files.`);
      bookCoverIndex = content.sort();
      console.log(bookCoverIndex);
    }
  });
}