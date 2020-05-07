const chatty = require('./chatty');
const localFileStore = require('./localFileStore');


///section tests
//this is testing here:
//queryExternalApis();


function amazonTests() {
  //amazonAPI tests - successful:
  downloadAndSaveFile(externalApiUrls.amazon1('0451530292'), `bookCovers/${'0451530292'}-TEST1.jpg`).then(
    (val) => {
      console.log(val);
    }).catch(
      (err) => {
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
    .then((val) => {
      console.log(JSON.stringify(val));

      downloadAndSaveFile(val.url, `bookCovers/${9780553804577}-TEST11.jpg`).then(
        (val) => {
          console.log(val);
        }).catch(
          (err) => {
            console.log(err);
          });

    })
    .catch((err) => {
      console.log(JSON.stringify(err));
    });
};

//googleTests();

//openLib tests
function openLibTests() {
  //openLibTests - successful:
  downloadAndSaveFile(externalApiUrls.openLib('0451530292'), `bookCovers/${'0451530292'}-TEST21.jpg`, ['fileSize']).then(
    (val) => {
      console.log(val);
    }).catch(
      (err) => {
        console.log(err);
      });

  //openLibTests - faliure:
  downloadAndSaveFile(externalApiUrls.openLib(0451530555), `bookCovers/${0451530555}-TEST2.jpg`, ['fileSize'])
    .then((val) => {
      console.log(val);
    })
    .catch((err) => {
      console.log(err);
    });
};

//queryExternalApis tests
function queryExternalApis_Test(isbn) {
  /*
  // this one's valid amazon isbn = 1942788002
  // this one's valid google isbn = 9780553804577
  // this one's valid openLib isbn = 28419896
  */

  queryExternalApis(isbn).then((val) => {
    console.log("ended with SUCCESS");
    console.log(JSON.stringify(val));
  })
    .catch((err) => {
      console.log("ended with FALIURE");
      console.log(JSON.stringify(err));
    });

}

//queryExternalApis_Test('28419896');


function test1() {
  localFileStore.transModulePromiseTest1()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
}

function test2() {
  localFileStore.indexLocalFileStorage()
    .then((res) => {
      console.log("OK");
      console.log(JSON.stringify(res));
    })
    .catch((err) => {
      console.log("ERROR");
      console.error(JSON.stringify(err));
    });
}



test2();