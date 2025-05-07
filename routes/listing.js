const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// const functionName = (req, res, next) => {
    // logic
// };

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
};

//Index Router
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
}));

//new Router
router.get("/new", isLoggedIn,(req, res) => {
    res.render("listings/new.ejs");
});

//Show Router
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","Oops! No stays found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

//Create Router
router.post("/", isLoggedIn, validateListing, wrapAsync(async(req, res, next) => {
    //Advance way(shortcut)   
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New list created successfully!");
    res.redirect("/listings");
}));

//Edit Router
router.get("/:id/edit", isLoggedIn, wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Oops! No stays found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

//Update Router
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async(req, res) => {
    let {id} = req.params;
    //Without the ..., like this: await Listing.findByIdAndUpdate(id, req.body.listing);
    //we used ... for: Take all key-value pairs from req.body.listing and spread them into a new object.(id wont be count)
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "List updated");
    res.redirect(`/listings/${id}`);
}));

//Delte Router
router.delete("/:id", isLoggedIn, wrapAsync(async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "List Deleted!");
    res.redirect("/listings");
}));

module.exports = router;