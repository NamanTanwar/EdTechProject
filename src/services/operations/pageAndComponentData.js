import React from 'react';
import { apiConnector } from '../apiConnector';
import { toast } from 'react-hot-toast';
import {catalogData} from "../apis";

export const getCatalogPageData=async (categoryId)=>{
    console.log("Entered in service layer");
    const toastId=toast.loading("Loading...");
    let result=[];
    try{

        const response=await apiConnector(
            "POST",
            catalogData.CATEGORY_PAGE_DETAILS_API,
            {
                categoryId: categoryId,
            }
        )

        if(!response?.data?.success){
            throw new Error("Could not Fetch Category Page Data");
        }
        result=response?.data;
        console.log("get catalog page data result:",result);
    }catch(err){
        console.log("CATALOG PAGE DATA API ERROR:",err);
        toast.error(err.message);
        result=err.response?.data;
    }
    toast.dismiss(toastId);
    return result;
}