const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

module.exports = {
    DBURL: process.env.DB_URL,
    DBPort: process.env.DB_PORT,
    DBUserName: process.env.DB_USER,
    DBPass: process.env.DB_PASS,
    DBName: process.env.DB_NAME,
    WebServerPort: process.env.WEBSERVER_PORT,

    getGoogleBooksInfoAPIURL: function(ISBN) {
        return `https://books.google.com/books?jscmd=viewapi&callback=info&bibkeys=ISBN${ISBN}`;
    }

    //Vtest: "testZZZ"  // stuff can be injected here, if needed
};