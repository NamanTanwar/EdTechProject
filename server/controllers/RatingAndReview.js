const RatingAndReview=require('../models/RatingAndReview');
const Course=require('../models/Course');

const createRating=async (req,res)=>{
    try{

        //Fetching user Id
        const userId=req.user.id;
        
        //Fetching data from req body
        const {rating,review,courseId}=req.body;

        //Checking if the user is enrolled in the course or not
        const courseDetails=await Course.findOne({_id:courseId,
                                                  studentsEnrolled:{$elemMatch:{$eq:userId}}
                                                });
        
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Student not enrolled in course"
            })
        }

        //Checking if user already reviewed course or not
        const alreadyReviewed=await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        })

        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"Student already reviewed the course",
            })
        }

        //Creating a new instance of rating and review model
        const newRatingAndReview=await RatingAndReview.create({
            rating,
            review,
            course:courseId,
            user:userId,
        })
        
        //Updating course with rating/review
        const updatedCourse=await Course.findByIdAndUpdate({_id:courseId},{
            $push:{
                ratingAndReviews: newRatingAndReview._id,
            }
        },
        {new:true})

        await courseDetails.save();

        console.log("updatedCourse:",updatedCourse);
        
        res.status(200).json({
            success:true,
            message:"Rating and review created successfully",
            newRatingAndReview,
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

const getAverageRating=async (req,res)=>{
    try{

       const courseId=req.body.courseId;
       
       const result=await RatingAndReview.aggregate([
       
        {
            $match: {
                course: new mongoose.Types.ObjectId(courseId),
            }
        },
        {
            $group: {
                _id:null,
                averageRating: {$avg: "$rating"},
            }
        }
       ])

       if(result.length>0){
        return res.status(200).json({
            success:true,
            message:"Average rating fetched successfully",
            averageRating:result[0].averageRating,
        })
       }

       res.status(200).json({
        success:true,
        message:"No rating given till now",
        averageRating:0,
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

const getAllRatings=async (req,res)=>{
    try{
        const allReviews=await RatingAndReview.find({}).sort({rating:"desc"}).populate({
            path:"user",
            select:"firstName lastName email image",
        }).populate({
            path:"course",
            select:"courseName",
        })
        
        res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            allReviews,
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
    createRating,
    getAverageRating,
    getAllRatings,
}