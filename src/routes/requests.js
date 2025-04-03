const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const mongoose = require("mongoose");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["ignored", "interested"];
        
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ error: "Status not allowed" });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnectionRequest) {
            return res.status(400).json({ error: "Connection request already sent" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.status(201).json({
            message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
            data
        });
    } catch (err) {
        console.error("Send Request Error:", err);
        res.status(500).json({ error: err.message });
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        
        // First validate the requestId format
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ 
                error: "Invalid request ID format",
                providedId: requestId
            });
        }

        // Debug logs
        console.log("Review attempt:", {
            requestId,
            loggedInUserId: loggedInUser._id.toString(),
            status,
            userEmail: loggedInUser.email
        });

        // Then find the request
        const anyRequest = await ConnectionRequest.findById(requestId);
        console.log("Found request:", JSON.stringify(anyRequest, null, 2));

        if (!anyRequest) {
            return res.status(404).json({
                error: "No connection request found",
                requestId,
                tip: "Make sure you're using the connection request ID, not the user ID"
            });
        }

        // Validate user permissions
        if (anyRequest.toUserId.toString() !== loggedInUser._id.toString()) {
            return res.status(403).json({
                error: "This request was not sent to you",
                requestTo: anyRequest.toUserId.toString(),
                yourId: loggedInUser._id.toString()
            });
        }

        // Validate request status
        if (anyRequest.status !== "interested") {
            return res.status(400).json({
                error: `Request cannot be reviewed - current status: ${anyRequest.status}`,
                allowedStatus: "interested"
            });
        }

        // Update the request
        anyRequest.status = status;
        const data = await anyRequest.save();
        
        res.json({
            message: `${loggedInUser.firstName} has ${status} the request`,
            data
        });
    } catch (err) {
        console.error("Review Request Error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = requestRouter;