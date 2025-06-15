import { Resend } from 'resend';

const resend=new Resend(process.env.RESEND_API);

export const sendOtpToMail=async(otp,email)=>{
    
    try {
        const data = await resend.emails.send({
        from: 'YourApp <your@domain.com>', // Verified sender
        to: [email],
        subject: 'Your OTP Code',
        html: `<div style="font-family: sans-serif; font-size: 16px;">
               <p>Your OTP is:</p>
               <h2>${otp}</h2>
               <p>This OTP will expire in 10 minutes.</p>
             </div>`,
    });

    console.log(data);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}