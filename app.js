require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

//Database conection
// async function connection(){
//     const name = process.env.DB_USER;
//     const pass = process.env.DB_PASS;
//     const encodedPass = encodeURIComponent(pass);
//     await mongoose.connect(`mongodb://${name}:${encodedPass}@127.0.0.1:27017/wanderlust?authSource=admin`);
// }

const dbUrl = process.env.ATLASDB_URL;

async function connection(){
    await mongoose.connect(dbUrl);
}

connection()
.then((res) => console.log("successfully connected MongoDB"))
.catch((err) => console.log(err));

//connect-mongo session
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SESSION_SECRET
    },
    touchAfter: 24 * 3600
});

store.on("error", () => {
    console.log("Error in MONGO SESSION STORE");
});

//Express-session 
const sessionData = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //ms
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

//root
// app.get("/", (req, res) => {
//     res.send("Server is working correctly");
// });


app.use(session(sessionData));
app.use(flash());

//This initializes Passport so that it can be used in Express app.
app.use(passport.initialize());
//It enables storing user info in the session across multiple HTTP requests
app.use(passport.session());
//use static authenticate method of model in LocalStrategy
//Tells Passport to use User.authenticate() for checking username and password.
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
//serializeUser = Tells Passport how to save the user info in the session (usually just the user ID).
passport.serializeUser(User.serializeUser());
//deserializeUser = Tells Passport how to get the full user info back from the session.
passport.deserializeUser(User.deserializeUser());


//middleware
app.use((req, res, next) => {
    //res.locals-A place to store variables to be used in views/templates.
    res.locals.successMsg = req.flash("success");
    res.locals.errMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "saul@gmail.com",
//         username: "Saul-Goodman"
//     });

//     let registeredUser = await User.register(fakeUser, "abc123");
//     res.send(registeredUser);
// });

//comming req from routes
app.use("/listings", listingRouter);

//comming req from routes
app.use("/listings/:id/reviews", reviewRouter);

//comming req from routes
app.use("/", userRouter);

//If page doesn't exists
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
