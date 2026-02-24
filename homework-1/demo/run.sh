#!/bin/bash

# Banking Transactions API - Run Script
# This script starts the NestJS application

echo "🏦 Banking Transactions API - Starting..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env file exists (optional)
if [ ! -f ".env" ]; then
    echo "ℹ️  No .env file found. Using default configuration."
    echo ""
fi

# Start the application
echo "🚀 Starting development server..."
echo "📍 Application will be available at: http://localhost:3000"
echo "📖 Swagger UI will be available at: http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run start:dev
