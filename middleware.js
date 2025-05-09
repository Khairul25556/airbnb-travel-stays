const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

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

module.exports.isOwner = async (req, res, next) => {
        let {id} = req.params;
        let listing = await Listing.findById(id);
        if(!listing.owner.equals(res.locals.currUser._id)){
            req.flash("error", "You are not owner of this list!");
            return res.redirect(`/listings/${id}`);
        }
        next();
}

// const functionName = (req, res, next) => {
    // logic
// };

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
};

module.exports.isReviewwAuthor = async (req, res, next) => {
        let {id, reviewId} = req.params;
        let review = await Review.findById(reviewId);
        if(!review.author.equals(res.locals.currUser._id)){
            req.flash("error", "You are not the author of this review!");
            return res.redirect(`/listings/${id}`);
        }
        next();
}