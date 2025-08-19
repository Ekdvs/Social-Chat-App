import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:[true,'Provide user'],
    },
    caption:{
        type:String,
        default:'',
    },
    image:{
        type:[String],


    },
    Likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:[true,'Provide user'],
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:[true,'Provide user'],
    }]

}
,{
    timestamps:true
})

const Post=mongoose.model('Post',postSchema);
export default Post;