#!/bin/bash

# PostgreSQL Installation Script for macOS
# This script installs PostgreSQL client tools to connect to Neon database

echo "🐘 Installing PostgreSQL Client for Neon Database Connection"
echo "============================================================="

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script is designed for macOS. Please install PostgreSQL manually for your OS."
    exit 1
fi

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew first..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

echo "✅ Homebrew is installed"

# Install PostgreSQL
echo "📦 Installing PostgreSQL client..."
brew install postgresql

# Add PostgreSQL to PATH
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
export PATH="/opt/homebrew/bin:$PATH"

echo ""
echo "✅ PostgreSQL client installed successfully!"
echo ""
echo "🔗 You can now connect to your Neon database:"
echo "psql 'postgresql://neondb_owner:npg_8iVZwHmaxgy7@ep-old-truth-admsvs0a-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'"
echo ""
echo "📚 For more connection options, see NEON_BRANCH_SETUP.md"

