const jwt=require("jsonwebtoken");
const User=require("../models/user");
const userAuth=async(req,res,next)=>{
    try{
    const cookies=req.cookies;
    const {token}=cookies;
    const decodedObj=await jwt.verify(token,"devTinder@123");
    const {_id}=decodedObj;
    const user=await User.findById(_id);
    if(!user){
        throw new Error("user not found");
    }
    req.user=user;
    next();//if user is find the next function will be called}

}
catch(err){
    res.status(404).send(err.message);
}
};

module.exports={
    userAuth
}