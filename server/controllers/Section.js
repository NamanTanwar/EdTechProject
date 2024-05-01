const Section=require('../models/Section');
const SubSection=require('../models/SubSection');
const Course=require('../models/Course');

const createSection=async (req,res)=>{
    try{
        
        //Fetching sectionName and courseId from req
        const {sectionName,courseId}=req.body;
        
        //Validating data
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Required Fields missing"
            })
        }
        //Creating new section in db
        const newSection=await Section.create({sectionName});

        //Updating course with new section
        const updatedCourseDetails=await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{courseContent:newSection._id,}
            },
            {new:true},
        ).populate({
            path: 'courseContent',
            populate: {
                path: "subSection",
            }
        }).exec();

       //Return the upadated course object in the response
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourseDetails,
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


const updateSection=async (req,res)=>{
    
    try{
        const {sectionName,sectionId,courseId}=req.body;
        const section=await Section.findByIdAndUpdate(
            sectionId,
            {sectionName},
            {new:true}
        )

        const course=await Course.findById(courseId)
        .populate({
            path:"courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec()

        res.status(200).json({
            success:true,
            message:"Section Updated Successfully",
            data:course
        })



    }catch(err){
         console.log("Error updating section:",err);
         res.status(500).json({
            success:false,
            message:"Internal Server Error"
         })
    }
}

const deleteSection=async (req,res)=>{
    
    try{
        const {sectionId,courseId}=req.body;
        await Course.findByIdAndUpdate(courseId,{
            $pull:{
                courseContent:sectionId,
            }
        })
        const section=await Section.findById(sectionId);
        
        if(!section){
            return res.status(404).json({
                success:false,
                message:"Section not found"
            })
        }

        await Section.findOneAndDelete(sectionId);

        const course=await Course.findById(courseId).populate({
            path:"courseContent",
            populate: {
                path: "subSection"
            }
        }).exec()

        res.status(200).json({
            success:true,
            message:"Section Deleted",
            data:course
        })

    }catch(err){
        console.log("DELETE SECTION CONTROLLER ERROR:",err);
        res.status(500).json({
             success:false,
             message:"Internal Server Error",
             error:err.message,
        })
    }
}

module.exports={
    createSection,
    updateSection,
    deleteSection,
}