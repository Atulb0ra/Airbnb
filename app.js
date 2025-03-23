const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

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

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

app.get("/testListing", async (req,res) => {
    let sampleListing = new Listing({
        title: "My new Villa",
        description: "This is a sample listing",
        price: 10000,
        location: "Calangute, Goa",
        country: "India"
    })
    await sampleListing.save()
    console.log("Sample was saved")
    res.send("Sample listing saved");
});

app.listen(8080, () => {
    console.log("Server is listening to port 8080")
})