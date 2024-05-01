const mongoose=require("mongoose");

const courseProgressSchema=new mongoose.Schema({
    //Object id of each course
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    //object Id of each subsection
    completedVideos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "SubSection"
        }
    ],
    createdAt: {
        type: Date,
        default:()=> Date.now(),
    }
})

module.exports=mongoose.model("CourseProgress",courseProgressSchema);