const express=require("express");
const requestRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
requestRouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{ //just by using userauth we can confirm is the same user who is loggedin is sending the request or not
    const user=req.user;

    //sending a connection request
    console.log("sending  a connection request");
    res.send(user.firstName+"connection request sent!!");
});
module.exports=requestRouter;