import { z } from "zod";

function passwordCallback(password){
    const hasUpper = /[A-Z]/.test(password)
    const hasLower=/[a-z]/.test(password)
    const hasNumber=/[0-9]/.test(password)
    const hasSpecial=/[!@#$%^&*]/.test(password)
    return hasUpper && hasLower && hasNumber && hasSpecial
}

export const SignupSchema=z.object({
    name:z.string().max(20,{message:"Exceeding the character limits of name"}).min(2,{message:"Minimum length can be 2"}),
    email:z.string().email({message:"Enter correct email format"}),
    password:z.string().refine((password)=>passwordCallback(password),{message:"Password must contain at least one uppercase, lowercase letter, and number"})
})

export const SigninSchema=z.object({
    email:z.string().email({message:"Enter correct email format"}),
    password:z.string()
})