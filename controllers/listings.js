const Listing = require("../models/listing");

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

module.exports.createListing = async(req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    //Advance way(shortcut)   
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New list created successfully!");
    res.redirect("/listings");
};

module.exports.editListing = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Oops! No stays found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async(req, res) => {
    let {id} = req.params;
    //Without the ..., like this: await Listing.findByIdAndUpdate(id, req.body.listing);
    //we used ... for: Take all key-value pairs from req.body.listing and spread them into a new object.(id wont be count)
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "List updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "List Deleted!");
    res.redirect("/listings");
};
