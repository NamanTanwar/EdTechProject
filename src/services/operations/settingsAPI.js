import {toast} from "react-hot-toast";
import { settingsEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import {setUser} from "../../slices/profileSlice";
import {logout} from "./authAPI";

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
}=settingsEndpoints;

export const updateDisplayPicture=(token,formData)=>{
    return async (dispatch)=>{
       const toastId=toast.loading("Loading...");
       try{

        const response=await apiConnector(
            'PUT',
            UPDATE_DISPLAY_PICTURE_API,
            formData,
            {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            }
        ) 
        console.log(
            "UPDATE_DISPLAY_PICTURE_API API_RESPONSE............",
            response
        )

        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Display Picture uploaded successfully");
        dispatch(setUser(response.data.data));
       }catch(err){
        console.log("UPDATE_DISPLAY_PICTURE_API API_ERROR.....",err);
        toast.error("Could not Update Display Picture");
       }
       toast.dismiss(toastId);
    } 
}

export const updateProfile=(token,formData)=>{
    return async (dispatch)=>{
        const toastId=toast.loading("Loading...")
        try{
            const response=await apiConnector(
            "PUT",
            UPDATE_PROFILE_API,
            formData,
            {
                Authorization: `Bearer ${token}`
            })

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            console.log("Update Profile Response:",response);

            const userImage = response.data.profileDetails.image
        ? response.data.profileDetails.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.profileDetails.firstName} ${response.data.profileDetails.lastName}`
        dispatch(
            setUser({...response.data.profileDetails,image:userImage})
        )
        toast.success("Profile Updated Successfully");
        }catch(err){
            console.log("UPDATE_PROFILE_API API ERROR........",err);
            toast.error("Could not update profile");
        }
        toast.dismiss(toastId);
    }
}

export const changePassword=async (token,formData)=>{
    
        const toastId=toast.loading("Loading....");
        try{
            const response=await apiConnector(
                "POST",
                CHANGE_PASSWORD_API,
                formData,
                {
                    Authorization: `Bearer ${token}`

                })

            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Password Updated Successfully")
        }catch(err){
            console.log("UPDATE_PASSWORD_API ERROR:",err);
            toast.error(err.response.data.message)
        }
        toast.dismiss(toastId);
}

export const deleteAccount=(token,navigate)=>{
    return async (dispatch)=>{
        const toastId=toast.loading("Loading....");
        try{
            const response=await apiConnector(
            "DELETE",
             DELETE_PROFILE_API,
             null,
             {
                Authorization: `Bearer ${token}`
             }
            )
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Profile Deleted Successfully");
            dispatch(logout(navigate));
        }catch(err){
            console.log(err);
            console.log("DELETE_PROFILE_API API ERROR.....",err);
            toast.error("Could not delete profile");
        }
        toast.dismiss(toastId);
    }
}


    
