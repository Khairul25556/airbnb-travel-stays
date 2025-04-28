const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv").config();

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

const port = 8080;
app.listen(port, () => {
    console.log(`Server is listening at: ${port}`);
});
