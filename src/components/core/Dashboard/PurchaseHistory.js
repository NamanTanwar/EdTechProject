import React,{useEffect,useState} from "react";
import {getPurchaseHistory} from "../../../services/operations/studentFeaturesAPI";
import { useSelector } from "react-redux";
import RatingStars from "../../common/RatingStars";


const PurchaseHistory=()=>{

    const {token}=useSelector((state)=>state.auth);
    const [purchaseHistoryData,setPurchaseHistoryData]=useState([]);
    
    useEffect(()=>{

        const fetchPurchaseHistory=async ()=>{
            let response=[];
            try{
                response=await getPurchaseHistory(token);
                console.log("response of getPurchaseHistory:",response);
            }catch(err){
                console.log(err);
            }
            setPurchaseHistoryData(response);
        }

        fetchPurchaseHistory();
    },[])


    return (
        <div>
        {/*Header*/}
        <div>
            <h1 className="text-3xl text-white">Courses Purchased So Far</h1>
        </div>
        {/*Purchased Courses*/}
        <div className="flex flex-col space-y-3 mt-3">
         
         {

            

            purchaseHistoryData.map((course,i)=>{

                const isoDate=new Date(course?.coursePayment);
                const day=isoDate.getDate();
                const month=isoDate.getMonth()+1;
                const year=isoDate.getFullYear();

                return (
                    <div key={i} className="flex flex-row  border-white rounded-md text-richblack-5 border p-2 justify-between">
                        <div>
                            <img 
                                src={course?.courseThumbnail}
                                alt={course?.courseName}
                                className="w-28 h-28"
                            />
                        </div>
                        <div>
                            <h2>{course?.courseName}</h2>
                            <RatingStars Review_Count={course?.courseAvgRating} Star_Size={25}/>
                            <p>Instructor Name: <span>{course?.courseInstructorName}</span></p>
                        </div>
                        
                        <div>
                            <p>Bought At: <span>{`Day: ${day}, Month: ${month}, Year: ${year}`}</span></p>
                            <p>Course Price: <span>{course?.coursePrice}</span></p>
                        </div>

                    </div>
                )
            })
         }
            
        </div>
        {/*Footer*/}
        <div></div>
        </div>
    )
}

export default PurchaseHistory;