#!/bin/bash

# Image Upload and Search Application Setup Script
# This script helps you set up the development environment quickly

echo "🚀 Setting up Image Upload and Search Application..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found. Make sure you're in the right directory."
    exit 1
fi

echo "   Installing backend dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "   Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please configure your AWS credentials in backend/.env"
else
    echo "   .env file already exists"
fi

echo "✅ Backend setup complete"

# Setup Frontend
echo ""
echo "🎨 Setting up Frontend..."
cd ../frontend

if [ ! -f "package.json" ]; then
    echo "❌ Frontend package.json not found. Make sure you're in the right directory."
    exit 1
fi

echo "   Installing frontend dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "   Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please configure your API URL in frontend/.env"
else
    echo "   .env file already exists"
fi

echo "✅ Frontend setup complete"

# Back to root
cd ..

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Configure AWS S3 credentials in backend/.env"
echo "2. Update API URL in frontend/.env"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. Start the frontend: cd frontend && npm start"
echo ""
echo "📚 For detailed setup instructions, see:"
echo "   - backend/README.md"
echo "   - frontend/README.md"
echo "   - DEPLOYMENT.md"
echo ""
echo "🔗 Useful commands:"
echo "   Backend dev server: cd backend && npm run dev"
echo "   Frontend dev server: cd frontend && npm start"
echo "   Backend tests: cd backend && npm test"
echo "   Frontend tests: cd frontend && npm test"
echo ""
echo "Happy coding! 🚀"