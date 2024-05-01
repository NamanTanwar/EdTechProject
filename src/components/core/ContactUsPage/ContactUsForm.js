import React,{useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import { contactUsForm } from '../../../services/operations/contactUsAPI';
import CountryCode from "../../../data/countrycode.json"

const ContactUsForm=()=>{

    const [loading,setLoading]=useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors,isSubmitSuccessfull},
    }=useForm()

    const submitContactUsForm=async (data)=>{
        try{
            setLoading(true)
            console.log('Printing Data:',data);
            const result=await contactUsForm(data);
            console.log(result);
            setLoading(false);
        }catch(err){
            console.log("Submit ContactUsForm Error:",err);
        }
    }

    useEffect(()=>{
        if(isSubmitSuccessfull){
            reset({
                email: "",
                firstname: "",
                lastname: "",
                message: "",
                phoneNo: "",
            })
        }
    },[reset,isSubmitSuccessfull])

   

    return (
        <form 
        className="flex flex-col gap-7"
        onSubmit={handleSubmit(submitContactUsForm)}>
        
        <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor="firstName" className="label-style">
                    FirstName
                </label>
                <input 
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter First Name"
                    className="form-style"
                    {...register("firstName",{required: true})}
                />
                {
                    errors.firstName && (
                        <span>Please enter your first name</span>
                    )
                }
            </div>
            <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor="lastName" className="label-style">
                    Last Name
                </label>
                <input 
                    name="lastName"
                    id="lastName"
                    palceholder="Please Enter last name"
                    className="form-style"
                    {...register("lastName",{required: true})}
                />
            </div>
        </div>

        <div className="flex flex-col gap-2">
        <label htmlFor="email" className="label-style">
            Email Address
        </label>
        <input 
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email Address"
            className="form-style"
            {...register("email",{required: true})}
        />
        {
            errors.email && (
                <span>Please enter your email address</span>
            )
        }
        </div>

        <div className="flex flex-col gap-2">
        <label htmlFor="phonenumber" className="label-style">
            Phone Number
        </label>
        <div className="flex flex-col md:flex-row gap-5">
        <div className="flex 2-[81px] flex-col gap-2">
         <select>
            {CountryCode.map((ele,i)=>{
                return (
                    <option key={i} value={ele.code} className="text-richblack-900">
                     {ele.code}-{ele.country}
                    </option>
                )
            })}
         </select>
        </div>

        <div className="flex w-[calc(100%-90px)] flex-col gap-2">
        <input 
            type="number"
            name="phonenumber"
            id="phonenumber"
            placeholder="12345 67890"
            className="form-style"
            {...register("phoneNo",{
                required: {
                    value: true,
                    message: "Please enter your Phone Number.",
                },
                maxLength: {value: 12, message: "Invalid Phone Number"},
                minLength: {value: 10, message: "invalid Phone Number"},
            })}
        />
        </div>
        </div>
        {
            errors.phoneNo && (
                <span>{errors.phoneNo.message}</span>
            )
        }
        </div>

        <div className="flex flex-col gap-2">
        <label htmlFor="message" className="label-style">
            Message
        </label>
        <input 
            name="message"
            id="message"
            cols="30"
            rows="7"
            palceholder="Enter your message here"
            className="form-style"
            {...register("message",{required: true})}
        />
        {
            errors.message && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                    Please Enter your Message
                </span>
            )}
        </div>

        <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
           !loading &&
           "transition-all duration-200 hover:scale-95 hover:shadow-none"
         }  disabled:bg-richblack-500 sm:text-[16px] `}
        >
        Send Message
        </button>
        </form>
    )
}

export default ContactUsForm