import nodemailer from "nodemailer"

export async function mailSender(email,title,body){
    try{
        let transporter=nodemailer.createTransport({
            service:process.env.HOST_SERVICE,
            auth:{
                user:process.env.HOST_MAIL,
                pass:process.env.HOST_PASS
            }
        });
        // console.log(transporter);
        console.log(process.env.HOST_PASS)
        let info=await transporter.sendMail({
            from:process.env.HOST_MAIL,
            to:email,
            subject:title,
            html:body
        })
        console.log("Email info",info);
        return {success:true,info}
    }catch(error){
        console.log(error.message)
        return {success:false}
    }
}