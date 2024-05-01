const User=require('../models/User');
const Otp=require('../models/Otp');
const otpGenerator = require('otp-generator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const Profile=require('../models/Profile');
const {passwordUpdated}=require('../mail/templates/passwordUpdate');
const {otpTemplate}=require('../mail/templates/emailVerificationTemplate');
const {mailSender}=require('../utils/mailSender');

const sendOtp=async (req,res)=>{
   
    try{
        //Fetching email from request body
        const {email}=req.body;
        console.log("email:",email);

        //Checking if user already registered
        const checkUserPresent=await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User is already registered"
            })
        }
        
        //Generating 6 digit Unique otp
        let otp=otpGenerator.generate(6,{
            upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
        })
        const result=await Otp.findOne({otp:otp});
        while(result){
            otp=otpGenerator.generate(6,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            })
        }

        //Saving otp document to database
        const otpPayload={email,otp};
        const otpBody=await Otp.create(otpPayload);

        if(!otpBody){
            throw new Error("Could not create OTP")
        }
        
        console.log("otp body:",otpBody);

        //Sending email to user
        const emailResponse = await mailSender(
            email,"Signup",otpTemplate(otp)
        );

        if(emailResponse){
            console.log("email sent!");
        }

        console.log("OTP body:",otpBody);
        res.status(200).json({
            success:true,
            message:"Otp sent successfully",
            otp,
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            error:err.message,
            message:"Internal Server Error"
        })
    }
}

const signup=async (req,res)=>{
    
    try{
        //Fetching data from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        }=req.body;
        
        //Checking if any field is empty
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: "Required fields missing"
            })
        }

        console.log("otp received in signup:",otp);

        //Validation password and confirm password fields
        if(password!==confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match"
            })
        }

        //Checking if user already exists
        const existingUser=await User.findOne({email});
        if(existingUser){
            res.status(409).json({
                success: false,
                message: "User already exists.Kindly log in."
            })
        }
        
        //Looking for most recent otp
        const recentOtp=await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log("Recent otp:",recentOtp);

        if(recentOtp.length===0){
            //OTP not found
            return res.status(400).json({
                success:false,
                message:"OTP Not Found",
            })
        }else if(otp!==recentOtp[0].otp){
            //Invalid OTP
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            })
        }

        //Hashing password
        const hashedPassword=await bcrypt.hash(password,10);
        
        //Create the user
        let approved="";
        approved === "Instructor" ? (approved=false) : (approved=true); 

        //Creating new profile
        const profileDetails=await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        })
         
        //Creating new user
        const newUser=await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })
        
        res.status(200).json({
            success:true,
            message:"User is registered successfully",
            newUser:{
                firstName:newUser.firstName,
                lastName:newUser.lastName,
                email:newUser.email,
                contactNumber:newUser.contactNumber,
                accountType:newUser.accountType,
                additionalDetails:newUser.additionalDetails,
                image:newUser.image,
            },
        })
    }catch(err){
          console.log(err);
          res.status(500).json({
            success:false,
            error:err.message,
            message:"Internal Server Error",
          })
    }
}

const login=async (req,res)=>{
    try{
        
        //Fetching data from request body
        const {email,password}=req.body;
        
        //Validating required fields
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message: "All fields are required,please try again",
            })
        }
        
        //Checking if user exists
        const user=await User.findOne({email}).populate("additionalDetails");

        //Handling case when user trying to log in without signing in first
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User does not exist.Kindly sign up",
            })
        }
 
        //Checking if password is correct
        const isPasswordCorrect=await bcrypt.compare(password,user.password);

        //Handling case when password is incorrect
        if(!isPasswordCorrect){
            return res.status(400).json({
                success:false,
                message:"Invalid Password.Please try again"
            })
        }

        //Payload for token
        const payload={
            email:user.email,
            id:user._id,
            accountType:user.accountType,
        }


        //Generating token
        const token=jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRE,
        });

        //Attaching token to user object
        user.token=token;
        
        await user.save();


        const options={
            expires: new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
        }

        //Sending token to client

        console.log("generated token while logging in:",token);

        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user:{ 
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email,
                accountType:user.accountType,
                active: user.active,
                approved: user.approved,
                additionalDetails: user.additionalDetails,
                courses: user.courses,
                token: user.token,
                image: user.image,
                courseProgress: user.courseProgress,
            },
            message:"User Login success"
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            error:err.message,
            message:"Internal Server Error",
        })
    }
}

const changePassword=async (req,res)=>{
 
      try{

        //Get user Details from req.user
        const userDetails=await User.findById(req.user.id);
        
        //Get old password, new password, and confirm new password from req.body
        const {oldPassword,newPassword,confirmNewPassword}=req.body;
        
        //Validate old password
        const isPasswordMatch=await bcrypt.compare(
            oldPassword,
            userDetails.password
        );

        if(!isPasswordMatch){
           return res.status(401).json({
            success: false,
            message: "The password is incorrect"
           })
        }

        //Match new password and confirm new password
        if(newPassword!==confirmNewPassword){
            return res.status(400).json({
                success:false,
                message:"The password and confirm password does not match"
            })
        }

        //Update password
        const encryptedPassword=await bcrypt.hash(newPassword,10);
        const updatedUserDetails=await User.findByIdAndUpdate(
            req.user.id,
            {password: encryptedPassword},
            {new: true}
        )

        //Send notification email
        const emailResponse=await mailSender(
            updatedUserDetails.email,
            passwordUpdated(
                updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
            )
        )

        console.log("Email sent successfully:",emailResponse.response);
        
        //Returning successfull response
        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
          
      }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Error occured while updating password",
            error: error.message,
        })
      }

}


module.exports={
    sendOtp,
    signup,
    login,
    changePassword,
}




