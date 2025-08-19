import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

export const mailer=nodemailer.createTransport({
    host:process.env.MAIL_Host,
    port:Number(process.env.MAIL_PORT||465),
    secure: String(process.env.MAIL_SECURE)==='true',
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS,
    }
});

export const sendMail=async({to,subject,html})=>{
    await mailer.sendMail({
        from:process.env.MAIL_FROM,
        to,
        subject,
        html,
    });
}