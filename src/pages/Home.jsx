import React from 'react';
import {Link} from 'react-router-dom';
import { RiArrowRightLine } from "react-icons/ri";import HighlightText from '../components/core/Homepage/HighlightText';
import CTAButton from '../components/core/Homepage/Button';
import Banner from '../assets/Images/banner.mp4';
import CodeBlocks from '../components/core/Homepage/CodeBlocks';
import '../App.css';
import { FaArrowRight } from 'react-icons/fa';
import TimeLineSection from '../components/core/Homepage/TimeLimeSection';
import LearningLanguageSection from '../components/core/Homepage/LearningLanguageSection';
import InstructorSection from '../components/core/Homepage/InstructorSection';
import ExploreMore from '../components/core/Homepage/ExploreMore';
import Footer from '../components/common/Footer';
import ReviewSlider from '../components/common/ReviewSlider';

const Home=()=>{
    return (
        <div>
            <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>
                <Link to={"/signup"}>
                    <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]'>
                        <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
                            <p>Become an Instructor</p>
                            <RiArrowRightLine />
                        </div>
                    </div>
                </Link>
                 
                 {/*Heading*/}
                <div className='text-center text-4xl font-semibold mt-7'>
                    Empower Your Future with <HighlightText text={'Coding Skills'} />
                </div>

                {/*Sub Heading*/}
                <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                </div>

                {/*CTA Buttons*/}
                <div className="flex flex-row gap-7 mt-8">   
                       <CTAButton active={true} linkTo={"/signup"}>
                           Learn More
                       </CTAButton>

                       <CTAButton active={false} linkTo={"/login"}>
                        Book a Demo
                       </CTAButton>
                </div>

                {/*Video*/}
                <div className="mx-3 my-12 shadow-[10px_-5px_50px_-5px] shadow-blue-200 ">
                    <video
                    className=""
                    muted
                    loop
                    autoPlay
                    >
                    <source src={Banner} type="video/mp4"/>
                    </video>
                </div>

                {/*Code section 1*/} 
                <div>
                    <CodeBlocks 
                        position={"lg:flex-row"}
                        heading={
                            <div className='text-4xl font-semibold'>
                                Unlock your <HighlightText text={"coding potential"}/> with our online courses
                            </div>
                        }
                        subheading={
                            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you"
                        }
                        ctabtn1={
                            {
                                btnText: "Try It Yourself",
                                linkTo: "/signup",
                                active: true,
                            }
                        }
                        ctabtn2={
                            {
                                btnText: "Learn more",
                                linkTo: "/login",
                                active: false,
                            }
                        }
                        codeblock={
                            `<!DOCKTYPE html>
                            <html>
                            head><title>Example</
                            title><link rel="stylesheet" href="styles.css"
                            /head>
                            body>
                            <h1><a>href='/'>Header</a>
                            </h1>
                            <nav><a href="one/">One<a href="two"/>Two</
                            a><a href="three"/>Three</a>
                            </nav>
                             `
                        }
                        codeColor={"text-yellow-25"}
                        backgroundGradient={<div className="codeblock1 absolute"></div>}
                    />
                </div>

                {/*Code section 2*/} 
                <div>
                    <CodeBlocks 
                        position={"lg:flex-row-reverse"}
                        heading={
                            <div className='w-[100%] text-4xl font-semibold lg:w-[50%]'>
                                Start <HighlightText text={"coding in seconds"}/> 
                            </div>
                        }
                        subheading={
                            "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                        }
                        ctabtn1={
                            {
                                btnText: "Continue Lesson",
                                linkTo: "/signup",
                                active: true,
                            }
                        }
                        ctabtn2={
                            {
                                btnText: "Learn more",
                                linkTo: "/login",
                                active: false,
                            }
                        }
                        codeblock={
                            `<!DOCKTYPE html>
                            <html>
                            head><title>Example</
                            title><link rel="stylesheet" href="styles.css"
                            /head>
                            body>
                            <h1><a>href='/'>Header</a>
                            </h1>
                            <nav><a href="one/">One<a href="two"/>Two</
                            a><a href="three"/>Three</a>
                            </nav>
                             `
                        }
                        codeColor={"text-white"}
                        backgroundGradient={<div className="codeblock2 absolute"></div>}
                    />
                </div>

                <ExploreMore />

            </div>

            {/*Section 3*/}
            <div className='bg-pure-greys-5 text-richblack-700'>

            <div className="homepage_bg h-[333px]">

                <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto'>
                <div className='h-[150px]'></div>
                <div className='flex flex-row gap-7 text-white'>
                    
                    <CTAButton active={true} linkTo={'/signup'}>
                     <div className='flex items-center gap-3'>
                       Explore full catalog
                       <FaArrowRight />
                     </div>
                    </CTAButton>

                    <CTAButton active={false} linkTo={'/signup'}>
                    <div>
                        Learn More
                    </div>
                    </CTAButton>

                </div>

                </div>       
            </div>


            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
               <div className='flex flex-row gap-5 mb-10 mt-[95px]'>

                    <div className='text-4xl font-semibold w-[45%]'>
                          Get the Skills you need for a 
                          <HighlightText text={"Job that is in demand"}/>
                    </div>

                    <div className='flex flex-col gap-10 w-[40%] items-start'>
                        
                         <div className='text=[16px]'>
                            The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills
                        </div>
 
                        <CTAButton active={true} linkto={'/signup'}>
                          Learn More
                        </CTAButton>
                    
                    </div>
                        
            </div>
            <TimeLineSection />
            <LearningLanguageSection />
            </div>

            </div>

            {/*Section 3*/}
             <div className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-980 text-white">
            
               <InstructorSection />

               <h2 className="text-center text-4xl font-semibold mt-10">Review from other learners</h2>

               <ReviewSlider />

             </div>

            <Footer />

        </div>
    )

}

export default Home;