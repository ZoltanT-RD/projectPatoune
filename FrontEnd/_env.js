const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

module.exports = {
    //eg: DBURL: process.env.DB_URL

    Vtest: "testZZZ"  // stuff can be injected here, if needed
};