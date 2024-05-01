const User=require('../models/User');
const jwt=require('jsonwebtoken');

const auth=async (req,res,next)=>{
    
    try{

        const token=req.header("Authorization").replace("Bearer ","");

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            })
        }
 
        console.log("token:",token);

        jwt.verify(token,process.env.JWT_SECRET,(err, decoded)=>{
            if(err){ 
                return res.status(401).json({
                    success:false,
                    error:err.message,
                    message:"Verification failed"
                })
            }
            console.log("decoded output:",decoded);
            req.user=decoded;
        })
        next();
    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            error:err.message,
            message:"Internal Server Error"
        })
    }
}

const isStudent=async (req,res,next)=>{
    try{
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for students only"
            })
        }
        next();
    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            error:err.message,
            message:"Internal Server Error",
        })
    }
}

const isInstructor=async (req,res,next)=>{
    try{

        console.log("request user:",req.user)
 
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructors only"
            })
        }
        next();  
    }catch(err){
        console.log(err); 
        res.status(500).json({
            success:false,
            error:err.message, 
            message:"Internal Server Error",
        })
    }
}

const isAdmin=async (req,res,next)=>{
    try{
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admins only"
            })
        }
        next();
    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            error:err.message,
            message:"Internal Server Error",
        })
    }
}

module.exports={
    auth,
    isStudent,
    isInstructor,
    isAdmin,
}
