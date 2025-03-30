// creating a router for profiles
const express = require("express");
const { validateEditProfile } = require("../utils/validation");
const {userAuth}=require("../middlewares/auth");
const profileRouter=express.Router();
const jwt=require("jsonwebtoken");

profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
    const cookie=req.cookies;
    const {token}=cookie; //creating a new token
    if(!token){
        throw new Error("token not found");
    }
    //validatng the token
    const decodedMesaage=jwt.verify(token,"devTinder@123");
    console.log(decodedMesaage);
    const{_id}=decodedMesaage;
    // console.log("theloggedin user id is"+_id);
    // console.log(cookie);
    const user=req.user;
    if(!user){
        throw new Error("user not found");
    }
    res.send(user);
    res.send("reading");
    } 
    catch(err){
        res.status(500).send(err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try {
        if (!validateEditProfile(req)) {
            throw new Error("invalid data provided");
        }
        const loggedinUser = req.user;
   
        Object.keys(req.body).forEach((k) => {
            loggedinUser[k] = req.body[k];
        });
        
        // Fixed typo: consolel -> console
        console.log(loggedinUser);
        
        // // Save the updated user
        await loggedinUser.save();
        
        res.status(200).json({
            message: `${loggedinUser.firstName} your profile edit was successful`,
            user: loggedinUser
        });
    } catch(err) {
        console.error("Profile update error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports=profileRouter;