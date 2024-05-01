import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Course_Card from './CourseCard';

const responsive = { 
    superLargeDesktop: {
      // the naming can be any, depends on you.
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



const CourseSlider=({Courses})=>{

    return (
        <>
        {
            Courses.length ? (
                <>
                    <Carousel
                    responsive={responsive}
                    swipeable={true}
                     draggable={true}
                     ssr={true}
                    className="mt-4 flex flex-row items-center justify-center space-x-3"
                    autoPlaySpeed={1000}
                    keyBoardControl={true}
                    transitionDuration={500}    
                    >
                        {Courses.map((course,i)=>{
                            return (
                                <div key={i}>
                                    <Course_Card course={course} Height={"h-[250px]"}/>
                                </div>
                            )
                        })}
                    </Carousel>
                </>
            ) : (
                <>
                    <p className="text-xl text-richblack-5">No Courses Found</p>
                </>

            )
        }
            
        </>
    )
       
}

export default CourseSlider;