const mongoose=require('mongoose');

const courseSchema=new mongoose.Schema({
    courseName:{
        type:String,
        required:true,
    },
    courseDescription:{
        type:String,
        required:true,
    },
    instructor: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
    whatYouWillLearn:{
        type:String,
        required:true,
    },
    //Storing object ids of various Section which make up a course
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Section",

        }
    ],
    //Multiple rating and reviews associated with each course
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview",
        }
    ],

    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    //Each course belongs to a tag or multiple tags
    tag:{
        type: [String],
        required: true,
    },
    //A Course would belong to a specific category
    category: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    //List of students enrolled in a particular course
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }
    ],

    instructions: {
        type: [String],
    },
    //A course can be either drafted or published
    status: {
        type: String,
        enum: ["Draft","Published"],
    }
})

module.exports=mongoose.model("Course",courseSchema);