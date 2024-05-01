import {toast} from 'react-hot-toast';
import {apiConnector} from "../apiConnector";
import { contactusEndpoints } from '../apis';

const {
    CONTACT_US_API
}=contactusEndpoints


export const contactUsForm=async (data)=>{
    const toastId=toast.loading("Loading...");
    let response=[]
    try{
        response=await apiConnector(
            "POST",
            CONTACT_US_API,
            data,
        )

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        console.log("CONTACT_US_API response:",response);

        toast.success("Form Submitted Successfully")
    }catch(err){
        toast.error(err.message)
        console.log("CONTACT_US_API ERROR:",err);
    }
    toast.dismiss(toastId);
    return response;
}