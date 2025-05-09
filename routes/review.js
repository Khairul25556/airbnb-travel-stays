const express = require("express");
const router = express.Router({ mergeParams: true }); 
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewwAuthor} = require("../middleware.js");

//Reviews Router
router.post("/",isLoggedIn, validateReview, wrapAsync(async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Big thanks for the review!");
    res.redirect(`/listings/${id}`);
}));

//Review Delete Router
router.delete("/:reviewId", isLoggedIn, isReviewwAuthor, wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}));


module.exports = router;