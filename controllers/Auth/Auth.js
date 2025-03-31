// signup,login

import { SigninSchema, SignupSchema } from "../../validations/authschema.js";
import bcrypt from "bcrypt";
import db from "../../db/db.js";
import jwt from "jsonwebtoken";

export async function signupcontroller(req, res) {
  const { name, email, password } = req.body;
  const parsedData = SignupSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: parsedData.error.issues[0].message,
    });
    return;
  }
  //BEFORE CREATING THE USER WITH REQUIRED NAME EMAIIL AND PASSWORD ASK FOR EMAIL VERIFICATION USING OTP
  // use password encryption
  let saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedpassword = await bcrypt.hash(password, salt);
  try {
    // 
    const user = await db.user?.create({
      data: {
        name,
        email,
        password: hashedpassword,
      },
    });

    if (user) {
      const jwtsecret = process.env.JWT_SECRET ;
      const token = jwt.sign({ id: user?.id }, jwtsecret, { expiresIn: "7d" });
      const isProduction=process.env.NODE_ENV === "production"

      res.cookie("access_token", token, {
        domain: isProduction ? '.vercel.app' : 'localhost',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
      });

      res.status(200).json({
        message: "Registered successfully",
        token,
        user,
      });
    }else{
      res.status(400).json({
        message:"User not created"
      })
    }
  } catch (error) {
    if (error.code === "P2002") {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    res
      .status(400)
      .json({ message: "Internal server error", error: error.message });
  }
}

export async function signincontroller(req, res) {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: parsedData.error.issues[0].message,
    });
    return;
  }

  try {
    //verify email
    const user = await prisma?.user.findFirst({
      where: {
        email: parsedData.data.email,
      },
    });
    if (!user) {
      res.status(400).json({
        message: "Create an account first",
      });
      return;
    }
    console.log(user);
    if (!user?.email_verified) {
      res.status(400).json({
        message: "Verify your email first",
      });
      return;
    }
    const ispasswordCorrect = await bcrypt.compare(
      parsedData.data.password,
      user?.password
    );
    if (!ispasswordCorrect) {
      res.status(400).json({
        message: "Incorrect credentials",
      });
      return;
    }
    const jwtsecret = process.env.JWT_SECRET ;
    const token = jwt.sign({ id: user?.id }, jwtsecret, { expiresIn: "7d" });

    const isProduction=process.env.NODE_ENV === "production"

      res.cookie("access_token", token, {
        domain: isProduction ? '.vercel.app' : 'localhost',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
      });

    res.status(200).json({
      message: "Signed in successfully",
      token,
      user,
    });
    return;
  } catch (error) {
    res.status(400).json({
      message: "Internal server error",
      error: error?.message,
    });
  }
}

export const logoutuser = async (req, res) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error while logging out ", error: error.message });
  }
};

export const checkToken=async (req,res)=>{
  const req_token = req.cookies?.access_token;
  console.log(req_token)
  try {
    if (!req_token) {
       res.status(400).json({ message: "Please login" });
       return
    }

    const payload = jwt.verify(req_token, process.env.JWT_SECRET) ;
    if (!payload?.id) {
       res.status(400).json({ message: "Token not valid" });
       return
    }

    const user = await db.user?.findFirst({ where: { id: payload.id } });
    if (!user) {
       res.status(400).json({ message: "User not found" });
       return
    }
    
    // also check if user email is verified then only set isAuthenticated to true
    if(!user.email_verified){
      res.status(200).json({
        message:"user authenticated but email not verified.Verify email first"
      })
      return
    }

    res.status(200).json({
      message: "User authenticated",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Token verification error:", error.message);
     res.status(400).json({ message: "Invalid token" ,token:req_token});
     return
  }
}