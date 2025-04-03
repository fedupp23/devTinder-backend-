const express =require('express');
const userRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionRequest");
//get all the pending connection requests for the loggedinUser
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;

        const connectionRequest=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate(["fromUserId","firstName","lastName","photoUrl","age","gender","about","skills"]) ;
        // populate("fromUserId","firstName lastName") //we cna also use strings we just have to make sure there is space bwtween the first and second criteria;
        res.json({message:"data fetched",
            data:connectionRequest,

        })
    }
    catch(err){
        console.error("Error fetching requests:", err);
        res.status(500).json({ error: err.message });
    }
});

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate({
            path: 'fromUserId',
            select: 'firstName lastName photoUrl age gender about skills'
        })
        .populate({
            path: 'toUserId',
            select:'firstName lastName photoUrl age gender about skills'
        })
        ;
        
        const data=connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.json({ data });
    } catch(err) {
        console.error("Error fetching connections:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports=userRouter;