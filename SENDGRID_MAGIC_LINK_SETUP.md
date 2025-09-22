# SendGrid Magic Link Invitation System Setup

## 🚀 Overview

This system implements a complete invitation flow using SendGrid with magic links and 6-digit codes:

1. **Create Team** → Invite members by email
2. **Send Email** with magic link + 6-digit code
3. **Verify Code** → Accept invite (consumes it)
4. **Redirect** to `/onboarding/profile` to set name & password
5. **Optional**: Start a session after onboarding

## 📧 SendGrid Configuration

### Step 1: Get SendGrid API Key

1. Go to [SendGrid Dashboard](https://app.sendgrid.com/)
2. Navigate to **Settings** → **API Keys**
3. Click **Create API Key**
4. Choose **Restricted Access** and give it **Mail Send** permissions
5. Copy the API key (starts with `SG.`)

### Step 2: Set Environment Variables

**For Local Development (.env.local):**
```bash
SENDGRID_API_KEY=your_sendgrid_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**For Production (Vercel):**
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `NEXT_PUBLIC_APP_URL`: Your production URL

## 🔗 Magic Link System

### How It Works

1. **Invitation Creation**: When creating an organization, leaders and members are invited
2. **Email Sent**: Each invitee receives an email with:
   - **Magic Link** (recommended): One-click verification
   - **6-digit Code**: Manual verification fallback
3. **Verification**: User clicks magic link OR enters 6-digit code
4. **Profile Setup**: User completes profile with name, phone, address, password
5. **Session Created**: User is logged in and redirected to dashboard

### API Endpoints

- `POST /api/org` - Create organization and send invitations
- `POST /api/verify-magic-link` - Verify magic link token
- `POST /api/verify-invite-code` - Verify 6-digit code
- `POST /api/complete-invitation` - Complete profile setup
- `POST /api/resend-invitation` - Resend invitation

### Pages

- `/verify-invite` - Verification page (handles both magic link and code)
- `/onboarding/profile` - Profile completion page (if using separate flow)

## 🎯 Usage Flow

### 1. Create Organization with Invitations

```typescript
// Example API call
const response = await fetch('/api/org', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'ECWA Church',
    type: 'GCC',
    email: 'church@ecwa.org',
    phone: '+2341234567890',
    address: '123 Church Street',
    leaders: [
      {
        firstName: 'John',
        surname: 'Doe',
        title: 'Pastor',
        email: 'pastor@ecwa.org',
        phone: '+2341234567891'
      }
    ],
    members: [
      {
        name: 'Jane Smith',
        email: 'jane@ecwa.org',
        role: 'member'
      }
    ]
  })
})
```

### 2. Email Template

The email includes:
- **Magic Link Button**: One-click verification
- **6-digit Code**: Manual verification
- **Organization Details**: Context about the invitation
- **Expiration Notice**: 24-hour validity

### 3. Verification Process

**Magic Link Flow:**
1. User clicks magic link in email
2. Automatically verified and redirected to profile setup
3. User completes profile and is logged in

**Code Flow:**
1. User visits verification page
2. Enters 6-digit code from email
3. Verified and redirected to profile setup
4. User completes profile and is logged in

## 🔧 Testing

### Test Email Sending

Visit: `https://your-app.vercel.app/test-email`

1. Enter recipient email
2. Click "Send Test Email"
3. Check inbox for magic link email

### Test Invitation Flow

1. Create an organization with members
2. Check console logs for magic links and codes
3. Test both magic link and code verification
4. Verify profile completion works

## 🛠️ Customization

### Email Template

Edit `src/lib/sendgrid-service.ts` to customize:
- Email design and branding
- Magic link button styling
- Code display format
- Organization-specific content

### Verification Page

Edit `src/app/verify-invite/page.tsx` to customize:
- UI/UX design
- Form fields
- Validation rules
- Redirect behavior

### Magic Link Store

Edit `src/lib/magic-link-store.ts` to customize:
- Invitation expiration time
- Code generation logic
- Storage mechanism (currently in-memory)

## 🔒 Security Features

- **24-hour expiration** for all invitations
- **One-time use** - invitations are consumed after verification
- **JWT tokens** for session management
- **HTTP-only cookies** for secure authentication
- **Email validation** and format checking
- **Password requirements** (minimum 6 characters)

## 🚨 Troubleshooting

### Common Issues

1. **Emails not sending**: Check SendGrid API key and permissions
2. **Magic links not working**: Verify `NEXT_PUBLIC_APP_URL` is set correctly
3. **Codes not verifying**: Check invitation hasn't expired or been used
4. **Profile completion fails**: Ensure all required fields are provided

### Debug Mode

Check console logs for:
- Magic link generation
- Email sending status
- Verification attempts
- Profile completion errors

## 📱 Mobile Support

The verification page is fully responsive and works on:
- Desktop browsers
- Mobile browsers
- Email clients with link support

## 🔄 Production Deployment

1. Set environment variables in Vercel
2. Verify SendGrid domain authentication
3. Test email delivery to real addresses
4. Monitor email sending limits and usage
5. Set up proper error handling and logging

## 📊 Monitoring

Monitor:
- Email delivery rates
- Magic link click rates
- Code verification success rates
- Profile completion rates
- System performance and errors

---

**Ready to use!** The system is now configured and ready for production use with SendGrid magic link invitations.
