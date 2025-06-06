const Listing = require("../models/listing.js");

module.exports.index = async (req, res) =>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req,res) =>{
    console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req, res) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "Successfully created a new listing");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing = async (req, res) => {
    const {id} = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url, filename};
       // res.redirect("/listings/" + id);  METHOD _1
       await updatedListing.save();
    }
    req.flash("success", "Successfully updated a listing");
    res.redirect(`/listings/${id}`); // METHOD _2
}

module.exports.deleteListing = async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a listing");
    res.redirect("/listings");
}
