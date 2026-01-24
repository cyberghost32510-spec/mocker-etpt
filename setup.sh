#!/bin/bash

# Mocker - Entry Test Master Setup Script
# This script helps you set up and run Mocker locally

set -e

echo "╔════════════════════════════════════════════════╗"
echo "║  🚀 Mocker - Entry Test Master Setup Script   ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js installed: $NODE_VERSION"

# Check npm installation
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm installed: $NPM_VERSION"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║  Setup Complete! Ready to run Mocker          ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "🚀 To start development server, run:"
echo ""
echo "   npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
echo "🔨 Available commands:"
echo "   npm run dev     - Start development server"
echo "   npm run build   - Build for production"
echo "   npm start       - Start production server"
echo "   npm run lint    - Check code quality"
echo ""
echo "📚 Documentation:"
echo "   - README.md       - Project overview"
echo "   - DEPLOYMENT.md   - Deployment instructions"
echo ""
echo "Happy testing! 🎯"
