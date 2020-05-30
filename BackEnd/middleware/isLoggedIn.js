exports.isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/auth/login');
        //res.sendStatus(401);
    }
}