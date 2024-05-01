const express=require('express');

const router=express.Router();

const {createCourse
    ,getAllCourses,
    getCourseDetails,
    editCourse,
    getInstructorCourses,
    getFullCourseDetails,
    deleteCourse,
}=require('../controllers/Course');

const {auth,isInstructor,isAdmin,isStudent}=require('../middlewares/auth');
const {createCategory}=require('../controllers/Category');

const {
    createSection,
    updateSection,
    deleteSection,
}=require('../controllers/Section');

const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
}=require("../controllers/subSection");

const {
    createRating,
    getAverageRating,
    getAllRatings,
}=require('../controllers/RatingAndReview');

const {
    updateCourseProgress,
}=require("../controllers/courseProgress");

//Create course route
router.post('/createCourse',auth,isInstructor,createCourse);

//Update a course
router.post("/editCourse",auth,isInstructor,editCourse);

//Create section of course route
router.post('/addSection',auth,isInstructor,createSection);

//Update section route
router.post('/updateSection',auth,isInstructor,updateSection);

//Delete section route
router.post('/deleteSection',auth,isInstructor,deleteSection);

//Create SubSection route
router.post('/addSubSection',auth,isInstructor,createSubSection);

//Update Section route
router.post('/updateSubSection',auth,isInstructor,updateSubSection);

//Delete section route
router.post('/deleteSubSection',auth,isInstructor,deleteSubSection);

//Get all courses route
router.get('/getAllCourses',getAllCourses);

//Get adetails for a specific route
router.post('/getCourseDetails',getCourseDetails);

//Create a rating
router.post('/createRating',auth,isStudent,createRating);

//Get average Rating
router.get('/getAverageRating',getAverageRating);

//Get reviews
router.get('/getReviews',getAllRatings);

//
router.get("/getInstructorCourses",auth,isInstructor,getInstructorCourses);

router.post("/getFullCourseDetails",auth,getFullCourseDetails);

router.post("/updateCourseProgress",auth,isStudent,updateCourseProgress);

router.delete("/deleteCourse",deleteCourse);
 
module.exports=router; 