const {contactUsEmail}=require("../mail/templates/contactFormRes");
const {mailSender}=require("../utils/mailSender");
const Contact=require('../models/Contact');

exports.contactUsController=async (req,res)=>{
    try{
    const {email,firstName,lastName,message,phoneNo}=req.body;
    if(
        !email || 
        !firstName ||
        !lastName ||
        !message ||
        !phoneNo 
    )
        return res.status(400).json({
            success:false,
            message:"Missing data"
        })

        console.log("Printing incoming req body:",req.body)
    

        const user=await Contact.findOne({email:email});

        if(user){
            return res.status(400).json({
                success:false,
                message:"User already contacted"
            })
        }

        const newUser=await Contact.create({
            firstname: firstName,
            lastname : lastName,
            email: email,
            phoneNo: phoneNo,
            message: message,
        })

        if(newUser){

            const emailRes=await mailSender(
                email,
                "Thanks for contacting us!",
                contactUsEmail(email,firstName,lastName,message,phoneNo),
            )
            console.log("Email Res:",emailRes);

            res.status(200).json({
                success:true,
                message:"Contact Us saved successfully"
            })
        }

    }catch(err){
        console.log("contactUs controller error:",err);
        res.status(500).json({
            success:false,
            error:err.message,
            message:"Internal Server Error"
        })
    }   
}