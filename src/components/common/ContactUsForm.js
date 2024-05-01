import React,{useState,useEffect} from 'react';
import {useForm} from "react-hook-form";
import { apiConnector } from '../../services/apiConnector';
import CountryCode from "../../data/countrycode.json";

const ContactUsForm=()=>{

    const [loading,setLoading]=useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors,isSubmitSuccessful}
    }=useForm();


    useEffect(()=>{
        if(!isSubmitSuccessful){
            reset({
                email:"",
                firstname:"",
                lastname:"",
                message:"",
                phoneNo:"",

            })
        }
    },[reset,isSubmitSuccessful])

    const submitContactForm=async (data)=>{
          console.log("Logging data",data);
          try{
            setLoading(true);
            const response=await apiConnector("POST",)
            console.log("Logging Response",response);
            setLoading(false);
          }catch(err){
            console.log(err);
            setLoading(false);
          }
    }

    return (
        <form onSubmit={handleSubmit(submitContactForm)}>

        <div className="flex gap-5">
            <div className="flex flex-col">
                <label htmlFor="firstname">First Name</label>
                <input 
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder="Enter First Name"
                    {...register("firstname",{required:true})}
                />
                {
                    errors.firstname && (
                        <span>
                            Please Enter Your Name
                        </span>
                    )
                }
            </div>

            <div className="flex flex-col">
                <label htmlFor="lastname">Last Name</label>
                <input 
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder="Enter Lirst Name"
                    {...register("lastname",{required:true})}
                />
                {
                    errors.firstname && (
                        <span>
                            Please Enter Your Name
                        </span>
                    )
                }
            </div>
        </div>

        <div>
            <label htmlFor="email">Email</label>
            <input 
                type="email"
                name="email"
                id="email"
                placeholder="Enter email Address"
                {...register("email",{required:true})}
            />
        </div>

        <div className="flex flex-col gap-2">

           <label htmlFor="phonenumber">
           Phone Number
           </label>

           <div className="flex flex-row gap-5">
              <div>
                <select
                name="dropdown"
                id="dropdown"
                {...register("countrycode",{required:true})}
                >
                    {
                        CountryCode.map((element,index)=>{
                            return <option key={index} value={element}>
                            {element.code}-{element.country}
                                   
                            </option>
                        })
                    }
                </select>
              </div>
           </div>

           <div>
            <input 
                type="phonenumber"
                name="phonenumber"
                id="phonenumber"
                placeholder="12345 6789"
                className="text-black"
                {...register("phoneNo",{
                    required:{value: true, message: "Please enter phone number"},
                    maxLength:{value:10,message:"Invalid phone number"},
                    minLength: {value:8, message: "Invalid phone number"}
                })}
            />
           </div>

        </div>
        {
            errors && (
                <span>
                    {errors.phoneNo}
                </span>
            )
        }

        <div>
            <label htmlFor="message">Message</label>
            <textarea 
                name="message"
                id="message"
                cols="30"
                rows="7"
                placeholder="Enter Your message here"
                {...register("message",{required:true})}
            />
            {
                errors.message &&(
                    <span>
                        Enter Your Message
                    </span>
                )
            }
        </div>

        <button type="submit">
          Send Message
        </button>

        </form>
    )
}

export default ContactUsForm;