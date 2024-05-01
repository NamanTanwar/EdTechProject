const cloudinary=require("cloudinary").v2;
require("dotenv").config();

const cloudinaryConnect=()=>{
    try{
        //Configuring Cloudinary to upload media
        cloudinary.config({
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.API_KEY,
            api_secret:process.env.API_SECRET,
        })
        console.log("Cloudinary Configured");
    }catch(err){
        console.log("Cloudinary connect failed",err);
    }
}

module.exports={cloudinaryConnect};