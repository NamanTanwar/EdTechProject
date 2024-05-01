const express = require("express")
const router = express.Router()

const {signup,sendOtp,login,changePassword}=require('../controllers/Auth');
const { resetPassword,resetPasswordToken } = require("../controllers/resetPassword");
const {auth}=require('../middlewares/auth');
// Route for user signup
router.post("/signup", signup)
router.post("/sendotp", sendOtp)
router.post('/login',login)

router.post("/changepassword",auth,changePassword);

router.post("/reset-password-token",resetPasswordToken);

router.post("/reset-password",resetPassword);

module.exports = router;