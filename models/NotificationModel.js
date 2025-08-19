import mongoose from "mongoose";

const notificationSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        actor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        type:{
            type:String,
            enum:["FOLLOW","LIKE","COMMENT"],
            required:true,
        },
        post:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post'
        },
        read:{
            type:Boolean,
            default:false,
        }
    },
    {
        timeseries:true,
    }
)

const Notification=mongoose.model('Notification',notificationSchema);
export default Notification;