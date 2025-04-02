const mongoose =require("mongoose");
const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["pending","accepted","rejected","ignore","interested"],
            message:`{VALUE} is not a valid status`,
        }

    }

},
{
    timestamps:true,
});

connectionRequestSchema.index({fromUserId:1,toUserId:1},{unique:true});

connectionRequestSchema.pre("save",function(){
    const connectionRequest=this;
    //check is fromuserid and touserid is same 
    if (connectionRequest.fromUserId===connectionRequest.toUserId){
        throw new Error("fromuserid and touserid cannot be same")
    }
    next(); 
})
const connectionRequestModel=new mongoose.model("connectionRequest",
    connectionRequestSchema
);
module.exports=connectionRequestModel;