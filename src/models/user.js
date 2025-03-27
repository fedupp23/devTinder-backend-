const mongoose = require("mongoose");
// Create a separate file for the user model
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },
    photoUrl:{
        type:String,
        default:"https://geographyandyou.com/images/user-profile.png"
    },
    about:{
        type:String,
        about:"this is deafault about of user",
    },
    skills:{
        type:[String],
    }
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;