const http = require('http');

const server = http.createServer((req, resp) =>{
    if (req.url === '/') {
        resp.write('Hello there! =]');
        resp.end();
    }
});
server.listen(9875);
console.log("Listening on 9875");


const download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);

      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };


var fs = require('fs');
request = require('request');

//test target= http://ec2.images-amazon.com/images/P/1942788002.01._SCRM_.jpg

//http://ec2.images-amazon.com/images/P/<<ASIN / ISBN-10>>._SCRM_.jpg
//needs testing as well… might not work with all books...

let ISBN10 = 1942788002;
let imageDownloadLink = (`http://ec2.images-amazon.com/images/P/${ISBN10}.01._SCRM_.jpg`);
let outputFileName = (`book_${ISBN10}.jpg`);
console.log(`constructed download url: ${imageDownloadLink}`);


download(imageDownloadLink, outputFileName, function(){
  console.log('done - file downloaded');
});
