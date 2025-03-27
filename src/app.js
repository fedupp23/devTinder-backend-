const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User=require("./models/user");
app.use(express.json()); //this actss as a middleware through which w can parse the json data coming from the post or any api methods
app.post("/signup",async(req,res)=>{
    console.log(req.body);
    const user =new User(req.body);
    try{
        await user.save();
        res.send("user created successfully");
    }catch(err){
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
        res.send("user deleted successfully");
    }catch(err){
        res.status(400).send("something went wrong");
    }
})
// Connect to database
connectDB()
    .then(() => {
        console.log("database connection established");
    })
    .catch((err) => {  // Fixed syntax error: missing parentheses around 'err'
        console.error("database connection failed", err);
    });  // Fixed syntax error: removed extra parenthesis and added semicolon

app.listen(3333, () => {
    console.log('server is successfully running');
});