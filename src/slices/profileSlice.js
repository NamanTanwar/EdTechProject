import {createSlice} from "@reduxjs/toolkit";

const initialState={
    user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading:false,
    showSidebar:false
}

const profileSlice=createSlice({
    name:"profile",
    initialState:initialState,
    reducers:{
        setUser:(state,value)=> {
            state.user=value.payload
        },
        setLoading:(state,value)=>{
            state.user=value.payload
        },
        setSidebar:(state,value)=>{
            state.showSidebar=value.payload
        }
    }
})

export const {setUser,setLoading,setSidebar}=profileSlice.actions;
export default profileSlice.reducer; 