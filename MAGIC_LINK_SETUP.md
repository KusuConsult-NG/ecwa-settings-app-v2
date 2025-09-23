# Magic Link Setup Guide

## Issue Fixed
The magic links were showing `@https://your-app-name.vercel.app` instead of the correct Vercel URL.

## Solution Implemented

### 1. Created URL Utility Functions
- **File**: `src/lib/url-utils.ts`
- **Purpose**: Centralized URL generation with proper environment handling
- **Features**:
  - Automatic Vercel URL detection
  - Fallback to production URL
  - Development environment support

### 2. Updated Magic Link Generation
- **Agencies Route**: `src/app/api/agencies/route.ts`
- **Executives Route**: `src/app/api/executives/route.ts`
- **Test SendGrid Route**: `src/app/api/test-sendgrid/route.ts`

### 3. Environment Variables Required

#### For Vercel Deployment:
```bash
NEXT_PUBLIC_APP_URL=https://ecwa-settings-app-v2.vercel.app
```

#### For Custom Domain:
```bash
NEXT_PUBLIC_APP_URL=https://your-custom-domain.com
```

#### For Development:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## How It Works

### URL Generation Priority:
1. **NEXT_PUBLIC_APP_URL** (if set)
2. **VERCEL_URL** (automatic Vercel detection)
3. **Production fallback** (`https://ecwa-settings-app-v2.vercel.app`)
4. **Development fallback** (`http://localhost:3000`)

### Magic Link Format:
```
https://ecwa-settings-app-v2.vercel.app/verify-invite?token=<magic_token>
```

### Verification Link Format:
```
https://ecwa-settings-app-v2.vercel.app/accept?email=<email>&code=<code>
```

## Testing Magic Links

### 1. Test SendGrid Email:
```bash
POST /api/test-sendgrid
{
  "email": "test@example.com"
}
```

### 2. Check Generated URLs:
- Magic links will now use the correct Vercel domain
- No more `@https://your-app-name.vercel.app` placeholder URLs
- Proper URL encoding for email parameters

## Deployment Checklist

- [ ] Set `NEXT_PUBLIC_APP_URL` in Vercel environment variables
- [ ] Verify magic links work in production
- [ ] Test email delivery with correct URLs
- [ ] Confirm verification flow works end-to-end

## Files Modified

1. `src/lib/url-utils.ts` - New utility functions
2. `src/app/api/agencies/route.ts` - Updated URL generation
3. `src/app/api/executives/route.ts` - Updated URL generation
4. `src/app/api/test-sendgrid/route.ts` - Updated URL generation

## Next Steps

1. **Set Environment Variable**: Add `NEXT_PUBLIC_APP_URL=https://ecwa-settings-app-v2.vercel.app` to Vercel
2. **Redeploy**: Push changes to trigger new deployment
3. **Test**: Send a test invitation to verify magic links work correctly
4. **Monitor**: Check email delivery and link functionality
