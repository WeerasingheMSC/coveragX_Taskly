#!/bin/sh
set -e

echo "🚀 Starting CoveragX Taskly deployment..."

# Check if node is available
if ! command -v node > /dev/null 2>&1; then
    echo "❌ Node.js not found!"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Start backend (dependencies should already be installed)
echo "🚀 Starting backend server on port ${PORT:-3000}..."
cd Backend
exec npm start