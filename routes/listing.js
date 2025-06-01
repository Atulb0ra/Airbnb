const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req, res, next) =>{
    console.log('Incoming request body:', req.body);
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next()
    }
};

//Index Route
router.get("/", wrapAsync(async (req, res) =>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", {allListings});
}));

//New Route
router.get("/new", isLoggedIn, (req,res) =>{
    console.log(req.user);
    res.render("listings/new.ejs");
});

// show Route
router.get("/:id", wrapAsync(async(req, res) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}));


// create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    // let {title, description, image, price, location, country} = req.body  
    // METHOD -1 when name is these field

    // Method -2 when we pass object of fields
    // try{
    //     const newListing = new Listing(req.body.listing);
    //     await newListing.save();
    //     res.redirect("/listings");
    // }catch(err){
    //     next(err);
    // }
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Invalid listing data");
    // }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    // Schema validation
    // if(!newListing.description){
    //     throw new ExpressError(400, "Description is missing");
    // }
    // if(!newListing.title){
    //     throw new ExpressError(400, "title is missing");
    // }
    // if(!newListing.location){
    //     throw new ExpressError(400, "location is missing");
    // }
    await newListing.save();
    req.flash("success", "Successfully created a new listing");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

// update route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    // res.redirect("/listings/" + id);  METHOD _1
    req.flash("success", "Successfully updated a listing");
    res.redirect(`/listings/${id}`); // METHOD _2
}));

// Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a listing");
    res.redirect("/listings");
}));

module.exports = router;