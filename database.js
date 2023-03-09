import mongoose from 'mongoose'
import dotenv from 'dotenv' 
dotenv.config() // use env variables

// connect to mongoose, details are written in .env file
mongoose.set("strictQuery", false);
const connectToMongo = ()=>{
    mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log(`connected to db`);
    })
    .catch((err) => {
        console.log(err.message);
    });
}

export default connectToMongo