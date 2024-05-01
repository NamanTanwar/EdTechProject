import React,{useState,useEffect} from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { getAllReviews } from '../../services/operations/courseDetailsAPI';
import RatingStars from './RatingStars';

const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

const ReviewSlider=()=>{

    const [reviews,setReviews]=useState([]);
    const truncateWords=15;

    useEffect(()=>{

        const fetchReviews=async ()=>{
           const result=await getAllReviews();
           console.log("reviews:",result);
           setReviews(result);
           console.log(reviews);
        }

        fetchReviews();

    },[])

    return (
        <Carousel
        responsive={responsive}
        swipeable={true}
        draggable={true}
        className="mt-4"
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={1000}
        keyBoardControl={true}
        transitionDuration={500}
        arrows={false}
        >
            {
              reviews.length>0 ? (
                
                  reviews.map((ele,_)=>{
                    return (
                        <div key={ele._id} className="flex flex-col space-y-2 bg-richblack-800 pt-4 pb-3 pl-2 m-3">
                
                        <div class="flex flex-row space-x-2">
                        <img src={ele.user.image} alt="User Image"
                        className="w-14 h-14 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                        <h1 className="font-semibold text-richblack-5">{ele.user.firstName} {ele.user.lastName}</h1>
                        <h2 className="text-[12px] font-medium text-richblack-500">{ele.course.courseName}</h2>
                        </div>
                        </div>

                        <div className="font-medium text-richblack-25">
                            <p>{ele.review.split(" ").length>truncateWords
                            
                            ? `${ele.review
                                 .split(" ")
                                 .slice(0,truncateWords)
                                 .join(" ")} ....`
                                 : `${ele.review}`
                            }</p>
                        </div>

                        <div class="flex flex-row items-center gap-2">
                            <h3 className="font-semibold text-yellow-100">{ele.rating.toFixed(1)}</h3>  
                            <RatingStars Review_Count={ele.rating}/>
                        </div>
                        
                        </div>
                    )
                })
                
              ) : (<h1 className="text-white">No Reviews To Show</h1>)
                
            }
        </Carousel>
    )
}

export default ReviewSlider;