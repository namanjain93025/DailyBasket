// utils/sendResetEmail.js
import nodemailer from 'nodemailer'

// Reuse the same transporter config you used for OTP emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS // your Gmail App Password
  }
});

export const sendResetEmail = async (mail, url) => {
  try {
    const mailOptions = {
      from: `"DailyBasket" <${process.env.SMTP_USER}>`,
      to: mail,
      subject: 'Reset Your DailyBasket Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>We received a request to reset your DailyBasket account password.</p>
          <p>Click the button below to set a new password. This link is valid for <b>15 minutes</b>.</p>
          <a href="${url}" 
             style="display:inline-block; padding:12px 24px; margin:16px 0; 
                    background-color:#22c55e; color:#fff; text-decoration:none; 
                    border-radius:6px; font-weight:bold;">
            Reset Password
          </a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color:#555;">${url}</p>
          <p style="margin-top:24px; color:#888; font-size:13px;">
            If you didn't request this, you can safely ignore this email — your password will remain unchanged.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Reset email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw new Error('Failed to send reset email');
  }
};

