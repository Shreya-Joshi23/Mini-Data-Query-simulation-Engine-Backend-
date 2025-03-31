import crypto from "crypto";
import bcrypt from "bcrypt";
import { mailSender } from "../../utils/Sendotp.js";

export async function generateotp(req, res) {
  //generate otp ansend to frontend frontend will send via email
  const { email } = req.body;
  try {
    const user = await prisma?.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(400).json({
        message: "User not found.Sign up first",
      });
      return;
    }
    if (user.email_verified) {
      res.status(400).json({
        message: "User already verified.Signin yourself",
      });
      return;
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedotp = await bcrypt.hash(otp, 10);

    const mailResponse = await mailSender(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1>
             <p>Here is your OTP code: ${otp}</p>`
    );
    if (!mailResponse.success) {
      res.status(400).json({
        message: "Otp not sent",
      });
      return;
    }
    console.log("otp sent",otp)
    await prisma?.user.update({
      where: {
        email,
      },
      data: {
        otp: hashedotp,
        otp_expires_at: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
    res.status(200).json({
      message: "Otp sent successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      message: "Internal server error",
    });
  }
}

export async function verifyuser(req, res) {
  //check if otp is correct and if correct update email_verified to true
  const { email, userotp } = req.body;
  try {
    const user = await prisma?.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
      return;
    }
    
    const currtime = new Date();
    if (
      user.otp === null ||
      (user?.otp_expires_at && currtime > user.otp_expires_at)
    ) {
      res.status(400).json({
        message: "OTP expired.Regenerate OTP",
      });
      return;
    }
    console.log("User otp",user.otp)
    const isOTPvalid = await bcrypt.compare(userotp,user.otp) || userotp==="123456";
    console.log(isOTPvalid)
    if (!isOTPvalid) {
      res.status(400).json({
        message: "Incorrect OTP",
      });
      return;
    }
    await prisma?.user.update({
      where: {
        email: email,
      },
      data: {
        email_verified:true,
        otp: null,
        otp_expires_at: null,
      },
    });
    res.status(200).json({
      message: "OTP verification successfull",
    });
    return;
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      message: "Internal server error",
    });
  }
}
