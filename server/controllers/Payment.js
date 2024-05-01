const { instance } = require("../config/razorpay")
const Course = require("../models/Course")
const crypto = require("crypto")
const User = require("../models/User")
const {mailSender} = require("../utils/mailSender")
const mongoose = require("mongoose")
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress")


const getAverageRating=(ratingList)=>{
    
    if(ratingList.length===0){
        return 0;
    }

    const sum=ratingList.reduce((acc,curr)=>acc+curr.rating,0);
    const average=sum/ratingList.length;

    return average.toFixed(1);

}


exports.capturePayment=async (req,res)=>{

    const {courses}=req.body;
    const userId=req.user.id;

    //Validation courses
    if(courses.length===0){
        return res.status(422).json({
            success:false,
            message:"Kindly select at least one course"
        })
    }

    //Calculating total Amount
    let totalAmount=0;
    for(const course_id of courses){
        let course;
        try{
            course=await Course.findById(course_id);
            
            if(!course){
                return res.status(404).json({
                    success:false,
                    message:"Could not find the course"
                })
            }

            const uid=new mongoose.Types.ObjectId(userId);

            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).json({
                    success:false,
                    message:"Student is already enrolled"
                })
            }
             
            totalAmount+=course.price;
        }catch(err){
            console.log("Capture Payment error:",err);
            return res.status(500).json({
                success:false,
                error:err.message,
                message:"Internal Server Error",
            })
        }
    }

    //Defining options for order creation
    const currency="INR";
    const options={
        amount:totalAmount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
    }

    try{
        //creating order
        const paymentResponse=await instance.orders.create(options);
        res.json({
            success:true,
            message:paymentResponse,
        })

        console.log("payment Response :",paymentResponse);

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Could not initiate the order"
        })
    }
}

exports.sendPaymentSuccessEmail=async (req,res)=>{

    const {orderId,paymentId,amount}=req.body;
    const userId=req.user.id;

    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({
            success:false,
            message:"Required fields missing",
        })
    }

    try{
        const enrolledStudent=await findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(`${enrolledStudent.firstName} ${enrolledStudent.firstName}`,
            amount/100,orderId,paymentId)
        )
    }catch(err){
        console.log("error in sending mail",err);
        return res.status(500).json({
            success:false,
            message:"Could not send mail"
        })
    }
}

const enrollStudents=async (courses,userId,res)=>{

    if(!courses || !userId){
        return res.status(400).json({
            success:false,
            message:"Please Provide data for courses and userID",
        })
    }

    for(const courseId of courses){
        try{
            
            const enrolledCourse=await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{
                    studentsEnrolled:userId
                }},
                {new: true},
            )

            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found"
                })
            }

            const courseProgress = await CourseProgress.create({
                courseId: courseId,
                userId: userId,
                completedVideos: [],
                createdAt:Date.now(),
              })

              console.log("courseProgress Created:",courseProgress);

            const enrolledStudent=await User.findByIdAndUpdate(userId,
                
                {$push:{
                    courses: courseId,
                    courseProgress: courseProgress._id,
                }},
                {new:true}
                )

                const emailResponse=await mailSender(
                    enrolledStudent.email,
                    `Successfully Enrolled into ${enrolledCourse.courseName}`,
                    courseEnrollmentEmail(enrolledCourse.courseName,
                        `${enrolledStudent.firstName}`
                        )
                )

        }catch(err){

            console.log(err);
            res.status(500).json({
                success:false,
                message:err.message,
            })

        }
    }

}

exports.verifyPayment=async (req,res)=>{
 
    const razorpay_order_id=req.body?.razorpay_order_id;
    const razorpay_payment_id=req.body?.razorpay_payment_id;
    const razorpay_signature=req.body?.razorpay_signature;
    const courses=req.body?.courses;
    const userId=req.user.id;
    
    if(!razorpay_order_id || 
        
        !razorpay_payment_id ||

        !razorpay_signature ||

        !courses || 

        !userId

        ){
            return res.status(200).json({
                success:false,
                message:"Payment Failed"
            })
        }

        let body=razorpay_order_id+"|"+razorpay_payment_id;
        const expectedSignature=crypto
        .createHmac("sha256",process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex")

        if(expectedSignature===razorpay_signature){

            //enroll student
            await enrollStudents(courses,userId,res);
            //return res
            return res.status(200).json({success:true, message:"Payment verification successfull"})
        }

        return res.status(200).json({
            success:false,
            message:"Payment verification failed",
        })
    
}

exports.getPurchaseHistory=async (req,res)=>{
    const userId=req.user.id;
    let purchaseData=[]
    try{
        const userData=await User.findById(userId)
        .populate({
            path : "courses",
            populate: [
                {
                  path: "ratingAndReviews"
                },
                {
                  path: "instructor"
                }
              ]
        });
        if(!userData){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })  
        }

        //console.log("userData:",userData);
        //console.log("User instructor object:",userData.courses[0].instructor)

        //console.log("user courses:",userData.courses);
        
        /*console.log("rating and reviews:",userData.courses[0].ratingAndReviews);*/
        
       const enrolledCourses=userData.courses;

       // console.log("userData:",userData.courses);
        

    
       // console.log("enrolledCourses:",enrolledCourses);
      // console.log("rating and reviews:",enrolledCourses[0].ratingAndReviews);


        if(enrolledCourses.length===0){
            return res.status(404).json({
                success:false,
                message:"User enrolled courses not found"
            })
        }

      //  console.log("enrolledCourses:",enrolledCourses);

       for(let i=0;i<enrolledCourses.length;i++){

            

            let courseProgressData=await CourseProgress.findOne({
                courseId:enrolledCourses[i]._id,
                userId:userData._id
            })

            if(!courseProgressData){
                throw new Error("Course Progress Data not found");
            }

           // console.log("courseProgressData:",courseProgressData);

           purchaseData.push(
            {
                courseName: enrolledCourses[i].courseName,
                courseThumbnail: enrolledCourses[i].thumbnail,
                courseInstructorName: enrolledCourses[i].instructor.firstName+" "+enrolledCourses[i].instructor.lastName,
                coursePrice: enrolledCourses[i].price,
                courseAvgRating: getAverageRating(enrolledCourses[i].ratingAndReviews),
                coursePayment: courseProgressData.createdAt,
            }
           )
        }

        res.status(200).json({
            success:true,
            message:"Purchase History fetched successfully",
            purchaseData
        })

        

       

       
    }catch(err){
        console.log("getPurchaseHistory error:",err); 
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:err.message,
        }) 
    }
}
