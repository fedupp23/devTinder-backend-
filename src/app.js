const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User=require("./models/user");
const validator=require("validator");
app.use(express.json()); //this actss as a middleware through which w can parse the json data coming from the post or any api methods
const cookieParser=require("cookie-parser");
app.use(cookieParser());
// const jwt=require("jsonwebtoken");
// const authRouter=require("./routes/auth");
// const profileRouter=require("./routes/profile");
// const requestRouter=require("./routes/requests");
const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
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


// Connect to MongoDB
connectDB().then(() => {
    console.log("Database connected successfully");
}).catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
});

app.listen(7778, () => {
    console.log('server is successfully running');
});