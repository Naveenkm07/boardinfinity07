import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';

/**
 * Email service using Nodemailer.
 * Configured for Gmail SMTP by default, easily switchable to
 * SendGrid, Mailgun, AWS SES, etc. by changing the transport config.
 */

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
        user: env.SMTP_EMAIL,
        pass: env.SMTP_PASS,
    },
});

/**
 * Send an OTP verification email.
 *
 * @param to - Recipient email address
 * @param otp - The 6-digit OTP code (plaintext — hashed version is stored in DB)
 */
export const sendOtpEmail = async (to: string, otp: string): Promise<void> => {
    const mailOptions = {
        from: `"College Placement Portal" <${env.SMTP_EMAIL}>`,
        to,
        subject: 'Your Login OTP — College Placement Portal',
        html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎓 College Placement Portal</h1>
        </div>
        <div style="background: #ffffff; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1a202c; margin-top: 0;">Verify Your Login</h2>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
            Use the following one-time password to complete your login:
          </p>
          <div style="background: #f7fafc; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea;">${otp}</span>
          </div>
          <p style="color: #718096; font-size: 14px;">
            ⏱️ This code expires in <strong>10 minutes</strong>.
          </p>
          <p style="color: #718096; font-size: 14px;">
            If you didn't request this code, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #a0aec0; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} College Placement Portal. All rights reserved.
          </p>
        </div>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`OTP email sent to ${to}`);
    } catch (error) {
        logger.error('Failed to send OTP email:', error);
        throw new Error('Failed to send OTP email. Please try again later.');
    }
};

/**
 * Verify SMTP connection on startup (optional health check).
 */
export const verifyEmailConnection = async (): Promise<boolean> => {
    try {
        await transporter.verify();
        logger.info('✅ SMTP connection verified');
        return true;
    } catch (error) {
        logger.warn('⚠️ SMTP connection failed — email functionality may not work:', error);
        return false;
    }
};
