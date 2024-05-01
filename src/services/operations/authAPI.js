import {toast} from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import {setLoading,setToken} from "../../slices/authSlice";
import {endpoints} from "../apis";
import {setUser} from "../../slices/profileSlice";
import { resetCart } from '../../slices/cartSlice';

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
}=endpoints;

const sendOtp=(email,navigate)=>{
    return async (dispatch)=>{
        
        //Creating toast
        const toastId=toast.loading("Loading");
        
        dispatch(setLoading(true));
        try{
            //POST request to SENDOTP_API route
            const response=await apiConnector('POST',SENDOTP_API,{
                email,
                checkUserPresent:true,
            })
            console.log(response);
            //Checking response success
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("OTP Sent Successfully");
            
            //Navigating to opt verification page
            navigate("/verify-email");
        
        }catch(err){
            
            console.log("SEND OTP API Error",err);
            toast.error("Could not Send OTP");
        }
        dispatch(setLoading(false));
        //Removing toast programmatically
        toast.dismiss(toastId);
    }
}

const login=(email,password,navigate)=>{
    return async (dispatch)=>{
        const toastId=toast.loading("Loading...");
        dispatch(setLoading(true))
        try{
            //LOGIN POST REQUEST
            const response=await apiConnector("POST",LOGIN_API,{
                email,
                password,
            })
            //RESPONSE
            console.log("Login api response:",response);
            
            //HANDLING FAILED RESPONSE
            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Login Successful");
           // console.log("Token received from backend:",response.data.token);
            dispatch(setToken(response.data.token));
            const userImage=response.data?.user?.image ? response.data.user.image : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
            dispatch(setUser({...response.data.user,image:userImage}))
            localStorage.setItem("token",JSON.stringify(response.data.token))
            localStorage.setItem("user",JSON.stringify(response.data.user))

            navigate("/dashboard/my-profile");
        }catch(err){
            console.log("LOGIN API ERROR:",err);
            toast.error("Login Failed");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

const getPasswordResetToken=(email,setEmailSent)=>{
    return async (dispatch)=>{
        dispatch(setLoading(true));
        try{
            
            const response=await apiConnector("POST",RESETPASSTOKEN_API,{email});

            console.log("Reset Password Response....",response);

            if(!response.data.success){
                throw new Error(response.error.message);
            }
            toast.success("Reset email sent");
            
            setEmailSent(true);

        }catch(err){
            console.log("Reset Password Token Error:",err);
            toast.error("Failed to send email")
        }
        dispatch(setLoading(false));
    }
}

const resetPassword=(password,confirmPassword,token,navigate)=>{
      return async (dispatch)=>{
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true));
        try{

            const response=await apiConnector("POST",RESETPASSWORD_API,{
                password,
                confirmPassword,
                token
            })
            console.log("Reset Password RESPONSE DATA:",response);
            
            if(!response.data.message){
                throw new Error(response.data.message);
            }

            toast.success("Password has been reset successfully");
            navigate('/login'); 

        }catch(err){
            console.log("RESET PASSWORD Error",err);
            toast.error("Failed To Reset Password");
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
      }
}


const signUp=(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
)=>{
    return async (dispatch)=>{
        
        const toastId=toast.loading("Loading...");
        dispatch(setLoading(true));
        try{

            const response=await apiConnector("POST",SIGNUP_API,{
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp,
            })

           // console.log("SIGNUP API RESPONSE....",response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Signup Successfull");
            
            //navigating to login upon successfull signup
            navigate("/login");

        }catch(err){
            console.log("Sign up error:",err);
            toast.error("Sign up failed");
            navigate("/signup");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

const logout=(navigate)=>{
    return (dispatch)=>{
        //Clearing redux state
        dispatch(setToken(null))
        dispatch(setUser(null));
        dispatch(resetCart());
        //Clearing local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user")
        toast.success("Logged Out");
        navigate('/')
    }
}




export {sendOtp,login,getPasswordResetToken,resetPassword,signUp,logout};
