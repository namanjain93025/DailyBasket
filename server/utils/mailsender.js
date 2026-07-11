// const nodemailer = require("nodemailer");
import nodemailer from 'nodemailer';
import dotenv, { config } from 'dotenv'
// import {,config } from 'dotenv';
config()
export const mailSender = async({ toEmail, customerName, orderId, totalPrice })=>
{// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

try {

const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 0;">
      <tr>
        <td align="center">
          <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background:#2e7d32; padding: 24px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:22px;">🛒 DailyBasket</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 28px; text-align:center;">
                <p style="font-size:16px; color:#333; margin:0 0 8px;">Hi ${customerName},</p>
                <p style="font-size:15px; color:#555; margin:0 0 20px;">
                  Your order has been placed successfully! 🎉
                </p>

                <p style="font-size:14px; color:#777; margin:0;">Order ID: <strong>${orderId}</strong></p>

                <p style="font-size:28px; color:#2e7d32; font-weight:bold; margin:16px 0;">
                  ₹${totalPrice}
                </p>

                <p style="font-size:14px; color:#555; margin-top:10px;">
                  Thank you for shopping with us!     
          </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f4f4f7; padding:14px; text-align:center;">
                <p style="font-size:12px; color:#999; margin:0;">
                  © ${new Date().getFullYear()} DailyBasket. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
     const mailOptions = {
      from: `"DailyBasket" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Order Confirmed - #${orderId}`,
      html: htmlContent,
  };
  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  return info;
} catch (err) {
  console.error("Error while sending mail:", err);
}
}


   