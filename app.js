const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");

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

const validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next()
    }
};

app.use("/listings", listings);

// review Post route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res) =>{
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
   listing.reviews.push(newReview);
   await newReview.save()
   await listing.save();
   console.log("new Review Saved")
   res.redirect(`/listings/${listing._id}`);
}));

// Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res) =>{
    let{id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
}));

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