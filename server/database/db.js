import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const MONGO_URL = process.env.MONGO_URL;


const Connection = async () => {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.log(error,"error while connecting to database");        
    }
}

export default Connection;