const express=require('express');
const router=express.Router();
const {auth, isInstructor}=require('../middlewares/auth');

const {
    deleteProfileAndAccount,
    updateProfile,
    getAllUserDetails,
    getEnrolledCourses, 
    updateDisplayPicture,
    instructorDashboard,
}=require('../controllers/Profile');


//Delete user Profile
router.delete('/deleteProfile',auth,deleteProfileAndAccount); 

//Update user Profile
router.put('/updateProfile',auth,updateProfile);

//Get details for all users
router.get('/getUserDetails',auth,getAllUserDetails);

//Get enrolled courses for a user
router.get('/getEnrolledCourses',auth,getEnrolledCourses);

//Update profile picture for a user
router.put('/updateDisplayPicture',auth,updateDisplayPicture);

//
router.get('/instructorDashboard',auth,isInstructor,instructorDashboard);

module.exports=router;