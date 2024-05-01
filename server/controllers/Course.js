const Course=require('../models/Course');
const Tag=require('../models/Category');
const User=require('../models/User');
const Category=require('../models/Category');
const {uploadImageToCloudinary}=require('../utils/imageUploader');
require("dotenv").config();
const CourseProgress=require('../models/CourseProgress')
const { convertSecondsToDuration } = require("../utils/secToDuration");
const Section = require('../models/Section');
const SubSection=require("../models/SubSection");


 const createCourse=async (req,res)=>{

   try{ 

    //Fetching userID from request
    let userId=req.user.id;

    //Fetching course details from req
    let {
        courseName,
        courseDescription,
        whatWillYouLearn,
        price,
        tag,
        category,
        status,
        instructions
    }=req.body;

    //Fetching thumbnail from req
    //console.log("req.files",req.files);
    const thumbnail=req.files.thumbnailImage;
    console.log("courseName :",courseName);
    console.log("courseDescription :",courseDescription);
    console.log("whatWillYouLearn :",whatWillYouLearn);
    console.log("price :",price);
    console.log("tag :",tag);
    console.log("thumbnail :",thumbnail);
    console.log("category :",category);

    //Validating data
    if(
        !courseName || 
        !courseDescription ||
        !whatWillYouLearn || 
        !price ||
        !tag ||
        !thumbnail ||
        !category 
    ){
        return res.status(400).json({
            success:false,
            message:"Reqired fields missing"
        })
    }

    //Checking if user is authorized 
    if(!status || status===undefined){
        status="Draft";
    }

    //Fetching instructor details
    const instructorDetails=await User.findById(userId,
        {
            accountType:'Instructor',
        })

    //Validating instructor
    if(!instructorDetails){
        return res.status(400).json({
            success:false,
            message:"Instructor details not found"
        })
    }
    
    //Fetching category details
    const categoryDetails=await Category.findById(category);
    
    //if given category does not exist
    if(!categoryDetails){
        return res.status().json({
            success: false,
            message: "Category does not exist."
        })
    }

    //Uploading thumbnail to cloudinary
    const thumbNail=await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
    )

    console.log("thumbnail image:",thumbNail)

    //Creating new course in db
    const newCourse=await Course.create({
        courseName,
        courseDescription,
        instructor: instructorDetails.id,
        whatYouWillLearn: whatWillYouLearn,
        price,
        tag: tag,
        category: categoryDetails._id,
        thumbnail: thumbNail.secure_url,
        status: status,
        instructions: instructions,
    })
   

    console.log("userId===instructorId:",userId===instructorDetails._id);

    //Updating User
    await User.findByIdAndUpdate(
        {
            _id: instructorDetails._id,
        },
        {
            $push: {
                courses: newCourse._id,
            }
        },
        {new: true}
    )

    //Updating Category
    await Category.findByIdAndUpdate(
        {  _id:category  },
        {
            $push: {
                courses: newCourse._id,
            }
        },
        {new: true}
        )

    res.status(200).json({
        success:true,
        data: newCourse,
        message: "Course Created Successfully"
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

 const getAllCourses=async (req,res)=>{
    try{

        const allCourses=await Course.find({},{
            courseName:true,
            price:true,
            thumbail:true,
            instructor:true,
            ratingAndReviews:true,
            studentsEnrolled:true,
        }).populate("instructor") 
          .exec();

        return res.status(200).json({
            success:true,
            data: allCourses,
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

 

 const editCourse=async (req,res)=>{
    const {courseId,status}=req.body;
    try{
        const updatedCourse=await Course.findByIdAndUpdate(
            {_id:courseId},
            {
                status:status
            },
            {
                new:true,
            }
        )

        if(!updatedCourse){
            return res.status(404).json({
                success:false,
                message:"Course Edit failed"
            })
        }

        res.status(200).json({
            success:true,
            message:"Course has been edited successfully",
            data:updatedCourse,
        })

    }catch(err){
        console.log("Edit Course Error:",err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:err.message,
        })
    }
 }

 const getInstructorCourses=async (req,res)=>{
    try {
        // Get the instructor ID from the authenticated user or request body
        const instructorId = req.user.id
    
        // Find all courses belonging to the instructor
        const instructorCourses = await Course.find({
          instructor: instructorId,
        }).sort({ studentsEnrolled: -1 })
    
        // Return the instructor's courses
        res.status(200).json({
          success: true,
          data: instructorCourses,
        })
      } catch (error) {
        console.error(error)
        res.status(500).json({
          success: false,
          message: "Failed to retrieve instructor courses",
          error: error.message,
        })
      }
 }

 const getCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
            select: "-videoUrl",
          },
        })
        .exec()
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  const getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      let courseProgressCount = await CourseProgress.findOne({
        courseId: courseId,
        userId: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }

      console.log("Course Details:",courseDetails);
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

      console.log("totalDuration:",totalDuration);
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

const categoryPageDeatils=async (req,res)=>{
    try{
        const {categoryId}=req.body;
        console.log("PRINTING CATEGORY ID: ",categoryId);

        //Get courses for the specified category
        const selectedCategory=await Category.findById(categoryId)
        .populate({
            path: "courses",
            match: {status: "Published"},
            populate: "ratingAndReviews",
        })
        .exec();

        if(!selectedCategory){
            console.log("Category not found");
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        if(selectedCategory.courses.length===0){
            console.log("No courses found in this category");
            return res.status(404).json({
                success: false,
                message: "No such courses for the selected category",
            })
        }

        //Get courses for a random different category
        const categoriesExceptSelected=await Category.find({
            _id: {$ne: categoryId},
        })
        let differentCategory=await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
        ).populate({
            path: "courses",
            match: {status: "Published"}
        })
        .exec();


        //Get top selling courses from all categories
        const allCategories=await Category.find()
        .populate({
            path: "courses",
            match: {status: "Published"},
            populate: {
                path: "Instructor",
            }
        })
        .exec();
       
        const allCourses=allCategories.flatMap((category)=>category.courses)
       //Top 10 most selling courses
        const mostSellingCourses=allCourses
        .sort((a,b)=>b.sold-a.sold)
        .slice(0,10)

        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            }
        })
    }catch(err){
        console.log("Category page details error:",err);
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:err.message,
        })
    }
}

const deleteCourse=async (req,res)=>{
  try{
    const {courseId}=req.body;
    const course=await Course.findById(courseId);
    if(!course){
      return res.status(404).json({
        success:false,
        message:"Course not found"
      })
    }

    //Unenrolling students from the course
    const studentsEnrolled=course.studentsEnrolled;
    for(const studentId of studentsEnrolled){
      await User.findById(studentId,{
        $pull : {
          courses: courseId
        }
      })
    }

    //Deleting sections and subSections
    const courseSections=course.courseContent;
    for(const sectionId of courseSections){
       const section=await Section.findById(sectionId);
       if(section){
        const subSections=section.subSection
        for(const subSectionId of subSections){
          await SubSection.findByIdAndDelete(subSectionId);
        }
       }
       await Section.findByIdAndDelete(sectionId);
    }

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success:true,
      message:"Course deleted Successfully",
    })

  }catch(err){
    console.log(err);
    res.status(500).json({
      success:false,
      message:"Internal Server Error",
      error:err.message
    })
  }
}
 

 module.exports={
    createCourse,
    getAllCourses,
    getCourseDetails,
    editCourse,
    getInstructorCourses,
    categoryPageDeatils,
    getFullCourseDetails,
    deleteCourse,
};