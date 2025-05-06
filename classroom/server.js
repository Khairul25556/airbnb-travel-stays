const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionData = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionData));
app.use(flash());


app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.bookSuccess = req.flash("bookSuccess");
    res.locals.bookerr = req.flash("bookerr");
    next();
});

app.get("/book", (req, res) => {
    let {title="unknown"} = req.query;
    req.session.name = title;
    console.log(req.session.name);
    if(title === "unknown"){
        req.flash("bookerr", "Book name required");
        res.redirect("/bookshop");
    } else {
        req.flash("bookSuccess", "Book is found. Download and read it!");
        res.redirect("/bookshop");
    }
});

app.get("/bookshop", (req, res) => {
    res.render("book.ejs", {title: req.session.name});
})

app.get("/register", (req, res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(req.session.name === "anonymous"){
        req.flash("error", "Some Errors Occured");
    } else {
        req.flash("success", "Registration Successful");
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.render("page.ejs", {name: req.session.name});
});

// app.get("/reqcount", (req, res) => {
//     if(req.session.count){
//         req.session.count++;
//     } else{
//         req.session.count = 1;
//     }
//     res.send(`you sent request ${req.session.count} times`);
// });

app.listen(3000, () => {
    console.log("server is connected to the port");
});