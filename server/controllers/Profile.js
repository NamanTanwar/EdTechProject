const Profile=require('../models/Profile');
const User=require('../models/User');
const Course=require("../models/Course");
require("dotenv").config();
const {uploadImageToCloudinary}=require('../utils/imageUploader');
const { convertSecondsToDuration } = require("../utils/secToDuration")
const mongoose=require("mongoose");
const CourseProgress=require("../models/CourseProgress");

const updateProfile=async (req,res)=>{
    try{
        
        //Fetching data from req
        const {firstName,lastName,dateOfBirth="",about="",contactNumber,gender=""}=req.body;
        const id=req.user.id;
        //console.log("id is:",id);

        //Validating required fields
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:"Required Fields missing",
            })
        }
        
        //Fetching user from db by id
        const userDetails=await User.findByIdAndUpdate(
            id,
            {
                firstName:firstName,
                lastName:lastName,
            },
            {new:true, runValidators: true}
        );
        
        //Fetching profile details 
        const profileId=userDetails.additionalDetails;
        const profileDetails=await Profile.findById(profileId);
 
        //Updating profileDetails
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;

        //Saving new changes
        await profileDetails.save();

            return res.status(200).json({
                success:true,
                message:"Profile Updated Successfully",
                profileDetails,
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

const deleteProfileAndAccount=async (req,res)=>{
    
    try{
        //Fetching user id from req
        const id=req.user.id;
        
        //Finding user with fetched id
        const user=await User.findById({_id:id});
        
        //Validating if user exists
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User does not exist",
            })
        }
        
        //Deleting profile associated with user
        await Profile.findByIdAndDelete({
            _id:new mongoose.Types.ObjectId(user.additionalDetails)
        });
        
        for(const courseId of user.courses){
            await Course.findByIdAndUpdate(
                courseId,
                {$pull: {studentsEnrolled: id}},
                {new: true}
            )
        }

        //Deleting user itself 
        //NOTE:PRE FUNCTION ATTACHED WITH THIS USER METHOD
        await User.findByIdAndDelete({_id:id});
        res.status(200).json({
            success:true,
            message:"User deleted successfully",
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

const getAllUserDetails=async (req,res)=>{
    
    try{
        //Fetching id from req
        const id=req.user.id;
        //Fetching userDetails along with profile details from db
        const userDetails=await User.findById(id).
        populate("additionalDetails").
        exec();
        console.log(userDetails);
        res.status(200).json({
            success:true,
            message:"User Data fetched successfully",
            data: userDetails,
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

const getEnrolledCourses=async (req,res)=>{
    try{

        //Fetching user id from request
        const userId=req.user.id;
        //Getting user courses details by id
        let userDetails=await User.findById(userId)
        .populate({
            path: "courses",
            populate: {
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            },
        })
        .exec();

        userDetails=userDetails.toObject();
       // console.log("userDetails.toObject():",userDetails);
        //console.log("userDetails.courseContent:",userDetails.courses[0].courseContent[0].subSection);
        let subSectionLength=0;
        for(let i=0;i<userDetails.courses.length;i++){
            let totalDurationInSeconds=0;
            subSectionLength=0;
            for(let j=0;j<userDetails.courses[i].courseContent.length;j++){
                totalDurationInSeconds+=userDetails.courses[i].courseContent[
                    j
                ].subSection.reduce((acc,curr)=>acc+parseInt(curr.timeDuration),0)
                userDetails.courses[i].totalDuration=convertSecondsToDuration(
                    totalDurationInSeconds
                )
                subSectionLength+=userDetails.courses[i].courseContent[j].subSection.length
            }

            let courseProgressCount=await CourseProgress.findOne({
                courseId: userDetails.courses[i]._id,
                userId: userId,
            })
            courseProgressCount=courseProgressCount?.completedVideos.length;
            if(subSectionLength===0){
                userDetails.courses[i].progressPercentage=100;
            }else{
                const multiplier=Math.pow(10,2);
                userDetails.courses[i].progressPercentage=Math.round(
                    (courseProgressCount/subSectionLength)*100*multiplier
                )/multiplier
            }
        }

        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find user with id: ${userDetails}`
            })
        }

        return res.status(200).json({
            success: true,
            data: userDetails.courses,
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


const updateDisplayPicture=async (req,res)=>{
    try{

        const displayPicture=req.files.displayPicture;
        const userId=req.user.id;
        const image=await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )

        console.log(image);

        const updatedUser=await User.findByIdAndUpdate(
            {_id:userId},
            {image:image.secure_url},
            {new:true}
        )

        res.status(200).json({
            success:true,
            message:"Image uploaded successfully",
            data: updatedUser,
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            error:err.message,
            message:"Internal Server error",
        })
    }
}

const instructorDashboard=async (req,res)=>{
    try{
        const courseDetails=await Course.find({instructor: req.user.id});

        const courseData=courseDetails.map((course)=>{
            const totalStudentsEnrolled=course.studentsEnrolled.length;
            const totalAmountGenerated=totalStudentsEnrolled*course.price

            const courseDataWithStats={
                _id:course._id,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
            }
            return courseDataWithStats;
        })

        console.log("Printing courseDetails:",courseData);

        res.status(200).json({
            success:true,
            message:"Instructor dashboard data fetched successfully",
            courses: courseData,
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

module.exports={
    updateProfile,
    deleteProfileAndAccount,
    getAllUserDetails,
    getEnrolledCourses,
    updateDisplayPicture,
    instructorDashboard,
}

