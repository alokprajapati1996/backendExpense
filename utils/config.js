
const mongoose=require('mongoose');
require('dotenv').config();
const URL=process.env.URI;

const connectionDB=async()=>{
try {
     await mongoose.connect(URL)
     console.log("mongoDB connected");
     
} catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
    
}
}
module.exports=connectionDB