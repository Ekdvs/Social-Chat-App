import express from 'express'
import connectDB from './configs/db.js'
import dotenv from 'dotenv'



const app=express();
dotenv.config();
// add middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))

const PORT=process.env.PORT;

//conectthe database 
connectDB().then(()=>{
app.listen(PORT,()=>{
    console.log(`🚀 Server running on port ${PORT}`);
})
})
