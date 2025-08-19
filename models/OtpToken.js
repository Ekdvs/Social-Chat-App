import mongoose from 'mongoose'

const otpSchema =new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        otp:{
            type:String,
        },
        purpose:{
            type:String,
            enum:['VERIFY_EMAIL','RESET_PASSWORD'],
            required:true,

        },
        expiresAt:{
            type:Date,
            required:true,
        }
    },
    {
        timestamps:true
    }
)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpToken=mongoose.model('OTPToken',otpSchema);
export default OtpToken;
