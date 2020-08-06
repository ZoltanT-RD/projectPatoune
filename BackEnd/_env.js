const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

module.exports = {
    DBURL: process.env.DB_URL,
    DBPort: process.env.DB_PORT,
    DBUserName: process.env.DB_USER,
    DBPass: process.env.DB_PASS,
    DBName: process.env.DB_NAME,

    BackendServerBaseURL: process.env.BACKENDSERVER_BASEURL,
    BackendServerPort: process.env.BACKENDSERVER_PORT,

    WebServerBaseURL: process.env.WEBSERVER_BASEURL,
    WebServerPort: process.env.WEBSERVER_PORT,

    emulateDB: process.env.EMULATE_DB === "true" ? true : false,

    GoogleClientID: process.env.GOOGLE_CLIENT_ID,
    GoogleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

    ///fixme this shouldn;t be here really...
    getGoogleBooksInfoAPIURL: function(ISBN) {
        return `https://books.google.com/books?jscmd=viewapi&callback=info&bibkeys=ISBN${ISBN}`;
    }

    //Vtest: "testZZZ"  // stuff can be injected here, if needed
};