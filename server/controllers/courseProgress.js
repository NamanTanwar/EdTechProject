const SubSection=require("../models/SubSection");
const CourseProgress=require("../models/CourseProgress");

exports.updateCourseProgress=async (req,res)=>{
    
    //Fetch data from req body
    const {courseId,subSectionId}=req.body;
    const userId=req.user.id

   console.log("courseId:",courseId);
   console.log("userId:",userId);

    try{
        const subSectionFound=await SubSection.findById(subSectionId);


        console.log("subSection:",subSectionFound);

        if(!subSectionFound){
            return res.status(404).json({
                success:false,
                message:"Invalid subSection"
            })
        }

        let courseProgress=await CourseProgress.findOne({
            courseId: courseId,
            userId: userId,
        })

        if(!courseProgress){
            return res.status(404).json({
                success: false,
                message: "Course progress does not exist"
            })
        }
        else{
            if(courseProgress.completedVideos.includes(subSectionId)){
                return res.status(400).json({
                    success: false,
                    error: "SubSection alredy complete"
                })
            }
            courseProgress.completedVideos.push(subSectionId);
        }

        await courseProgress.save();

        return res.status(200).json({
            success:true,
            message: "Course Progress Updated"
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            error:err.message,
            message: "Internal Server error"
        })
    }
}