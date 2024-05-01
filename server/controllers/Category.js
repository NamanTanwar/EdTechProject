const Category=require('../models/Category');
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

const createCategory=async (req,res)=>{

    try{

    //Fetching data from request body
    const {name,description}=req.body;

    //Validating received data    
    if(!name || !description){
        return res.status(400).json({
            success:false,
            message:"All fields are required",
        })
    }

    //Creating entry in db
    const CategoryDetails=await Category.create({
        name:name,
        description:description,
    })
    console.log(CategoryDetails);

    return res.status(200).json({
        success:true,
        message:"Category created successfully",
        data:CategoryDetails
    })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            error:err.message,
            message:"Internal Server Error",
        })
    }
}

const showAllCategories=async (req,res)=>{
    try{
        //Finding all categories with projection parameter to include only name and description
        console.log("Entered in controller");
        const allCategories=await Category.find(
            {},
            {name:true,description:true}
        )
        console.log("all categories:",allCategories)
        //Sending successfull response
        res.status(200).json({
            success:true,
            message:"Categories successfully fetched",
            data:allCategories,
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

const categoryPageDetails=async (req,res)=>{
    
    try{
        const {categoryId}=req.body;
        console.log("Printing Category Id:",categoryId);

        //Get courses for the specified category
        const selectedCategory=await Category.findById(categoryId)
        .populate({
            path: "courses",
            match: {status: "Published"},
            populate: "ratingAndReviews",
        })
        .exec();

        //Handle case when category not found
        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message:"Category Not Found"
            })
        }

        //Handle case when there are no courses
        if(selectedCategory.courses.length===0){
            console.log("No courses found in selected category")
            return res.status(404).json({
                success:false,
                message:"No courses found for specified category"
            })
        }

        //Get courses for any other random category
        const categoriesExceptSelected=await Category.find({
            _id: {$ne : categoryId}
        })
        let differentCategory=await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id)
            .populate({
                path: "courses",
                match: {status: "Published"},
                populate:"ratingAndReviews"
            })
            .exec();

            //Get top selling courses across all categories
            const allCategories=await Category.find()
            .populate({
                path:"courses",
                match : {status: "Published"},
                populate: {
                    path: "instructor",
                }
            }).exec()

            //Gives a 1d array containing all courses from all categories
            const allCourses=allCategories.flatMap((category)=>category.courses);
                        
            //Getting top 10 most selling courses
            const mostSellingCourses=allCourses
            .sort((a,b)=>b.sold-a.sold)
            .slice(0,10)

            res.status(200).json({
                success: true,
                data: {
                    selectedCategory,
                    differentCategory,
                    mostSellingCourses,
                }
            })



    }catch(err){
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:err.message,
        })
    }

       
}


module.exports={
    createCategory,
    categoryPageDetails,
    showAllCategories,
}