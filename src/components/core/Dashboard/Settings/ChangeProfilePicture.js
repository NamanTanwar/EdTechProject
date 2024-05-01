import React,{useRef,useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../common/IconBtn";
import {FiUpload} from "react-icons/fi";
import {updateDisplayPicture} from "../../../../services/operations/settingsAPI"

const ChangeProfilePicture=()=>{

    const {token}=useSelector((state)=>state.auth);
    const {user}=useSelector((state)=>state.profile);
    const dispatch=useDispatch();

    const [loading,setLoading]=useState(false);
    const [imageFile,setImageFile]=useState(null);
    const [previewSourse,setPreviewSource]=useState(null);

    //Creating a reference to the file input element
      const fileInputRef=useRef(null);

    //Programatically trigger a click  
    const handleClick=()=>{
        fileInputRef.current.click();
    }

    const handleFileChange=(e)=>{
           //Handling file change inside input element
           const file=e.target.files[0];
           if(file){
            setImageFile(file);
            previewFile(file);
           }
    }

    const previewFile=(file)=>{
         const reader=new FileReader();
         reader.readAsDataURL(file);
         //whenever the onloadend event happens on reader, run this function
         reader.onloadend=()=>{
            setPreviewSource(reader.result);
         }
    }

    const handleFileUpload=async ()=>{
        try{
            setLoading(true);
            const formData=new FormData();
            formData.append("displayPicture",imageFile);
            await dispatch(updateDisplayPicture(token,formData));
            setLoading(false);
        }catch(err){
            console.log("Error message----",err.message);
        }
    }

    useEffect(()=>{
        if(imageFile){
            previewFile(imageFile);
        }
    },[imageFile])

    return (
        <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
          
           <div className="flex flex-col md:flex-row items-center gap-x-4">

           <img 
            src={previewSourse || user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover"
            /> 

            <div className="space-y-2">
             <p>Change Profile Picture</p>
             <div className="flex flex-row gap-3">
             <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/gif image/jpeg"
             />
             <button
             onClick={handleClick}
             disabled={loading}
             className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
             >
             Select
             </button>
             <IconBtn
             text={loading ? "Uploading..." : "Upload" }
             onClick={handleFileUpload}
             >
             {!loading && (
                <FiUpload className="text-lg text-richblack-900"/>
             )}
                
             </IconBtn>

             </div>

            </div>

           </div>

        </div>
    )
}

export default ChangeProfilePicture;