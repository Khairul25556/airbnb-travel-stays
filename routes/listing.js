const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

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
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show Router
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

//Create Router
router.post("/", validateListing, wrapAsync(async(req, res, next) => {
    //Normal way
    // let {title, description, image, price, country, location} = req.body;
    // let newList = new Listing ({
    //     title: title,
    //     description: description,
    //     image: image,
    //     price: price,
    //     country: country,
    //     location: location
    // });
    // console.log(newList);

    //Advance way
    // let listing = req.body.listing;
    // const newListing = new Listing(listing);

    //Advance way(shortcut)   
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit Router
router.get("/:id/edit", wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//Update Router
router.put("/:id", validateListing, wrapAsync(async(req, res) => {
    let {id} = req.params;
    //Without the ..., like this: await Listing.findByIdAndUpdate(id, req.body.listing);
    //we used ... for: Take all key-value pairs from req.body.listing and spread them into a new object.(id wont be count)
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delte Router
router.delete("/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;