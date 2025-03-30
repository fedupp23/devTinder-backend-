const express=require("express");
const jwt=require("jsonwebtoken");
const{validateSignUpData}=require("../utils/validation");
const User=require("../models/user");
const bcrypt=require("bcrypt");
const authRouter=express.Router();
const validator=require("validator");

authRouter.post("/signup", async(req, res) => {
    try {
        // Debug log raw request
        console.log("Received signup request:", req.body);
        
        // Validation of data
        validateSignUpData(req);
        const {firstName, lastName, emailId, password} = req.body;
        
        // Check if user already exists with better error handling
        try {
            const existingUser = await User.findOne({ emailId });
            if (existingUser) {
                return res.status(400).json({ error: "User already exists with this email" });
            }
        } catch (dbError) {
            console.error("Database error:", dbError);
            return res.status(500).json({ error: "Database connection error" });
        }
        
        // Create user object
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword
        });

        // Save user with error handling
        try {
            await user.save();
            res.status(201).json({ 
                message: "User created successfully",
                userId: user._id 
            });
        } catch (saveError) {
            console.error("Save error:", saveError);
            res.status(500).json({ error: "Error saving user" });
        }
    } catch(err) {
        console.error("Signup error:", err.message);
        res.status(400).json({ error: err.message });
    }
});

authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        if(!validator.isEmail(emailId)){
            throw new Error("email is invalid");
        }
        const user=await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("user not found");
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            //creating a jwt token
            const token=await jwt.sign({_id:user._id},"devTinder@123");  
            console.log(token);
            res.cookie("token", token);
            return res.status(200).json({ message: "login successful" });
        }
        else{
            throw new Error("invalid credentials");
        }

    }
    catch(err){
        res.status(500).send(err.message);
    }

});
authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    });
    res.send("logout succesfull");
});
module.exports=authRouter;