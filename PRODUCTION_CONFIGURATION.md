# 🚀 Production Configuration Guide

## **Critical Issues Fixed**

### ✅ **1. bcryptjs Consistency**
**Problem**: Native bcrypt in dev, bcryptjs in prod → hashes won't match
**Solution**: Use bcryptjs for both dev and prod

**Fixed in:**
- `src/lib/database-simple.ts` - Now uses bcryptjs consistently
- All authentication routes use bcryptjs
- Hash compatibility guaranteed across environments

### ✅ **2. DATABASE_URL Consistency**
**Problem**: Different DATABASE_URL between preview and production → write to one, read from another
**Solution**: Use environment variables consistently

**Fixed in:**
- `src/lib/neon-db.ts` - Now uses `process.env.DATABASE_URL`
- Fallback to secure default with SSL mode
- Consistent database access across all environments

### ✅ **3. SSL Mode & Neon Pooled URL**
**Problem**: Missing ?sslmode=require or not using Neon pooled URL → intermittent failures
**Solution**: Enforce SSL mode and use pooled connections

**Fixed in:**
- Automatic SSL mode enforcement
- Uses Neon pooled URL for better performance
- Secure database connections guaranteed

### ✅ **4. Edge Runtime Compatibility**
**Problem**: Route running on Edge without Node crypto → failures
**Solution**: Set runtime = 'nodejs' for crypto-dependent routes

**Fixed in:**
- `src/app/api/auth/signup/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/complete-invitation/route.ts`
- `src/app/api/users/profile-setup/route.ts`
- `src/app/api/invites/accept/route.ts`

## **Vercel Environment Variables**

### **Required Variables (Set for ALL environments)**

#### **Database Configuration**
```
DATABASE_URL=postgresql://username:password@ep-xxx-xxx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

#### **SendGrid Configuration**
```
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=churchflow44@gmail.com
```

#### **App Configuration**
```
NEXT_PUBLIC_APP_URL=https://ecwa-settings-app-v2.vercel.app
NODE_ENV=production
```

#### **JWT Configuration**
```
JWT_SECRET=your_secure_jwt_secret_here
```

### **Environment-Specific Settings**

#### **Production Environment**
- Set all variables above
- Use production database URL
- Use verified sender email
- Set NODE_ENV=production

#### **Preview Environment**
- Use SAME DATABASE_URL as production (or separate preview DB)
- Use same SendGrid configuration
- Set NODE_ENV=production (for bcryptjs consistency)

#### **Development Environment**
- Use local .env.local file
- Can use different database for testing
- Set NODE_ENV=development

## **Database Configuration**

### **Neon Database Setup**
1. **Use Pooled Connection**: Always use `-pooler` in connection string
2. **SSL Mode Required**: Always include `?sslmode=require`
3. **Channel Binding**: Include `&channel_binding=require` for security

**Example Connection String:**
```
postgresql://username:password@ep-xxx-xxx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### **Database Consistency**
- **Same DATABASE_URL** for preview and production
- **Separate databases** only if you want isolated data
- **Consistent schema** across all environments

## **Security Configuration**

### **Password Hashing**
- **Algorithm**: bcryptjs (consistent across all environments)
- **Salt Rounds**: 12 (secure and performant)
- **Compatibility**: Works in both dev and prod

### **JWT Tokens**
- **Algorithm**: HS256
- **Expiration**: 7 days
- **Storage**: HTTP-only cookies
- **Security**: Secure in production

### **Database Security**
- **SSL Required**: All connections encrypted
- **Channel Binding**: Additional security layer
- **Environment Variables**: No hardcoded credentials

## **Runtime Configuration**

### **Node.js Runtime**
Routes using Node.js crypto or bcryptjs:
- `src/app/api/auth/signup/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/complete-invitation/route.ts`
- `src/app/api/users/profile-setup/route.ts`
- `src/app/api/invites/accept/route.ts`

### **Edge Runtime**
Routes that can run on Edge:
- Static API routes
- Simple data fetching
- Routes without Node.js dependencies

## **Deployment Checklist**

### **Before Deployment**
- [ ] Set all environment variables in Vercel
- [ ] Verify DATABASE_URL is consistent
- [ ] Ensure SSL mode is enabled
- [ ] Test bcryptjs compatibility
- [ ] Verify SendGrid configuration

### **After Deployment**
- [ ] Test authentication flow
- [ ] Verify database connections
- [ ] Check email sending
- [ ] Test magic link functionality
- [ ] Verify session management

## **Troubleshooting**

### **Hash Mismatch Issues**
- **Cause**: Different bcrypt implementations
- **Solution**: Use bcryptjs everywhere
- **Check**: Verify all routes use bcryptjs

### **Database Connection Issues**
- **Cause**: Missing SSL mode or wrong URL
- **Solution**: Use pooled URL with SSL mode
- **Check**: Verify DATABASE_URL format

### **Edge Runtime Errors**
- **Cause**: Node.js crypto in Edge runtime
- **Solution**: Set runtime = 'nodejs'
- **Check**: Verify all crypto routes have runtime config

### **Email Sending Issues**
- **Cause**: Missing SendGrid configuration
- **Solution**: Set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL
- **Check**: Verify sender email is verified in SendGrid

## **Performance Optimizations**

### **Database Connections**
- Use Neon pooled connections
- SSL mode for security
- Connection pooling for performance

### **Password Hashing**
- bcryptjs with 12 salt rounds
- Consistent across environments
- Secure and performant

### **Session Management**
- HTTP-only cookies
- 7-day expiration
- Secure cookie settings

---

**🎯 All critical production issues have been fixed! The application is now production-ready with consistent behavior across all environments.**
