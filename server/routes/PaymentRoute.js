const express=require('express');
const router=express.Router();

const {capturePayment,verifyPayment,sendPaymentSuccessEmail,getPurchaseHistory}=require('../controllers/Payment');
const {auth,isInstructor,isStudent,isAdmin}=require('../middlewares/auth');

router.post('/capturePayment',auth,isStudent,capturePayment);

router.post('/verifyPayment',auth,isStudent,verifyPayment);

router.post("/sendPaymentSuccessEmail",auth,isStudent,sendPaymentSuccessEmail);

router.post("/getPurchaseHistory",auth,isStudent,getPurchaseHistory);


module.exports=router;