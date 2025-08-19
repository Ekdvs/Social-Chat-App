import e from "cors";
import mongoose from "mongoose";

const commentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'Provide correct User']
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:[true,'Provide correct Post']


    },
    text:{
        type:String,
        require:true,
        default:''
    }

})

const CommentModel=mongoose.model('Comment',commentSchema);
export default CommentModel;