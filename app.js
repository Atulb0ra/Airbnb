const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");

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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
})

app.use((err, req, res, next) =>{
    let {statusCode = 500, message ="Something Went Wrong"} = err;
    // res.send("Something went wrong");
    res.status(statusCode).render("listings/error.ejs", {err : err});
    // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("Server is listening to port 8080")
})