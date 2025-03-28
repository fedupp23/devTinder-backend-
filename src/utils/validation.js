//all the validation will be created in t his file
//season 2 episode 9
const validator=require("validator");
const validateSignUpData=(req)=>{
    //extraction
    const{firstName,lastName,emailId,password}=req.body;
    if(!firstName|| lastName){
        throw new Error("first name and last name are required");
    }
    else if(firstName.length<4||firstName.length>40){
        throw new Error("first name should be between 4 to 40 characters");
    }
    else if(lastName.length<4||lastName.length>40){
        throw new Error("last name should be between 4 to 40 characters");
    }
    else if(validator.isEmail(emailId)){
        throw new Error("email is invalid");
    }
    else if(validator.isStrongPassword(password)){
        throw new Error("password is not strong");
    }
}
module.exports={
    validateSignUpData,
}