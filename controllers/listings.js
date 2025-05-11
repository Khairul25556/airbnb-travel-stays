const Listing = require("../models/listing");
const fetch = require("node-fetch"); 

module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Oops! No stays found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};


module.exports.createListing = async (req, res, next) => {
    // Geocoding
    const query = `${req.body.listing.location}, ${req.body.listing.country}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'airbnb-travel-stays/1.0 (krft44@gmail.com)' // this must be set
        }
    });
    const data = await response.json();

    const coordinates = data[0]
        ? [parseFloat(data[0].lon), parseFloat(data[0].lat)]
        : null;

    if (!coordinates) {
        req.flash("error", "Location not found. Try again.");
        return res.redirect("/listings/new");
    }

    // Image data
    const urlImg = req.file.path;
    const filename = req.file.filename;

    // Create new listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url: urlImg, filename };

    // Set geometry field
    newListing.geometry = {
        type: "Point",
        coordinates: coordinates // [longitude, latitude]
    };

    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
};



module.exports.editListing = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Oops! No stays found");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing , originalImageUrl});
};

module.exports.updateListing = async(req, res) => {

    let {id} = req.params;
    //Without the ..., like this: await Listing.findByIdAndUpdate(id, req.body.listing);
    //we used ... for: Take all key-value pairs from req.body.listing and spread them into a new object.(id wont be count)
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "List updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "List Deleted!");
    res.redirect("/listings");
};
