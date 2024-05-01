import {createSlice} from "@reduxjs/toolkit";

const initialState={
    step: 1,
    course: null,
    editCourse: false,
    paymentLoading: false,
}

const courseSlice=createSlice({
    name:"course",
    initialState,
    reducers: {
        resetCourseState: (state)=>{
            state.step=1;
            state.course=null;
            state.editCourse=false;
        },
        setStep: (state,action)=>{
            state.step=action.payload
        },
        setCourse: (state,action)=>{
            state.course=action.payload;
        },
        setEditCourse: (state,action)=>{
            state.editCourse=action.payload;
        },
        setPaymentLoading: (state,action)=>{
            state.paymentLoading=action.payload;
        }
    }
})

export const {resetCourseState,setPaymentLoading,setEditCourse,setCourse,setStep}=courseSlice.actions;
export default courseSlice.reducer;