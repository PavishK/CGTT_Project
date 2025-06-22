import nodemailer from 'nodemailer';

export const sendOtpToMail = async (otp, toEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Training Trains Support" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Your OTP Code - Password Change Verification',
      html: `
       <div style="background-color: #1f1f1f; color: #f2f2f2; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px 20px; text-align: center; border-radius: 12px; max-width: 600px; margin: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
    <img src="https://training.trainingtrains.com/images/logo/jtp_logo.png" alt="Training Trains Logo" style="width: 160px; background-color: #ffffff; border-radius: 10px; margin-bottom: 25px; padding: 8px;" />
    <h1 style="font-size: 26px; color: #ffffff; margin-bottom: 16px;">Password Reset Request</h1>
    <p style="font-size: 16px; color: #e0e0e0; margin-bottom: 25px;">
      We received a request to reset the password for your Training Trains account. Please use the code below to proceed.
    </p>
    <div style="display: inline-block; background: #ffffff; color: #000000; padding: 16px 32px; font-size: 26px; font-weight: bold; letter-spacing: 2px; border-radius: 10px; margin-bottom: 25px;">
      ${otp}
    </div>
    <p style="font-size: 14px; color: #cccccc;">
      This code is valid for 10 minutes.
    </p>
    <p style="font-size: 12px; color: #999999; margin-top: 8px;">
      If you didn't request this, no changes will be made. Please ignore this email.
    </p>
  </div>`,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    return false;
  }
};


export const resetMail = async (password, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Password Has Been Reset',
      html: `
        <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;border:1px solid #ddd;padding:30px;border-radius:10px;background:#fff;color:#000">
          <div style="text-align:center;margin-bottom:30px;">
            <img src="https://training.trainingtrains.com/images/logo/jtp_logo.png" alt="Training TrainsLogo" style="height:100px; width:200px;" />
          </div>

          <h2 style="color:#000;text-align:center;margin-bottom:20px">Password Reset Successful</h2>

          <p style="font-size:16px;margin-bottom:20px">
            Hello,
          </p>

          <p style="font-size:16px;margin-bottom:20px">
            A new password has been generated for your Training Trains account. Please use the following password to log in:
          </p>

          <div style="background:#000;color:#fff;padding:15px;border-radius:5px;text-align:center;font-size:18px;font-weight:bold;letter-spacing:1px">
            ${password}
          </div>

          <p style="font-size:14px;margin-top:20px;color:#555">
            You can change this password from your profile settings after logging in.
          </p>

          <hr style="margin:30px 0;border:none;border-top:1px solid #ccc" />

          <p style="font-size:12px;text-align:center;color:#aaa">
            If you didn’t request a password reset, please contact our support team immediately.
          </p>
        </div>      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};
