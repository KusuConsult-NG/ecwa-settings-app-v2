# 🚀 ChurchFlow Vercel Deployment Guide

This guide will help you deploy your ChurchFlow app to Vercel in just a few minutes!

## 📋 Prerequisites

- ✅ GitHub repository: `https://github.com/KusuConsult-NG/ecwa-settings-app-v2`
- ✅ Vercel account: [vercel.com](https://vercel.com)
- ✅ Code pushed to GitHub

## 🚀 Quick Deployment (5 minutes)

### Step 1: Connect to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"

2. **Import from GitHub**
   - Click "Import Git Repository"
   - Select `KusuConsult-NG/ecwa-settings-app-v2`
   - Click "Import"

### Step 2: Configure Project

1. **Project Settings**
   - **Project Name**: `churchflow-app` (or your preferred name)
   - **Framework Preset**: `Next.js` (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

2. **Environment Variables** (Optional for now)
   - Click "Environment Variables"
   - Add these if needed later:
     ```
     NODE_ENV=production
     NEXT_PUBLIC_APP_NAME=ChurchFlow
     ```

### Step 3: Deploy

1. **Click "Deploy"**
   - Vercel will automatically build and deploy your app
   - Wait 2-3 minutes for deployment to complete

2. **Get Your URL**
   - Your app will be available at: `https://churchflow-app.vercel.app`
   - You can customize the domain later

## 🎯 Deployment Options

### Option A: Automatic Deployment (Recommended)
- ✅ **Easiest**: Just connect GitHub and deploy
- ✅ **Auto-updates**: Every push to main branch auto-deploys
- ✅ **Free**: Perfect for development and small projects

### Option B: Manual Deployment
- Use Vercel CLI for more control
- Install: `npm i -g vercel`
- Deploy: `vercel --prod`

### Option C: Custom Domain
- Add your own domain in Vercel dashboard
- Update DNS settings as instructed
- SSL certificate auto-generated

## 🔧 Configuration Files

### vercel.json
```json
{
  "version": 2,
  "name": "churchflow-app",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Environment Variables
- Copy `env.example` to `.env.local` for local development
- Add production variables in Vercel dashboard

## 📊 Post-Deployment

### 1. Test Your App
- Visit your Vercel URL
- Test all pages and functionality
- Check mobile responsiveness

### 2. Set Up Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records as shown

### 3. Monitor Performance
- Check Vercel Analytics
- Monitor build logs
- Set up error tracking

## 🛠️ Troubleshooting

### Common Issues:

**❌ Build Fails**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

**❌ App Not Loading**
- Check environment variables
- Verify API routes are working
- Check browser console for errors

**❌ Slow Performance**
- Enable Vercel Edge Functions
- Optimize images and assets
- Check bundle size

### Getting Help:
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Vercel Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

## 🎉 Success!

Once deployed, your ChurchFlow app will be:
- ✅ **Live on the internet**
- ✅ **Auto-updating** on every push
- ✅ **Fast and reliable**
- ✅ **Mobile-friendly**
- ✅ **HTTPS enabled**

## 🔄 Next Steps

1. **Add Authentication** - Implement login/signup
2. **Add Database** - Connect to your preferred database
3. **Add Features** - Build out church management features
4. **Custom Domain** - Add your own domain name

---

**Need help?** Check the troubleshooting section or contact support! 🚀

