const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const path = require("path");

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

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

//Index Route
app.get("/listings", async (req, res) =>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", {allListings});
})

// show Route
app.get("/listings/:id", async(req, res) =>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
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