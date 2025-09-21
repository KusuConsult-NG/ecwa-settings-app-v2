// Email Verification System for ChurchFlow

import { sendEmail } from './email-service';

export interface EmailVerification {
  id: string;
  email: string;
  code: string;
  type: 'account_verification' | 'password_reset' | 'welcome';
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Generate verification code and expiry
export function createVerificationData(): { code: string; expiresAt: string } {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes
  
  return { code, expiresAt };
}

// Email templates for different verification types
export function getEmailTemplate(
  type: EmailVerification['type'],
  data: {
    userName?: string;
    organizationName?: string;
    code: string;
    role?: string;
  }
): EmailTemplate {
  const { userName, organizationName, code, role } = data;

  switch (type) {
    case 'account_verification':
      return {
        subject: `ChurchFlow - Verify Your Account`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0E4DA4; margin: 0;">ChurchFlow</h1>
              <p style="color: #666; margin: 5px 0 0 0;">Church Management System</p>
            </div>
            
            <h2 style="color: #333;">Welcome to ChurchFlow!</h2>
            <p>Dear ${userName || 'User'},</p>
            <p>Thank you for joining ${organizationName || 'ChurchFlow'}! To complete your account setup, please verify your email address using the code below:</p>
            
            <div style="background: linear-gradient(135deg, #0E4DA4, #3B82F6); padding: 30px; text-align: center; margin: 30px 0; border-radius: 12px;">
              <h1 style="color: white; font-size: 36px; margin: 0; letter-spacing: 6px; font-weight: bold;">${code}</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Next Steps:</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Enter this verification code in the app</li>
                <li>Complete your profile setup</li>
                <li>Start managing your church operations</li>
              </ul>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-weight: 500;">
                <strong>⏰ Important:</strong> This code expires in 30 minutes for security reasons.
              </p>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px; text-align: center;">
              This is an automated message from ChurchFlow. If you didn't create an account, please ignore this email.
            </p>
          </div>
        `,
        text: `
ChurchFlow - Church Management System

Welcome to ChurchFlow!

Dear ${userName || 'User'},

Thank you for joining ${organizationName || 'ChurchFlow'}! To complete your account setup, please verify your email address using the code below:

VERIFICATION CODE: ${code}

Next Steps:
- Enter this verification code in the app
- Complete your profile setup
- Start managing your church operations

Important: This code expires in 30 minutes for security reasons.

This is an automated message from ChurchFlow. If you didn't create an account, please ignore this email.
        `
      };

    case 'password_reset':
      return {
        subject: `ChurchFlow - Reset Your Password`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0E4DA4; margin: 0;">ChurchFlow</h1>
              <p style="color: #666; margin: 5px 0 0 0;">Church Management System</p>
            </div>
            
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Dear ${userName || 'User'},</p>
            <p>You have requested to reset your password for your ChurchFlow account. Use the verification code below to reset your password:</p>
            
            <div style="background: linear-gradient(135deg, #DC2626, #EF4444); padding: 30px; text-align: center; margin: 30px 0; border-radius: 12px;">
              <h1 style="color: white; font-size: 36px; margin: 0; letter-spacing: 6px; font-weight: bold;">${code}</h1>
            </div>
            
            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #dc2626; margin: 0; font-weight: 500;">
                <strong>🔒 Security Notice:</strong> If you didn't request this password reset, please ignore this email and contact support.
              </p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Instructions:</h3>
              <ol style="color: #666; line-height: 1.6;">
                <li>Enter this verification code in the app</li>
                <li>Create a new secure password</li>
                <li>Log in with your new password</li>
              </ol>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px; text-align: center;">
              This code expires in 30 minutes. If you need help, contact our support team.
            </p>
          </div>
        `,
        text: `
ChurchFlow - Church Management System

Password Reset Request

Dear ${userName || 'User'},

You have requested to reset your password for your ChurchFlow account. Use the verification code below to reset your password:

VERIFICATION CODE: ${code}

Security Notice: If you didn't request this password reset, please ignore this email and contact support.

Instructions:
1. Enter this verification code in the app
2. Create a new secure password
3. Log in with your new password

This code expires in 30 minutes. If you need help, contact our support team.
        `
      };

    case 'welcome':
      return {
        subject: `Welcome to ChurchFlow - Get Started!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0E4DA4; margin: 0;">ChurchFlow</h1>
              <p style="color: #666; margin: 5px 0 0 0;">Church Management System</p>
            </div>
            
            <h2 style="color: #333;">Welcome to ChurchFlow!</h2>
            <p>Dear ${userName || 'User'},</p>
            <p>Welcome to ${organizationName || 'ChurchFlow'}! Your account has been successfully created and you're ready to start managing your church operations.</p>
            
            <div style="background: linear-gradient(135deg, #16A34A, #22C55E); padding: 30px; text-align: center; margin: 30px 0; border-radius: 12px;">
              <h1 style="color: white; font-size: 28px; margin: 0;">🎉 Account Ready!</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">You can now access all ChurchFlow features</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">What you can do now:</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>📊 View your church dashboard</li>
                <li>💰 Manage finances and offerings</li>
                <li>👥 Track members and staff</li>
                <li>📅 Schedule events and services</li>
                <li>📈 Generate reports and analytics</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
                 style="background: #0E4DA4; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 14px; text-align: center;">
              Need help getting started? Check out our documentation or contact support.
            </p>
          </div>
        `,
        text: `
ChurchFlow - Church Management System

Welcome to ChurchFlow!

Dear ${userName || 'User'},

Welcome to ${organizationName || 'ChurchFlow'}! Your account has been successfully created and you're ready to start managing your church operations.

🎉 Account Ready! You can now access all ChurchFlow features.

What you can do now:
- 📊 View your church dashboard
- 💰 Manage finances and offerings
- 👥 Track members and staff
- 📅 Schedule events and services
- 📈 Generate reports and analytics

Go to Dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard

Need help getting started? Check out our documentation or contact support.
        `
      };

    default:
      throw new Error(`Unknown email template type: ${type}`);
  }
}

// Real email sending function using email service
export async function sendVerificationEmail(
  email: string,
  template: EmailTemplate
): Promise<boolean> {
  try {
    console.log('📧 Sending verification email to:', email);
    console.log('📧 Subject:', template.subject);
    console.log('📧 Code:', template.text.match(/VERIFICATION CODE: (\d+)/)?.[1] || 'N/A');
    
    // Use real email service
    const success = await sendEmail(email, template.subject, template.html, template.text);
    
    if (success) {
      console.log('✅ Verification email sent successfully');
    } else {
      console.log('❌ Failed to send verification email');
    }
    
    return success;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}

// Validate verification code
export function validateVerificationCode(
  code: string,
  verification: EmailVerification
): { valid: boolean; error?: string } {
  if (verification.isUsed) {
    return { valid: false, error: 'Verification code has already been used' };
  }

  if (new Date() > new Date(verification.expiresAt)) {
    return { valid: false, error: 'Verification code has expired' };
  }

  if (verification.code !== code) {
    return { valid: false, error: 'Invalid verification code' };
  }

  return { valid: true };
}
