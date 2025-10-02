#!/bin/bash

# Testing Environment Setup Script
# This script sets up a complete testing environment for School Website

set -e

echo "🧪 Setting up Testing Environment for School Website..."

# Create test directory if it doesn't exist
mkdir -p docker/test

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start testing environment
echo "📦 Building testing containers..."
cd docker/test

# Build all containers
docker compose -f docker-compose.test.yml build

# Start testing environment
echo "🚀 Starting testing environment..."
docker compose -f docker-compose.test.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker compose -f docker-compose.test.yml ps

# Test endpoints
echo "🧪 Testing endpoints..."

# Test development environment
echo "Testing development environment..."
curl -f http://localhost:8080/websekolah-dev/ || echo "❌ Development endpoint failed"

# Test staging environment  
echo "Testing staging environment..."
curl -f http://localhost:8080/websekolah-staging/ || echo "❌ Staging endpoint failed"

# Test production environment
echo "Testing production environment..."
curl -f http://localhost:8080/websekolah/ || echo "❌ Production endpoint failed"

echo "✅ Testing environment setup complete!"
echo ""
echo "🌐 Access URLs:"
echo "  Development: http://localhost:8080/websekolah-dev"
echo "  Staging:     http://localhost:8080/websekolah-staging"
echo "  Production:  http://localhost:8080/websekolah"
echo ""
echo "📊 Container Status:"
docker compose -f docker-compose.test.yml ps
echo ""
echo "📝 To stop testing environment:"
echo "  cd docker/test && docker compose -f docker-compose.test.yml down"
echo ""
echo "📝 To view logs:"
echo "  docker compose -f docker-compose.test.yml logs -f"
