

let definitions = {



    Book: {
        //REQUIRED
        "id": "book::UUID",

        //REQUIRED
        "DocType": "book",

        //REQUIRED
        "Title": "The Linux Command Line: A Complete Introduction",

        //OPTIONAL
        "UserProvidedTitle": "the linux",

        //OPTIONAL
        "Subtitle": "",

        //REQUIRED
        "SummaryText": //url encoded, to allow html
            "ou%27ve%20experienced%20the%20shiny%2C%20point-and-click%20surface%20of%20your%20Linux%20computer%E2%80%94now%20dive%20below%20and%20explore%20its%20depths%20with%20the%20power%20of%20the%20command%20line.%20The%20Linux%20Command%20Line%20takes%20you%20from%20your%20very%20first%20terminal%20keystrokes%20to%20writing%20full%20programs%20in%20Bash%2C%20the%20most%20popular%20Linux%20shell.%20Along%20the%20way%20you%27ll%20learn%20the%20timeless%20skills%20handed%20down%20by%20generations%20of%20gray-bearded%2C%20mouse-shunning%20gurus%3A%20file%20navigation%2C%20environment%20configuration%2C%20command%20chaining%2C%20pattern%20matching%20with%20regular%20expressions%2C%20and%20more.%20In%20addition%20to%20that%20practical%20knowledge%2C%20author%20William%20Shotts%20reveals%20the%20philosophy%20behind%20these%20tools%20and%20the%20rich%20heritage%20that%20your%20desktop%20Linux%20machine%20has%20inherited%20from%20Unix%20supercomputers%20of%20yore.%20As%20you%20make%20your%20way%20through%20the%20book%27s%20short%2C%20easily-digestible%20chapters%2C%20you%27ll%20learn%20how%20to%3A%20Create%20and%20delete%20files%2C%20directories%2C%20and%20symlinks%20Administer%20your%20system%2C%20including%20networking%2C%20package%20installation%2C%20and%20process%20management%20Use%20standard%20input%20and%20output%2C%20redirection%2C%20and%20pipelines%20Edit%20files%20with%20Vi%2C%20the%20world%27s%20most%20popular%20text%20editor%20Write%20shell%20scripts%20to%20automate%20common%20or%20boring%20tasks%20Slice%20and%20dice%20text%20files%20with%20cut%2C%20paste%2C%20grep%2C%20patch%2C%20and%20sed%20Once%20you%20overcome%20your%20initial%20%22shell%20shock%2C%22%20you%27ll%20find%20that%20the%20command%20line%20is%20a%20natural%20and%20expressive%20way%20to%20communicate%20with%20your%20computer.%20Just%20don%27t%20be%20surprised%20if%20your%20mouse%20starts%20to%20gather%20dust.",

        //REQUIRED
        "Authors": [
            "William E. Shotts Jr."
        ],

        //OPTIONAL
        "UserProvidedAuthors": "",

        //REQUIRED
        "3rdPartyIDs":{
            "ISBN-10": "1593273894",    //validate for 10 chars!
            "ISBN-13": "978-1593273897",
            //REQUIRED
            "ASIN": "1593273894",
            //REQUIRED
            "GoogleBooksID": "ggfjAAAACAAJ"
        },

        //REQUIRED
        "Details": {
            "Edition": "Paperback – 17 Jan. 2012", //old "subtitle"
            "PageCount": 480,
            "Publisher": "No Starch Press, Incorporated; 1 edition (17 Jan. 2012)",
            "Language": "English",
            "ProductDimensions": "21.6 x 2.8 x 27.9 cm",
            "AmazonCustomerReviews": {
                "stars": "4.7 out of 5 stars",
                "totalCustomerRatings": 407
            }
        },

        //OPTIONAL -> only for imported books
        "isVerifiedImport": false, //this is to flag if an Admin double checked the imported books

        "Request": {
            "CreatedTimeStamp": 132456789, //unix timestamp
            "UserID": "user::UUID",
            "Status" : {
            // enum: ['pending', 'ordered', 'available', 'rejected']
            },
            "UserProvidedAmazonURL": "", //
            "UserComment": "", //eg; "url for cheaper verison"
            "AdminComment": "" //eg; "rejected coz' not approrpiate"
        },



        // "Images" are stored on separate "file-server", by `book::UUID`, returned by different API
/*
        "Gallery": [
            {
                "mainUrl": "https://images-na.ssl-images-amazon.com/images/I/81VL36SBBmL.jpg",
                "dimensions": [
                    1931,
                    2560
                ],
                "thumbUrl": "https://images-na.ssl-images-amazon.com/images/I/81VL36SBBmL._AC_SX75_CR,0,0,75,75_.jpg"
            },
            {
                "mainUrl": "https://images-na.ssl-images-amazon.com/images/I/51ShEM1RxYL.jpg",
                "dimensions": [
                    378,
                    500
                ],
                "thumbUrl": "https://images-na.ssl-images-amazon.com/images/I/51ShEM1RxYL._AC_SX75_CR,0,0,75,75_.jpg"
            },
            {
                "mainUrl": "https://images-na.ssl-images-amazon.com/images/I/41rcEcznHBL.jpg",
                "dimensions": [
                    375,
                    500
                ],
                "thumbUrl": "https://images-na.ssl-images-amazon.com/images/I/41rcEcznHBL._AC_SX75_CR,0,0,75,75_.jpg"
            }
        ]
*/
    },


    Review: {
        //REQUIRED
        "id": "book::UUID::"+"review:UserID", //this assumes one review per user allowed

        //REQUIRED
        "docType": "review",

        //REQUIRED
        "rating": "not sure yet, stars?",

        //REQUIRED
        "reviewText": "absolutely brilliant, would totally recommend"
    },



    User: {
        //REQUIRED
        "id": "user::UUID",

        //REQUIRED
        "DocType": "user",

        //REQUIRED
        "email": "example@resdiary.com",

        //REQUIRED
        "isAdmin": false,

        //REQUIRED
        "fullName": "Jane Doe"
    }
}