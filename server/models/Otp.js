const mongoose=require('mongoose');
const mailSender=require('../utils/mailSender');
const emailTemplate=require('../mail/templates/emailVerificationTemplate');
const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:60*5,
    }//This document will be automatically deleted after 5 minutes of its creation time
})


const sendVerificationEmail=async (email,otp)=>{
    try{

        const mailResponse=await mailSender(email,"Verification Email from studyNotion",emailTemplate(otp));
        console.log("Email Sent Successfully",mailResponse);
    }catch(err){
          console.log("Error occured while sending email",err);
          throw err;
    }
}

otpSchema.pre("save",async (next)=>{
    console.log('New document saved to database')
    if(this.isNew){
    await sendVerificationEmail(this.email,this.otp);
    }
    next();
})

module.exports=mongoose.model("Otp",otpSchema)