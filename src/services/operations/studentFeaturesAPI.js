import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";



const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API,
    GET_PURCHASE_HISTORY,
}=studentEndpoints;

function loadScript(src){
    return new Promise((resolve)=>{
        const script=document.createElement("script");
        script.src=src;

        script.onload=()=>{
            resolve(true)
        }

        script.onerror=()=>{
            resolve(false)
        }

        document.body.appendChild(script);
    })
}

export const sendPaymentSuccessEmail=async (response,amount,token)=>{
    try{
        await apiConnector(
            "POST",
            SEND_PAYMENT_SUCCESS_EMAIL_API,
            {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount,
            },
            {
                Authorization: `Bearer ${token}`
            }
        )
    }catch(err){
        console.log("PAYMENT SUCCESS EMAIL ERROR...",err);
    }
} 



const verifyPayment=async (bodyData,token,navigate,dispatch)=>{
    const toastId=toast.loading("loading...");
    dispatch(setPaymentLoading(true));
    try{

        const response=await apiConnector(
            "POST",
            COURSE_VERIFY_API,
            bodyData,
            {
                Authorization: `Bearer ${token}`,
            }
        )

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        toast.success("Payment successfull, you are added to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());

    }catch(err){
        console.log("PAYMENT VERIFY ERROR:",err);
        toast.error("Could not verify payment");
    }

    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));

}

export const buyCourse=async (token,courses,user_details,navigate,dispatch)=>{

    const toastId=toast.loading("Loading...");
    try{
        //loading razorpay script
        const res=await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        

        if(!res){
            toast.error("Razorpay SDK failed to load");
            return;
        }

        console.log("res is:",res);

        console.log("Razorpay sdk loaded");

        //initiate the order
        const orderResponse=await apiConnector(
            "POST",
            COURSE_PAYMENT_API,
            {courses},
            {
                Authorization: `Bearer ${token}`,
            }
        )

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
        }

        console.log("Printing orderResponse:",orderResponse.data);
        console.log("this is test:",orderResponse.data.message);

        //options

        console.log("Printing razorpay key:",process.env.REACT_APP_RAZORPAY_KEY);


        const options={
            key: process.env.REACT_APP_RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount: `${orderResponse.data.message.amount}`,
            order_id: orderResponse.data.message.id,
            name: "StudyNotion",
            description: "Thank you for your Purchase",
            image: rzpLogo,
            prefill: {
                name: `${user_details.firstName} ${user_details.lastName}`,
                email: user_details.email,
            },

            handler: (response)=>{
                sendPaymentSuccessEmail(response,orderResponse.data.message.amount,token);
            verifyPayment({...response,courses},token,navigate,dispatch);
            }
        }

        const paymentObject=new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed",function(response){
            toast.error("oops, payment failed");
            console.log(response.error);
        })
    
    }catch(err){
        console.log("PAYMENT_API_ERROR,",err);
        toast.error("Could not make payment");
    }
    toast.dismiss(toastId);

}

export const getPurchaseHistory=async (token)=>{
    const toastId=toast.loading("Loading...");
    let result=[];
    try{    
        const response=await apiConnector(
            "POST",
            GET_PURCHASE_HISTORY,
            null,
            {
                Authorization: `Bearer ${token}`
            }
        )

        console.log("GET_PRUHASE_HISTORY API RESPONSE:",response);

        if(!response.data.success){
            throw new Error(response.data.message);
        }

      // result=response.data;

      console.log("response is:",response);

      result=response.data.purchaseData;

    }catch(err){
        console.log("GET_PRUCHASE_HISTORY API ERROR:",err)
        toast.error("Could not fetch payment history");
    }
    toast.dismiss(toastId);
    return result;
}

