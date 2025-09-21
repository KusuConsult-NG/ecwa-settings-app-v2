# Email Setup Guide for ChurchFlow

This guide helps you set up email functionality using SendGrid (same as the original ECWA app) for ChurchFlow.

## 🚀 **Quick Setup**

### **1. Get SendGrid API Key**
1. Go to [SendGrid](https://sendgrid.com) and sign up/login
2. Navigate to **Settings** → **API Keys**
3. Click **Create API Key**
4. Choose **Restricted Access** and give it **Mail Send** permissions
5. Copy the API key (starts with `SG.`)

### **2. Configure Environment Variables**
Add these to your `.env.local` file:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_actual_api_key_here
FROM_EMAIL=noreply@churchflow.com

# Optional: SMTP Fallback
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### **3. Verify Domain (Optional but Recommended)**
1. In SendGrid dashboard, go to **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Follow the DNS setup instructions
4. This improves email deliverability

## 📧 **Email Features Implemented**

### **✅ Account Verification**
- **Trigger**: When user signs up
- **Template**: Professional verification email with 6-digit code
- **Expiry**: 30 minutes
- **Action**: User must verify before full access

### **✅ Password Reset**
- **Trigger**: When user requests password reset
- **Template**: Secure reset email with verification code
- **Expiry**: 30 minutes
- **Action**: User can reset password with code

### **✅ Welcome Email**
- **Trigger**: After successful account verification
- **Template**: Welcome message with dashboard link
- **Action**: Guides user to get started

## 🔧 **API Endpoints**

### **Email Verification**
```bash
POST /api/auth/verify-email
{
  "email": "user@example.com",
  "code": "123456"
}
```

### **Resend Verification**
```bash
POST /api/auth/resend-verification
{
  "email": "user@example.com"
}
```

## 🎨 **Email Templates**

### **Account Verification Template**
- **Subject**: "ChurchFlow - Verify Your Account"
- **Design**: Professional with ChurchFlow branding
- **Features**: 6-digit code, expiry notice, next steps
- **Colors**: ChurchFlow blue (#0E4DA4)

### **Password Reset Template**
- **Subject**: "ChurchFlow - Reset Your Password"
- **Design**: Security-focused with red accent
- **Features**: 6-digit code, security notice, instructions
- **Colors**: Red gradient for urgency

### **Welcome Template**
- **Subject**: "Welcome to ChurchFlow - Get Started!"
- **Design**: Celebratory with green accent
- **Features**: Dashboard link, feature overview, next steps
- **Colors**: Success green for celebration

## 🧪 **Testing Email Functionality**

### **1. Test with Console Provider (Development)**
```bash
# Emails will be logged to console instead of sent
# Check your terminal/console for email output
```

### **2. Test with SendGrid (Production)**
```bash
# Set SENDGRID_API_KEY in .env.local
# Sign up for a new account
# Check your email for verification code
```

### **3. Test Email Verification Flow**
1. Go to `/signup`
2. Create a new account
3. Check email for verification code
4. Go to `/verify-email`
5. Enter the code
6. Verify successful verification

## 🔍 **Troubleshooting**

### **Common Issues**

**Emails not sending:**
- Check `SENDGRID_API_KEY` is set correctly
- Verify API key has Mail Send permissions
- Check SendGrid account is not suspended
- Look at console logs for error messages

**Verification codes not working:**
- Check code hasn't expired (30 minutes)
- Ensure code is exactly 6 digits
- Verify email matches the one used for signup
- Check if code was already used

**SMTP fallback not working:**
- Verify SMTP credentials are correct
- Check if 2FA is enabled (use app password)
- Ensure SMTP server allows connections
- Check firewall/network restrictions

### **Debug Steps**

1. **Check Environment Variables:**
   ```bash
   echo $SENDGRID_API_KEY
   echo $FROM_EMAIL
   ```

2. **Test SendGrid API:**
   ```bash
   curl -X POST "https://api.sendgrid.com/v3/mail/send" \
     -H "Authorization: Bearer $SENDGRID_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"personalizations":[{"to":[{"email":"test@example.com"}]}],"from":{"email":"noreply@churchflow.com"},"subject":"Test","content":[{"type":"text/plain","value":"Test email"}]}'
   ```

3. **Check Application Logs:**
   - Look for "📧 Email service initialized" message
   - Check for "✅ Email sent via SendGrid" confirmations
   - Look for error messages in console

## 📊 **Email Analytics (SendGrid)**

### **Track Email Performance**
1. Go to SendGrid dashboard
2. Navigate to **Activity** → **Email Activity**
3. View delivery rates, opens, clicks
4. Monitor bounce rates and spam reports

### **Improve Deliverability**
- Set up domain authentication
- Use consistent sender email
- Avoid spam trigger words
- Monitor reputation score

## 🔒 **Security Best Practices**

### **API Key Security**
- Never commit API keys to version control
- Use environment variables only
- Rotate keys regularly
- Use restricted access keys

### **Email Security**
- Verify sender domains
- Use HTTPS for all requests
- Implement rate limiting
- Monitor for abuse

## 🚀 **Production Deployment**

### **Vercel Environment Variables**
1. Go to Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `FROM_EMAIL`: noreply@churchflow.com
   - `NEXT_PUBLIC_APP_URL`: Your production URL

### **Domain Setup**
1. Set up custom domain in Vercel
2. Configure DNS records
3. Update `FROM_EMAIL` to use your domain
4. Set up SPF/DKIM records for better deliverability

## 📚 **Additional Resources**

- [SendGrid Documentation](https://docs.sendgrid.com/)
- [SendGrid API Reference](https://docs.sendgrid.com/api-reference/)
- [Email Deliverability Guide](https://sendgrid.com/blog/email-deliverability-guide/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## ✅ **Verification Checklist**

- [ ] SendGrid account created
- [ ] API key generated and configured
- [ ] Environment variables set
- [ ] Test email sent successfully
- [ ] Account verification flow working
- [ ] Password reset flow working
- [ ] Welcome email working
- [ ] Production deployment configured

**Your ChurchFlow email system is now ready!** 🎉

The same SendGrid setup from the original ECWA app is now fully integrated into ChurchFlow with enhanced templates and improved user experience.
