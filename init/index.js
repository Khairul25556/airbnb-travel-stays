const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");
require("dotenv").config();

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

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "6819eee26a40ce4a99a2a350"}));
    await Listing.insertMany(initData.data);
    console.log("Data is initialized");
}

initDB();