const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");


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
router.get("/new", (req,res) =>{
    res.render("listings/new.ejs");
});

// show Route
router.get("/:id", wrapAsync(async(req, res) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));


// create Route
router.post("/",validateListing, wrapAsync(async (req, res, next) => {
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
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// update route
router.put("/:id",validateListing, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    // res.redirect("/listings/" + id);  METHOD _1
    res.redirect(`/listings/${id}`); // METHOD _2
}));

// Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;