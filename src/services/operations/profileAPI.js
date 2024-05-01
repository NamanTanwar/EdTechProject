import {toast} from 'react-hot-toast';
import { setLoading, setUser } from '../../slices/profileSlice';
import { apiConnector } from '../apiConnector';
import {profileEndpoints} from "../apis";
import {logout} from "./authAPI";

const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API,UPDATE_PROFILE_API,GET_INSTRUCTOR_DATA_API } = profileEndpoints


export const getUserDetails=(token,navigate)=>{
    return async (dispatch)=>{
        const toastId=toast.loading("Loading...");
        dispatch(setLoading(true));
        try{

            const response=await apiConnector("GET",GET_USER_DETAILS_API,null,{
                Authorization: `Bearer ${token}`,
            })
            console.log("GET_USER_DETAILS API RESPONSE.....",response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }
            const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
        dispatch(setUser({...response.data.data,image:userImage}))
        }catch(err){
            dispatch(logout(navigate));
            console.log("GET_USER_DETAILS API ERROR.......",err);
            toast.error("Could not get user details");
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

export const getUserEnrolledCourses=async (token)=>{
    const toastId=toast.loading("Loading ...");
    let result=[];
    try{
        const response=await apiConnector(
            "GET",
            GET_USER_ENROLLED_COURSES_API,
            null,
            {
                Authorization : `Bearer ${token}`,
            }
        )

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        console.log("GET_ENROLLED_COURSES_API RESPONSE:",response);

        result=response.data.data;
    }catch(err){
        console.log("GET_USER_ENROLLED_COURSES_API API ERROR",err);
        toast.error("Could not get Enrolled Courses");
    }
    toast.dismiss(toastId);
    return result;
}

export const getInstructorData=async (token)=>{
    const toastId=toast.loading("Loading...");
    let result=[];
    try{
        const response=await apiConnector(
            "GET",
            GET_INSTRUCTOR_DATA_API,
            null,
            {
                Authorization: `Bearer ${token}`
            }
        )

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        console.log("GET_INSTRUCTOR_API_RESPONSE:",response);
        result=response?.data?.courses;
    }catch(err){
        console.log("GET_INSTRUCTOR_API ERROR:",err);
        toast.error("Could not get Instructor data")
    }
    toast.dismiss(toastId);
    return result;
}


