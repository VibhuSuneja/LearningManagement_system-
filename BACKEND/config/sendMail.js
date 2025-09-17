import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendMail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD, // Use a Google App Password here
      },
    });

    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject: subject,
      html: `<p>Your OTP for password reset is <b>${text}</b>. It expires in 5 minutes.</p>`,
    });
    console.log("OTP sent successfully to:", email);
  } catch (error) {
    console.error("Error sending mail:", error);
    throw error;
  }
};

export default sendMail;