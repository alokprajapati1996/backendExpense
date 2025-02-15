const dotenv=require('dotenv')
dotenv.config()
const nodemailer=require('nodemailer')
// let sendEmail=async(email,subject,message)=>{
    const transporter=nodemailer.createTransport({
        host: "smtp.gmail.com",
        sevice:"gmail",
        port: 587,
        secure: false, // Use TLS
          
        auth:{
                user:"alokprajapati913@gmail.com",
                pass:"vktf gpzd unfo lvfr"
            },

    });


module.exports=transporter