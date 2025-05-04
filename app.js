const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv").config();
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

//Database conection
async function connection(){
    const name = process.env.DB_USER;
    const pass = process.env.DB_PASS;
    const encodedPass = encodeURIComponent(pass);
    await mongoose.connect(`mongodb://${name}:${encodedPass}@127.0.0.1:27017/wanderlust?authSource=admin`);
}

connection()
.then((res) => console.log("successfully connected MongoDB"))
.catch((err) => console.log(err));



app.get("/", (req, res) => {
    res.send("Server is working correctly");
});



//comming req from routes
app.use("/listings", listings);

//comming req from routes
app.use("/listings/:id/reviews", reviews);


app.use((req, res, next) => {
    next(new ExpressError (404, "Page Not Found"));
});

// Error Handling
app.use((err, req, res, next) => {
    let {statusCode=500, message="something went wrong"} = err;
    res.render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

//Port
const port = 8080;
app.listen(port, () => {
    console.log(`Server is listening at: ${port}`);
});
