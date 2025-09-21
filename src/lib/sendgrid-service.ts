import sgMail from '@sendgrid/mail'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export interface InviteEmailData {
  to: string
  name: string
  authCode: string
  organizationName: string
  inviterName: string
}

export interface WelcomeEmailData {
  to: string
  name: string
  organizationName: string
  loginUrl: string
}

export async function sendInviteEmail(data: InviteEmailData): Promise<boolean> {
  try {
    // If no SendGrid API key, log to console for development
    if (!process.env.SENDGRID_API_KEY) {
      console.log('📧 INVITE EMAIL (Development Mode):')
      console.log('To:', data.to)
      console.log('Subject: You\'re invited to join ChurchFlow')
      console.log('Auth Code:', data.authCode)
      console.log('Organization:', data.organizationName)
      console.log('Inviter:', data.inviterName)
      return true
    }

    const msg = {
      to: data.to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@churchflow.com',
        name: 'ChurchFlow Team'
      },
      subject: `You're invited to join ${data.organizationName} on ChurchFlow`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invitation to ChurchFlow</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4f46e5; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .auth-code { background: #1f2937; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏛️ ChurchFlow</h1>
              <p>Church Management System</p>
            </div>
            <div class="content">
              <h2>Hello ${data.name}!</h2>
              <p>You've been invited by <strong>${data.inviterName}</strong> to join <strong>${data.organizationName}</strong> on ChurchFlow.</p>
              
              <p>To complete your registration and access your account, please use the authentication code below:</p>
              
              <div class="auth-code">
                ${data.authCode}
              </div>
              
              <p>This code will expire in 24 hours for security reasons.</p>
              
              <p>Once you've entered the code, you'll be able to:</p>
              <ul>
                <li>Complete your profile setup</li>
                <li>Access your organization's dashboard</li>
                <li>Manage church operations and members</li>
                <li>View reports and analytics</li>
              </ul>
              
              <p>If you have any questions, please contact your organization administrator.</p>
              
              <p>Welcome to ChurchFlow!</p>
              
              <div class="footer">
                <p>This email was sent by ChurchFlow. If you didn't expect this invitation, please ignore this email.</p>
                <p>© 2024 ChurchFlow. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hello ${data.name}!
        
        You've been invited by ${data.inviterName} to join ${data.organizationName} on ChurchFlow.
        
        Your authentication code is: ${data.authCode}
        
        This code will expire in 24 hours for security reasons.
        
        Once you've entered the code, you'll be able to complete your profile setup and access your organization's dashboard.
        
        If you have any questions, please contact your organization administrator.
        
        Welcome to ChurchFlow!
      `
    }

    await sgMail.send(msg)
    console.log('📧 Invite email sent successfully to:', data.to)
    return true
  } catch (error) {
    console.error('❌ Error sending invite email:', error)
    return false
  }
}

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  try {
    // If no SendGrid API key, log to console for development
    if (!process.env.SENDGRID_API_KEY) {
      console.log('📧 WELCOME EMAIL (Development Mode):')
      console.log('To:', data.to)
      console.log('Subject: Welcome to ChurchFlow!')
      console.log('Name:', data.name)
      console.log('Organization:', data.organizationName)
      console.log('Login URL:', data.loginUrl)
      return true
    }

    const msg = {
      to: data.to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@churchflow.com',
        name: 'ChurchFlow Team'
      },
      subject: `Welcome to ${data.organizationName} on ChurchFlow!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ChurchFlow</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to ChurchFlow!</h1>
              <p>Your account is now active</p>
            </div>
            <div class="content">
              <h2>Hello ${data.name}!</h2>
              <p>Welcome to <strong>${data.organizationName}</strong> on ChurchFlow! Your account has been successfully created and is ready to use.</p>
              
              <p>You can now access your dashboard and start managing your church operations:</p>
              
              <a href="${data.loginUrl}" class="button">Access Your Dashboard</a>
              
              <p>With ChurchFlow, you can:</p>
              <ul>
                <li>Manage member information and communications</li>
                <li>Track financial records and generate reports</li>
                <li>Organize events and manage attendance</li>
                <li>Coordinate volunteer activities</li>
                <li>Access real-time analytics and insights</li>
              </ul>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact your organization administrator.</p>
              
              <p>Thank you for choosing ChurchFlow!</p>
              
              <div class="footer">
                <p>This email was sent by ChurchFlow.</p>
                <p>© 2024 ChurchFlow. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hello ${data.name}!
        
        Welcome to ${data.organizationName} on ChurchFlow! Your account has been successfully created and is ready to use.
        
        You can now access your dashboard at: ${data.loginUrl}
        
        With ChurchFlow, you can manage member information, track financial records, organize events, coordinate volunteer activities, and access real-time analytics.
        
        If you have any questions or need assistance, please don't hesitate to contact your organization administrator.
        
        Thank you for choosing ChurchFlow!
      `
    }

    await sgMail.send(msg)
    console.log('📧 Welcome email sent successfully to:', data.to)
    return true
  } catch (error) {
    console.error('❌ Error sending welcome email:', error)
    return false
  }
}

export function generateAuthCode(): string {
  // Generate a 6-digit random code
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function isAuthCodeValid(code: string, sentAt: Date): boolean {
  // Check if code is 6 digits and not expired (24 hours)
  const now = new Date()
  const hoursDiff = (now.getTime() - sentAt.getTime()) / (1000 * 60 * 60)
  return /^\d{6}$/.test(code) && hoursDiff < 24
}
