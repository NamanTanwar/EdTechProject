 const cloudinary=require('cloudinary').v2;

 const uploadImageToCloudinary=async (file,folder,height,quality)=>{
    
    //Creating options object for the image to be uploaded
    const options={folder};
    if(height){
        options.height=height;
    }
    if(quality){
        options.quality=quality;
    }
    options.resource_type="auto";

    //Calling the upload function from Cloudinary library with file and options
    return await cloudinary.uploader.upload(file.tempFilePath,options);    

 }

 module.exports={uploadImageToCloudinary};