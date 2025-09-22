# Gmail Email Setup Guide

## Quick Setup (5 minutes)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **Security** in the left sidebar
3. Under **Signing in to Google**, click **2-Step Verification**
4. Follow the prompts to enable 2FA

### Step 2: Generate App Password
1. Still in **Security** settings
2. Under **Signing in to Google**, click **App passwords**
3. Select **Mail** as the app
4. Select **Other (Custom name)** as the device
5. Enter "ChurchFlow" as the name
6. Click **Generate**
7. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### Step 3: Update Environment Variables
1. Open `.env.local` file
2. Add these lines:
```bash
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
```

### Step 4: Test Email Sending
1. Restart your development server
2. Try creating an organization with leaders/members
3. Check your Gmail inbox for the invitation emails

## Important Notes

- **Use your regular Gmail address** for `GMAIL_USER`
- **Use the App Password** (not your regular password) for `GMAIL_APP_PASSWORD`
- **App passwords are 16 characters** with spaces (remove spaces when entering)
- **Emails will be sent from your Gmail address**

## Troubleshooting

### "Invalid login" error
- Make sure 2FA is enabled
- Make sure you're using the App Password, not your regular password
- Check that the App Password is correct (16 characters)

### "Less secure app access" error
- This shouldn't happen with App Passwords
- Make sure you're using App Password, not regular password

### Emails not sending
- Check the console logs for error messages
- Verify the environment variables are set correctly
- Make sure the Gmail account is active

## Security

- **App passwords are safer** than regular passwords
- **You can revoke App passwords** anytime from Google Account settings
- **Each app gets its own password** - if compromised, only that app is affected
