const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Airbnb');
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

//Index Route
app.get("/listings", async (req, res) =>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", {allListings});
})

//New Route
app.get("/listings/new", (req,res) =>{
    res.render("listings/new.ejs");
})

// show Route
app.get("/listings/:id", async(req, res) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
})

// create Route
app.post("/listings", async (req, res) => {
    // let {title, description, image, price, location, country} = req.body  
    // METHOD -1 when name is these field

    // Method -2 when we pass object of fields
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})

// update route
app.put("/listings/:id", async (req, res) => {
    const {id} = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    // res.redirect("/listings/" + id);  METHOD _1
    res.redirect(`/listings/${id}`); // METHOD _2
})

// Delete Route
app.delete("/listings/:id", async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "This is a sample listing",
//         price: 10000,
//         location: "Calangute, Goa",
//         country: "India"
//     })
//     await sampleListing.save()
//     console.log("Sample was saved")
//     res.send("Sample listing saved");
// });

app.listen(8080, () => {
    console.log("Server is listening to port 8080")
})