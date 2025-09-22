# 🔧 SendGrid Debug Guide

## **Issue: Magic Link Not Being Sent to Email**

### **Step 1: Test SendGrid Configuration**

Visit: `https://ecwa-settings-app-v2.vercel.app/test-sendgrid`

1. Enter your email address
2. Click "Test SendGrid"
3. Check the configuration status
4. Look at browser console for detailed logs

### **Step 2: Check Environment Variables**

**Required Variables:**
```bash
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@churchflow.com
NEXT_PUBLIC_APP_URL=https://ecwa-settings-app-v2.vercel.app
```

**In Vercel Dashboard:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the above variables for "Production" environment
4. Redeploy the project

### **Step 3: Check SendGrid Dashboard**

1. Go to [SendGrid Dashboard](https://app.sendgrid.com/)
2. Check "Activity" → "Email Activity"
3. Look for any failed sends or bounces
4. Check "Settings" → "Sender Authentication"
5. Verify your domain or single sender

### **Step 4: Common Issues & Solutions**

#### **Issue 1: No API Key Set**
**Symptoms:** "SendGrid API Key: Not set" in test page
**Solution:** Set `SENDGRID_API_KEY` in Vercel environment variables

#### **Issue 2: Unverified Sender**
**Symptoms:** Emails not delivered, SendGrid shows "Invalid Sender"
**Solution:** 
- Go to SendGrid → Settings → Sender Authentication
- Add and verify `noreply@churchflow.com` as a single sender
- Or verify your domain

#### **Issue 3: Rate Limiting**
**Symptoms:** Emails work sometimes but fail randomly
**Solution:** Check SendGrid account limits and upgrade if needed

#### **Issue 4: Email in Spam**
**Symptoms:** Emails sent but not received
**Solution:** 
- Check spam folder
- Add SPF/DKIM records for your domain
- Use a verified sender email

#### **Issue 5: Development Mode**
**Symptoms:** Emails only logged to console
**Solution:** Set `NODE_ENV=production` in Vercel

### **Step 5: Debug Logs**

**Check Console Logs:**
```bash
# In Vercel dashboard, go to Functions tab
# Look for logs like:
📧 INVITE EMAIL (Development Mode - SendGrid configured):
To: user@example.com
Subject: You're invited to join ChurchFlow
Auth Code: 123456
Magic Link: https://ecwa-settings-app-v2.vercel.app/verify-invite?token=xxx
Verification Link: https://ecwa-settings-app-v2.vercel.app/accept?email=xxx&code=123456
```

### **Step 6: Test Organization Creation**

1. Go to `/org/create`
2. Create an organization with members
3. Check console logs for email sending
4. Check SendGrid dashboard for email activity

### **Step 7: Verify Email Template**

The email should contain:
- **Magic Link Button** (blue) - One-click verification
- **6-digit Code** (yellow) - Manual verification
- **Organization Context** - Who invited you
- **Both links** should work

### **Step 8: Production Checklist**

- [ ] SendGrid API key set in Vercel
- [ ] Sender email verified in SendGrid
- [ ] NODE_ENV set to production
- [ ] NEXT_PUBLIC_APP_URL set to production URL
- [ ] Test email sent successfully
- [ ] Magic link works in email
- [ ] Code verification works
- [ ] Profile setup completes

### **Step 9: Alternative Testing**

If SendGrid still doesn't work:

1. **Use Test Page**: `/test-sendgrid` to debug
2. **Check Logs**: Look at Vercel function logs
3. **Try Different Email**: Test with Gmail, Yahoo, etc.
4. **Check SendGrid Account**: Verify account status and limits

### **Step 10: Quick Fix**

If you need emails working immediately:

1. Set these in Vercel environment variables:
   ```
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   SENDGRID_FROM_EMAIL=noreply@churchflow.com
   NODE_ENV=production
   ```

2. Redeploy the project

3. Test with `/test-sendgrid` page

---

**🎯 The most likely issue is missing environment variables in Vercel. Set them and redeploy!**
