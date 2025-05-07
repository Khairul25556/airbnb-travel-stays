module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //This line remembers the page the user originally tried to visit before being forced to log in.
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};