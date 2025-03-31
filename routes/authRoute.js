import { Router } from "express";
import { checkToken, logoutuser, signincontroller, signupcontroller } from "../controllers/Auth/Auth.js";
import { generateotp, verifyuser } from "../controllers/Auth/AccountVerification.js";
import updatepassword from "../controllers/Auth/ForgetPassword.js";

const authRouter=Router()

authRouter.post("/signup",signupcontroller)
authRouter.post("/signin",signincontroller)
authRouter.post("/generateotp",generateotp)
authRouter.post("/verifyotp",verifyuser)
authRouter.post("/updatepassword",updatepassword)
authRouter.post("/logout",logoutuser)
authRouter.get("/isAuth",checkToken)

export default authRouter