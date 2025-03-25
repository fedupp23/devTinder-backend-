const express =require("express");

const app = express();


//response handler for home
app.use("/home",(req,res)=>{ //we have only provided the port /test so now it can only access the port test and any other port will not be accessible or can't use the GET method
    res.send("hello from server")
});
app.listen(7777,()=>{
    console.log('server is successfully running');
});