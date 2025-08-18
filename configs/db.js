import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        if(!process.env.MONGO_URI){
            throw new Error('please check env file MONGO_URI varibale value')
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('sucessful connect to database')

    }
    catch(error){
        console.error('Database Connection Failed...',error)
        process.exit(1)
    }

}
export default connectDB