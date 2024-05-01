const mongoose=require('mongoose');
const Course=require('./Course');

const userSchema=new mongoose.Schema({

    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    //Three account types allowed
    accountType:{
        type:String,
        enum:["Student","Admin","Instructor"],
    },
    //Status of user
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    //Storing profile object id in additional details
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile"
    },
    //Storing all courses associated with particular user
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ],
    //Storing created token for particular user
    token: {
        type: String,
    },
    //Field for resetPasswordExpires functionality
    resetPasswordExpires: {
        type: Date
    },
    image: {
        type: String,
        required: true,
    },
    //Storing courseProgress object ids for various courses associated with particular user
    courseProgress: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "  CourseProgress"
        }
    ],

},
//automatically add createdAt and updatedAt fields to the documents in a collection
{timestamps: true})

userSchema.pre('findByIdAndDelete',{document:true,query:false},async (next)=>{
    try{
        const userId=this._id;
        await Course.updateMany(
            {studentsEnrolled: userId},
            {$pull: {studentsEnrolled: userId}}
        );
        console.log("User removed from enrolled courses successfully");
        next();
    }catch(err){
        console.log(err);
    }
})

module.exports=mongoose.model('User',userSchema);