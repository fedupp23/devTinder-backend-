const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User=require("./models/user");
const{validateSignUpData}=require("./utils/validation");
const bcrypt=require("bcrypt");
const validator=require("validator");
app.use(express.json()); //this actss as a middleware through which w can parse the json data coming from the post or any api methods
const cookieParser=require("cookie-parser");
app.use(cookieParser());
const jwt=require("jsonwebtoken");
const {userAuth}=require("./middlewares/auth");
app.post("/signup", async(req, res) => {
    try {
        // Debug log raw request
        console.log("Received signup request:", req.body);
        
        // Validation of data
        validateSignUpData(req);
        const {firstName, lastName, emailId, password} = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            throw new Error("User already exists with this email");
        }
        
        // Create user object
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: await bcrypt.hash(password, 10)
        });

        // Save user
        await user.save();
        
        res.status(201).json({ 
            message: "User created successfully",
            userId: user._id 
        });
    } catch(err) {
        console.error("Signup error:", err.message);
        res.status(400).json({ error: err.message });
    }
});

app.post("/login",async(req,res)=>{
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

app.get("/profile",userAuth,async(req,res)=>{
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

app.get("/user", async(req, res) => {
    const userEmail = req.body.emailId;
    try {
        // Fix: Change the query to use proper object syntax
        const user = await User.find({ emailId: userEmail });
        if (!user.length) {
            return res.status(404).send("No user found with this email");
        }
        res.send(user);
    } catch(err) {
        res.status(500).send(err.message);
    }
});
//feed api -GET /feed -get all the users form the database
app.get("/feed",async(req,res)=>{
    try{
        const users= await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(500).send(err.message);
    }

})
app.delete("/user",async(req,res)=>{
    const userId=req.body.userId;
    try{
        const user=await User.findByIdAndDelete(userId);
        res.send(user+`user deleted successfully`);
    }catch(err){
        res.status(400).send("something went wrong");
    }
})
app.patch("/user/:userId",async(req,res)=>{
    const userId=req.params?.userId; //params were used here because we added :/useId as a route in our patch api method
    const data=req.body;
    
    try{
        const allowedUpdates=["userId","photoUrl","about","gender","age","skills"];
        const isUpdatesAllowed=Object.keys(data).every((k)=>allowedUpdates.includes(k));
        if(!isUpdatesAllowed){
        throw new Error("invalid updates");
        };
        if(data?.skills,length>10)
        {
            throw new Error("skills cannot be more than 10");}
        const user=await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:"after",
            runValidators:true,
        });
        console/log(user);
        res.send("user updated successfully");
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
});

app.post("/sendConnectionRequest",userAuth,async(req,res)=>{ //just by using userauth we can confirm is the same user who is loggedin is sending the request or not
    const user=req.user;

    //sending a connection request
    console.log("sending  a connection request");
    res.send(user.firstName+"connection request sent!!");
});

// Connect to database
connectDB()
    .then(() => {
        console.log("database connection established");
    })
    .catch((err) => {  // Fixed syntax error: missing parentheses around 'err'
        console.error("database connection failed", err);
    });  // Fixed syntax error: removed extra parenthesis and added semicolon

app.listen(7778, () => {
    console.log('server is successfully running');
});