const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const env = require('../_env');


passport.use(new GoogleStrategy({
    clientID: env.GoogleClientID,
    clientSecret: env.GoogleClientSecret,
    callbackURL: `${env.BackendServerBaseURL}:${env.BackendServerPort}/api/auth/googleCallback`
},
    function (accessToken, refreshToken, profile, done) {

        //have accedd to data here as well, but this is a "dead-end" function....

        //console.log(accessToken);
        //console.log(refreshToken);
        //console.log("AUTH HANDLER HERE *****************");
        //console.log(profile._json);

        return done(null, profile);
    }
));