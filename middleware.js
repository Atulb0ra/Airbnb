module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;//used to redirect to the same page after login
        req.flash("error", "You must be logged in to create a new listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}