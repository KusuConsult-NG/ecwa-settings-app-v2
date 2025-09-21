#!/bin/bash

# Neon Branch Management Workflow Setup Script
# This script helps you set up the GitHub Actions workflow for Neon database branch management

echo "🚀 Setting up Neon Branch Management Workflow for ChurchFlow"
echo "=============================================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: This is not a git repository. Please run this script from the root of your git repository."
    exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI (gh) is not installed. You'll need to set up secrets and variables manually."
    echo "   Install GitHub CLI: https://cli.github.com/"
    echo ""
    echo "📋 Manual Setup Required:"
    echo "1. Go to your repository on GitHub"
    echo "2. Navigate to Settings → Secrets and variables → Actions"
    echo "3. Add these secrets:"
    echo "   - NEON_API_KEY: Your Neon API key"
    echo "4. Add these variables:"
    echo "   - NEON_PROJECT_ID: Your Neon project ID"
    echo ""
    echo "📚 See NEON_BRANCH_SETUP.md for detailed instructions"
    exit 0
fi

# Check if user is logged in to GitHub CLI
if ! gh auth status &> /dev/null; then
    echo "❌ Please log in to GitHub CLI first:"
    echo "   gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Get repository information
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo "📁 Repository: $REPO"
echo ""

# Check if workflow file exists
if [ ! -f ".github/workflows/neon-branch-management.yml" ]; then
    echo "❌ Workflow file not found. Please ensure .github/workflows/neon-branch-management.yml exists."
    exit 1
fi

echo "✅ Workflow file found"
echo ""

# Prompt for Neon credentials
echo "🔑 Please provide your Neon credentials:"
echo ""

read -p "Enter your Neon Project ID: " NEON_PROJECT_ID
if [ -z "$NEON_PROJECT_ID" ]; then
    echo "❌ Project ID cannot be empty"
    exit 1
fi

read -p "Enter your Neon API Key: " NEON_API_KEY
if [ -z "$NEON_API_KEY" ]; then
    echo "❌ API Key cannot be empty"
    exit 1
fi

echo ""
echo "🔧 Setting up GitHub repository secrets and variables..."

# Set the secret
echo "Setting NEON_API_KEY secret..."
if gh secret set NEON_API_KEY --body "$NEON_API_KEY" 2>/dev/null; then
    echo "✅ NEON_API_KEY secret set successfully"
else
    echo "❌ Failed to set NEON_API_KEY secret"
    exit 1
fi

# Set the variable
echo "Setting NEON_PROJECT_ID variable..."
if gh variable set NEON_PROJECT_ID --body "$NEON_PROJECT_ID" 2>/dev/null; then
    echo "✅ NEON_PROJECT_ID variable set successfully"
else
    echo "❌ Failed to set NEON_PROJECT_ID variable"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 What happens next:"
echo "1. The workflow will automatically run when you create a pull request"
echo "2. A new Neon branch will be created for each PR"
echo "3. The branch will be automatically deleted when the PR is closed"
echo "4. Branches expire after 14 days"
echo ""
echo "🔍 To monitor the workflow:"
echo "1. Go to your repository on GitHub"
echo "2. Click on the 'Actions' tab"
echo "3. Look for 'Create/Delete Branch for Pull Request' workflow"
echo ""
echo "📚 For more information, see NEON_BRANCH_SETUP.md"
echo ""
echo "✨ Your ChurchFlow project is now ready for automated database branch management!"

