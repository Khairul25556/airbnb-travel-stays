const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

//username, pass, hashing, salting will automatically create by passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

//model
const User = mongoose.model("User", userSchema);

module.exports = User;