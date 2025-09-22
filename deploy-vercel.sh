#!/bin/bash

# ChurchFlow Vercel Deployment Script
# This script helps you deploy to Vercel quickly

echo "🚀 ChurchFlow Vercel Deployment Script"
echo "======================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    bun add -g vercel
    echo "✅ Vercel CLI installed"
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."
bun install

echo "🔨 Building the project..."
bun run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Deploying to Vercel..."
    bunx vercel --prod --yes
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Deployment successful!"
        echo "Your ChurchFlow app is now live on Vercel!"
        echo ""
        echo "Next steps:"
        echo "1. Visit your Vercel dashboard to see your app"
        echo "2. Set up custom domain if needed"
        echo "3. Configure environment variables"
        echo "4. Test all functionality"
    else
        echo "❌ Deployment failed. Check the error messages above."
        exit 1
    fi
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

