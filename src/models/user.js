const mongoose = require("mongoose");
const validator=require("validator");
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
        trim:true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("email is invalid"+value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validator(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("enter a strong passwrd"+value);
            }
        }
    },
    age: {
        type: Number,
        min:18,
    }, 
    gender: {
        type: String,
        validate(value){ //balidation is being done here
            if(!["male","female","others"].includes(value)){
                throw new Error("gender not valid");
            }
        }
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
},{
    timestamps:true
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;