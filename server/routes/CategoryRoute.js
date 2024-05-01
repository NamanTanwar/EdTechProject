const express=require('express');
const router=express.Router();

const {auth,isAdmin}=require('../middlewares/auth');
const {createCategory,categoryPageDetails,showAllCategories,}=require('../controllers/Category');

//Create a new category route
router.post('/createCategory',createCategory);

//Show all categories route
router.get('/showAllCategories',showAllCategories);

router.post('/getCategoryPageDetails',categoryPageDetails);

   

module.exports=router;