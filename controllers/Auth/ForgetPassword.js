import bcrypt from "bcrypt"

export default async function updatepassword(req,res){
    const {email,newpassword}=req.body;
    try{
        const salt=await bcrypt.genSalt(10)
        const hashedpassword=await bcrypt.hash(newpassword,salt);
        const user=await prisma?.user.update({
            where:{
                email
            },
            data:{
                password:hashedpassword
            }
        })
        if(!user){
            res.status(400).json({
                message:"User not found"
            })
        }
        res.status(200).json({
            message:"Password updated successfully"
        })
    }catch(error){
        console.log(error.message)
        res.status(400).json({
            message:"Internal server error"
        })
    }
}