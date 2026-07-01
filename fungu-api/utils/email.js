const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendPasswordResetEmail = async (email, name, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    const result = await resend.emails.send({
      from: 'FunguApp <onboarding@resend.dev>',
      to: email,
      subject: 'Reset Your FunguApp Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #16a34a; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">FunguApp</h1>
          </div>
          <div style="padding: 30px; background-color: #f9fafb;">
            <h2 style="color: #1f2937;">Hi ${name},</h2>
            <p style="color: #4b5563;">We received a request to reset your FunguApp password. Click the button below to set a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #16a34a; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Reset My Password
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">FunguApp — Transparent Chama Management for Kenya</p>
          </div>
        </div>
      `
    });
    console.log('Password reset email sent:', result);
    return result;
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send reset email');
  }
};

module.exports = { sendPasswordResetEmail };