#!/bin/bash

# 🚀 Mocker - One-Click Deployment Script
# This script automates deployment to Vercel

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🚀 Mocker - Entry Test Master Deployment Helper       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial Mocker - Entry Test Master release"
fi

echo "✅ Git repository ready"
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "Deployment Options:"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "1️⃣  Deploy directly to Vercel (Fastest)"
echo "2️⃣  Push to GitHub first, then deploy"
echo "3️⃣  View deployment instructions"
echo "4️⃣  Exit"
echo ""
read -p "Select option (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to Vercel..."
        echo ""
        vercel
        echo ""
        echo "✅ Deployment complete!"
        echo "Check your Vercel dashboard for live URL"
        ;;
    2)
        echo ""
        echo "📤 Push to GitHub (optional, for CI/CD)"
        echo ""
        echo "Commands to run:"
        echo "  git remote add origin https://github.com/USERNAME/mocker.git"
        echo "  git branch -M main"
        echo "  git push -u origin main"
        echo ""
        read -p "Continue with GitHub setup? (y/n): " github_choice
        if [ "$github_choice" = "y" ]; then
            read -p "Enter GitHub repository URL: " repo_url
            git remote add origin "$repo_url"
            git branch -M main
            git push -u origin main
            echo "✅ Pushed to GitHub!"
            echo ""
            echo "Next: Go to vercel.com and connect your GitHub repo"
        fi
        ;;
    3)
        echo ""
        echo "📖 Deployment Instructions:"
        echo ""
        cat DEPLOYMENT.md
        ;;
    4)
        echo "Goodbye! 👋"
        exit 0
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "🎉 You're all set!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📚 Quick Links:"
echo "   • Check status: https://vercel.com/dashboard"
echo "   • View docs: cat QUICKSTART.md"
echo "   • Read more: cat README.md"
echo ""
echo "💡 Tips:"
echo "   • Custom domain: Add in Vercel Settings → Domains"
echo "   • Environment vars: Add in Vercel Settings → Environment"
echo "   • Monitor performance: Vercel Analytics dashboard"
echo ""
