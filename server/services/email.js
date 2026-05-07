const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send verification email
 */
const sendVerificationEmail = async (email, verificationToken, userRole) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}&role=${userRole}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Verify Your Email - HyperLocal India',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to HyperLocal India!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
        <p style="margin-top: 20px; color: #666;">
          Or copy and paste this link: <br/>
          ${verificationLink}
        </p>
        <p style="color: #999; font-size: 12px;">This link expires in 24 hours.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

/**
 * Send order confirmation email
 */
const sendOrderConfirmationEmail = async (email, orderNumber, orderDetails) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: `Order Confirmed - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Order Confirmed!</h2>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
        <p><strong>Estimated Delivery:</strong> ${orderDetails.estimatedDeliveryTime}</p>
        <p>Thank you for your order! You can track your order in the app.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

module.exports = {
  sendVerificationEmail,
  sendOrderConfirmationEmail,
};
