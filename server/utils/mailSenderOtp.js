import nodemailer from 'nodemailer';
import dotenv, { config } from 'dotenv'
config()

export const sendOtpMail = async (email, otp, name = "there") => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: `"Daily Basket" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: "Verify your Daily Basket account",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            
            <!-- Header -->
            <div style="background-color: #0d3b2e; padding: 24px; text-align: center;">
                <div style="display: inline-block; background-color: #d8f3e3; border-radius: 50%; padding: 14px 16px;">
                    <span style="color: #0d3b2e; font-weight: bold; font-size: 18px; letter-spacing: 1px;">DB</span>
                </div>
                <h1 style="color: #ffffff; font-size: 20px; margin: 12px 0 0;">Daily Basket</h1>
            </div>

            <!-- Body -->
            <div style="padding: 32px 28px; color: #374151;">
                <p style="font-size: 15px; margin: 0 0 8px;">Hi ${name},</p>
                <p style="font-size: 15px; margin: 0 0 24px;">
                    Use the OTP below to verify your email and complete your Daily Basket account setup.
                </p>

                <div style="background-color: #f0fdf4; border: 1px dashed #16a34a; border-radius: 8px; padding: 18px; text-align: center; margin-bottom: 24px;">
                    <span style="font-size: 30px; font-weight: bold; letter-spacing: 8px; color: #0d3b2e;">
                        ${otp}
                    </span>
                </div>

                <p style="font-size: 13px; color: #6b7280; margin: 0 0 4px;">
                    This OTP is valid for <strong>10 minutes</strong>.
                </p>
                <p style="font-size: 13px; color: #6b7280; margin: 0;">
                    If you didn't request this, you can safely ignore this email.
                </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af;">
                &copy; ${new Date().getFullYear()} Daily Basket. All rights reserved.
            </div>
        </div>
        `
    };

    await transporter.sendMail(mailOptions);
};