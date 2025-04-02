const express=require("express");
const requestRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const User=require("../models/user"); //importing the user model to check if the user exists or not
const ConnectionRequest = require("../models/connectionRequest");
requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{ //just by using userauth we can confirm is the same user who is loggedin is sending the request or not
    try{
        const fromUserId=req.user._id; //getting the loggedin user id
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        const allowedStatus=["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).send("status not allowed");
        }
        //check done to see if the to user id exist in the table or not
        const toUser=await User.findById(toUserId);
        if(!toUser){
            return res.status(404).send("user not found");
        }
        //if there is an existign connectionrequest

        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}

            ]
        });
        if(existingConnectionRequest){
            return res.status(400)
            .send({message:"connection request already sent"});
        }
        const connectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data=await connectionRequest.save();
        if(!data){
            throw new Error("connection request not sent");
        }
        res.json({
            message:req.user.firstName+"is"+status+"in"+ toUser.firstName,
            data,
        })
    }
    catch(err){
        res.status(500).send(err.message);
    }   
    
});
module.exports=requestRouter;