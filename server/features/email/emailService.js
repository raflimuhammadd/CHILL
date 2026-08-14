const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT, 10),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendVerificationEmail(toEmail, token) {
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'Chill Streams',
            to: toEmail,
            subject: 'Verifikasi Email - Chill Streams',
            text: `Halo! Klik link berikut untuk verifikasi email Anda: ${verificationUrl}. Link ini kadaluarsa dalam 24 jam.`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Verifikasi Email</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px;">
                        <h1 style="color: #333; text-align: center;">Verifikasi Email Chill Streams</h1>
                        <p style="color: #666; font-size: 16px;">Halo!</p>
                        <p style="color: #666; font-size: 16px;">Terima kasih telah mendaftar di Chill Streams. Klik tombol di bawah untuk verifikasi email Anda:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationUrl}" 
                               style="display: inline-block; padding: 14px 28px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                Verifikasi Email
                            </a>
                        </div>
                        <p style="color: #999; font-size: 14px;">Atau copy link berikut ke browser Anda:</p>
                        <p style="color: #4F46E5; word-break: break-all;">${verificationUrl}</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">Link ini akan kadaluarsa dalam 24 jam.</p>
                    </div>
                </body>
                </html>
            `,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`[EmailService] Verification email sent to ${toEmail}. MessageID: ${info.messageId}`);
            return info;
        } catch(error) {
            console.error(`[EmailService] Failed to send email to ${toEmail}:`, error.message);
            throw error;
        }
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log(`[EmailService] Email connection verified`);
            return true;
        } catch (error) {
            console.error(`[EmailService] Failed to verify email connection:`, error.message);
            return false;
        }
    }
}

module.exports = new EmailService();