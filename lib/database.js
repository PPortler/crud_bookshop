import mongoose from "mongoose";

export async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database Connected.");
    }catch(err){
        console.log("Connect database Error: ",err)
    }
}