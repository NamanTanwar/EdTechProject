const User=require('../models/User');
const {mailSender}=require('../utils/mailSender');
const bcrypt=require('bcrypt');
const crypto=require('crypto');
const {passwordUpdated}=require('../mail/templates/passwordUpdate');

const resetPasswordToken=async (req,res)=>{

    try{
        //Fetchind email from request
        const {email}=req.body;
        
        //Verifying user in db
        const user=await User.findOne({email});
    
        //If user not found
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
    
        //generating a unique token for url
        const token=crypto.randomBytes(20).toString("hex");
        console.log("Reset password unique token:",token);
    
        //Saving token and resetPasswordExpires for user
        const updatedDetails=await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordExpires: Date.now()+3600000
            },
            {new:true}
        )

        //console.log("details:",updatedDetails);
    
        //Url with unique token
        const url=`http://localhost:3000/update-password/${token}`;
    
        //Sending email to user
        await mailSender(email,
            "Password Reset",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`);
        //Email sent successfully
        return res.status(200).json({
            success:true,
            message:"Email sent successfully.Kindly check email and change password"
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: true,
            error:err.message,
            message:"Internal Server Error"
        })
    }
}

const resetPassword=async (req,res)=>{
    try{

        //Fetching data from request
        const {password,confirmPassword,token}=req.body;
        
        //Validating data
        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching",
            })
        }
        
        //Finding user with token
        const userDetails=await User.findOne({token:token});
        
        //Checking if user exists
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"Token is invalid",
            })
        }
        
        //Checking for reset password expires
        if(userDetails.resetPasswordExpires<Date.now()){
            return res.status(400).json({
                success:false,
                message:"Token is expired, please regenerate your token",
            })
        }
        
        //Hashing password
        const hashedPassword=await bcrypt.hash(password,10);
        
        //Updating password
        const newUser=await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        )
        
        res.status(200).json({
            success:true,
            message:"Password reset successfully",
        })
        //Semding password reset success mail to user
        const email=newUser.email;
        const name=newUser.firstName;
        await mailSender(email,
            "Password Reset Successfull",
            passwordUpdated(email,name));

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            error:err.message,
            message:"Internal Server Error"
        })
    }
}

module.exports={
    resetPasswordToken,
    resetPassword,
}
