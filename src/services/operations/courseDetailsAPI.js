import { apiConnector } from "../apiConnector";
import {toast} from 'react-hot-toast';
import { courseEndpoints } from "../apis";

const {
    COURSE_CATEGORIES_API,
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    UPDATE_SECTION_API,
    CREATE_SECTION_API,
    DELETE_SECTION_API,
    CREATE_SUBSECTION_API,
    DELETE_SUBSECTION_API,
    UPDATE_SUBSECTION_API,
    GET_ALL_INSTRUCTOR_COURSES_API,
    DELETE_COURSE_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED,
    COURSE_DETAILS_API,
    LECTURE_COMPLETION_API,
    CREATE_RATING_API,
    GET_RATING_API,
}=courseEndpoints


export const fetchCourseCategories = async () => {
  let result = []
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API)
    console.log("COURSE_CATEGORIES_API API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("COURSE_CATEGORY_API API ERROR............", error)
    toast.error(error.message)
  }
  return result
}

export const addCourseDetails = async (data, token) => {
  console.log(token);
    let result = null
    const toastId = toast.loading("Loading...")
    console.log("token while adding course:",token);
    try {
      const response = await apiConnector("POST", CREATE_COURSE_API, data, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      })
      console.log("CREATE COURSE API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Add Course Details")
      }
      toast.success("Course Details Added Successfully")
      result = response?.data?.data
    } catch (error) {
      console.log("CREATE COURSE API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }

  export const editCourseDetails = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", EDIT_COURSE_API, data, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      })
      console.log("EDIT COURSE API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Update Course Details")
      }
      toast.success("Course Details Updated Successfully")
      result = response?.data?.data
    } catch (error) {
      console.log("EDIT COURSE API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }

  export const updateSection=async (data,token)=>{
    let result=null;
    const toastId=toast.loading("Loading...");
    try{
      const response=await apiConnector(
        "POST",
        UPDATE_SECTION_API,
        data,
        {
          Authorization: `Bearer ${token}`
        }
      )
      console.log("UPDATE SECTION API RESPONSE....",response);
      if(!response?.data?.success){
        throw new Error(response?.data?.message);
      }
      toast.success("Course Section Updated");
      result=response?.data?.data;
    }catch(err){
      console.log("UPDATE SECTION API ERROR",err);
      toast.error(err.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const createSection=async (data,token)=>{
  let result=null;
  const toastId=toast.loading("Loading...");
  console.log(token);
  try{
    const response=await apiConnector(
      "POST",
      CREATE_SECTION_API,
      data,
      {
        Authorization: `Bearer ${token}`
      }
    )
    console.log("CREATE_SECTION_API response: ",response);
    if(!response?.data?.success){
      throw new Error(response?.data?.message);
    }
    toast.success("New Course Section Created!");
    result=response?.data?.updatedCourseDetails;
  }catch(err){
    console.log("CREATE_SECTION_API error",err);
    toast.error(err.message);
  }
  toast.dismiss(toastId);
  return result;

}

export const createSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture")
    }
    toast.success("Lecture Added")
    result = response?.data?.data
  } catch (error) {
    console.log("CREATE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const deleteSubSection=async (data,token)=>{

  let result=null;
  const toastId=toast.loading("Loading..");
  try{

    const response=await apiConnector(
      "POST",
      DELETE_SUBSECTION_API,data,
      {
        Authorization: `Bearer ${token}`
      }
    );

    console.log("DELETE SUBSECTION API RESPONSE:",response);

    if(!response?.data?.success){
      throw new Error(response?.data?.message);
    }

    toast.success("Lecture deleted");
    
    result=response?.data?.data;
  
  }catch(err){
    console.log("DELETE SUBSECTION API ERROR:",err);
    toast.error(err.message);
  }
  toast.dismiss(toastId);
  return result;
}

export const deleteSection = async (data, token) => {
  let result = null
  console.log("delete section token: ",token);
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section")
    }
    toast.success("Course Section Deleted")
    result = response?.data?.data
  } catch (error) {
    console.log("DELETE SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const updateSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture")
    }
    toast.success("Lecture Updated")
    result = response?.data?.data
  } catch (error) {
    console.log("UPDATE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


export const fetchInstructorCourses=async (token)=>{

  let result=null;
  const toastId=toast.loading("Loading...");
  try{

    const response=await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      {},
      {
        Authorization: `Bearer ${token}`
      },
    )

    if(!response?.data?.success){
      throw new Error(response?.data?.message);
    }

    toast.success("Courses Successfully Fetched");
    result=response.data.data;
  }catch(err){
    console.log("GET_INSTRUCTOR_COURSES_API ERROR:",err);
    toast.error(err.message)
  }
  toast.dismiss(toastId);
  return result;
}


export const deleteCourse=async (data,token)=>{
  const toastId=toast.loading("Loading...");
  try{

    const response=await apiConnector(
      "DELETE",
       DELETE_COURSE_API,
       data,
       {
        Authorization: `Bearer ${token}`
       }
    )

    console.log("DELETE API RESPONSE:",response);

    if(!response?.data?.success){
      throw new Error(response?.data?.message)
    }
    toast.success("Course Deleted");
  }catch(err){
    console.log("DELETE COURSE API ERROR:",err.message);
    toast.error(err);
  }
  toast.dismiss(toastId);
}

export const getFullDetailsOfCourse=async (courseId,token)=>{
  
  const toastId=toast.loading("Loading...");
  let result=null;
  try{
    const response=await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`
      }
    )

    console.log("GET_FULL_DETAILS_API API RESPONSE......",response);

    if(!response.data.success){
      throw new Error(response.data.message);
    }
    result=response?.data?.data;

  }catch(err){
    console.log("COURSE_FULL_DETAILS_API_ERROR....",err);
    result=err.response.data;
    toast.error(err.response.data);
  }
  toast.dismiss(toastId);
  return result;

}

export const fetchCourseDetails=async (courseId)=>{
  const toastId=toast.loading("Loading...");
  let result=null;
  try{

    const response=await apiConnector(
      "POST",
      COURSE_DETAILS_API,
      {
        courseId
      }
    )

    console.log("COURSE_DETAILS_API RESPONSE:",response);

    if(!response.data.success){
      throw new Error(response.data.message);
    }

    result=response.data;

    toast.success("Course details fetched successfully");

  }catch(err){
    console.log("COURSE_DETAILS_API ERROR:",err);
    result=err.response.data;
    toast.error(err.message);
  }
  toast.dismiss(toastId);
  return result;
}

export const markLectureAsComplete=async (data,token)=>{
  const  toastId=toast.loading("Loading....");
  let result=null;
  try{
    const response=await apiConnector(
      "POST",
      LECTURE_COMPLETION_API,
      data,
      {
        Authorization: `Bearer ${token}`
      }
    )
    console.log("MARK_LECTURE_AS_COMPLETED_API API RESPONSE:",response);

    if(!response.data.success){
      throw new Error(response.data.message);
    }

    toast.success("Lecture Completed")
    result=true;

  }catch(err){
    console.log("MARK_LECTURE_AS_COMPLETE API ERR:",err)
    toast.error(err.message)
    result=false
  }
  toast.dismiss(toastId)
  return result
}

export const createRating=async (data,token)=>{
  const toastId=toast.loading("Loading...");
  let success=false;
  try{
    const response=await apiConnector(
      "POST",
      CREATE_RATING_API,
      data,
       {
        Authorization: `Bearer ${token}`
      }
    )

    console.log("CREATE RATING API RESPONSE....",response);

    if(!response.data.success){
      throw new Error(response.data.message);
    }

    toast.success("Rating Created");
    success=true;
  }catch(err){
    success=false;
    console.log("CREATE RATING API ERROR....",err);
    toast.error(err.message);
  }
  toast.dismiss(toastId);
  return success;
}

export const getAllReviews=async ()=>{
  let result=[];
  const toastId=toast.loading("Loading");
  try{
    const response=await apiConnector(
      "GET",
      GET_RATING_API,
      null,
    )
    console.log("GET_RATING_API RESPONSE:",response);

    if(!response.data.success){
      throw new Error(response.data.message);
    }

    //toast.success("Ratings fetched")
    result=response.data.allReviews;
  }catch(err){
    console.log("GET_RATING_API ERROR:",err.message)
    toast.error("Error in fetching ratings")
  }
  toast.dismiss(toastId)
  return result;
}