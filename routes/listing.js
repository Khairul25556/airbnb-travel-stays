const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

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
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
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
    console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New list created successfully!");
    res.redirect("/listings");
}));

//Edit Router
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Oops! No stays found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

//Update Router
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async(req, res) => {
    let {id} = req.params;
    //Without the ..., like this: await Listing.findByIdAndUpdate(id, req.body.listing);
    //we used ... for: Take all key-value pairs from req.body.listing and spread them into a new object.(id wont be count)
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "List updated");
    res.redirect(`/listings/${id}`);
}));

//Delete Router
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "List Deleted!");
    res.redirect("/listings");
}));

module.exports = router;