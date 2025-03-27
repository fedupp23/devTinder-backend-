const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User=require("./models/user");
app.use(express.json());
app.post("/signup",async(req,res)=>{
    console.log(req.body);
    const user =new User(req.body);
    try{
        await user.save();
        res.send("user created successfully");
    }catch(err){
        res.status(500).send(err.message);
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