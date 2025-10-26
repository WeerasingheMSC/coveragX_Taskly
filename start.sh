#!/bin/bash
set -e

echo "🚀 Starting CoveragX Taskly deployment..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd Backend
npm ci --omit=dev

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../Frontend
npm ci

# Build frontend with TypeScript + Vite
echo "🏗️ Building frontend (TypeScript + Vite)..."
npm run build

# Copy frontend build to backend public folder (optional)
echo "📁 Frontend built successfully in Frontend/dist"

# Start the backend server
echo "🚀 Starting backend server on port ${PORT:-3000}..."
cd ../Backend
npm start