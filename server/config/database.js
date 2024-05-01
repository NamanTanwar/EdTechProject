const mongoose=require('mongoose');
require('dotenv').config();

const connectToDb=async ()=>{

    try{
        await mongoose.connect(process.env.MONGO_URL,{  
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log("Connection To databse established");
    }catch(err){
        console.log("DB connection failed");
        console.error(err);
        process.exit(1);
    }
}

module.exports={connectToDb}