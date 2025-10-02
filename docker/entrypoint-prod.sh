#!/bin/sh

# Production startup script for School Website
# Detects package manager and runs appropriate start command

set -e

echo "🚀 Starting School Website Production Server..."

# Check for package manager lockfiles
if [ -f yarn.lock ]; then
    echo "📦 Detected Yarn - Starting with yarn start"
    exec yarn start
elif [ -f package-lock.json ]; then
    echo "📦 Detected npm - Starting with npm start"
    exec npm start
elif [ -f pnpm-lock.yaml ]; then
    echo "📦 Detected pnpm - Starting with pnpm start"
    exec pnpm start
else
    echo "❌ Error: No package manager lockfile found!"
    echo "Expected one of: yarn.lock, package-lock.json, or pnpm-lock.yaml"
    exit 1
fi
