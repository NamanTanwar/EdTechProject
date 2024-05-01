const SubSection = require('../models/SubSection');
const Section=require('../models/Section');
const {uploadImageToCloudinary}=require('../utils/imageUploader');
require("dotenv").config();

const createSubSection=async (req,res)=>{
    try{

        const {sectionId,title,description}=req.body;
        console.log("sectionId: ",sectionId);
        const video=req.files.video;

        if(!sectionId || !title || !description || !video){
            return res.status(404).json({
                sucess:false,
                message:"Required fields missing"
            })
        }

        const uploadVideo=await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME,
        )

        console.log(uploadVideo);

        const subSection=await SubSection.create({
            title:title,
            timeDuration: `${uploadVideo.duration}`,
            description:description,
            videoUrl:uploadVideo.secure_url,
        })

        console.log("SubSection:",subSection)

        const updatedSection=await Section.findByIdAndUpdate(
            {_id:sectionId},
            {$push:{subSection:subSection._id}},
            {new:true}
        ).populate("subSection")

        console.log("Updated Section:",updatedSection);

        res.status(200).json({
            success:true,
            message:"Sub Section created successfully",
            data:updatedSection
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            error:err.message,
            message:"Internal Server Error"
        })
    }
}

const updateSubSection=async (req,res)=>{
    try{

        const {sectionId,subSectionId,title,description}=req.body;

        const subSection=await SubSection.findById(subSectionId);
        
        if(!subSection){
            return res.status(404).json({
                success:false,
                message:"Sub Section not found"
            })
        }

        if(title!==undefined){
            subSection.title=title;
        }

        if(description!==undefined){
            subSection.description=description
        }

        if(req.files && req.files.video!==undefined){
            const video=req.files.video;
            const uploadDetails=await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.timeDuration=`${uploadDetails.duration}`;
            subSection.videoUrl=uploadDetails.secure_url;
        }

        await subSection.save();


        const updatedSection=await Section.findById(sectionId).populate("subSection")



        res.status(200).json({
            success:true,
            message:"Sub Section updated successfully",
            data:updatedSection
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            error:err.message,
            message:"Internal Server Error"
        })
    }
}

const deleteSubSection=async (req,res)=>{
    
    try{

        const {subSectionId,sectionId}=req.body;

        if(!subSectionId || !sectionId){
            return res.status(404).json({
                success:false,
                message:"Required Fields missing"
            })
        }
        
        const subSection=await SubSection.findByIdAndDelete(
            {_id:subSectionId},
        )

        if(!subSection){
            return res.status(404).json({
                success:false,
                message:"Sub Section not found"
            })
        }

        const updatedSection=await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $pull:{
                    subSection:subSectionId,
                }
            },
            {new:true}
        ).populate("subSection");

        res.status(200).json({
            success:true,
            message:"Sub Section deleted Successfully",
            data:updatedSection
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            error:err.message,
            message:"Internal Server Error"
        })
    }
}

module.exports={
    createSubSection,
    updateSubSection,
    deleteSubSection,
}