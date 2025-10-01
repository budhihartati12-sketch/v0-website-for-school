#!/bin/bash

# Development Deployment Script for School Website
# Usage: ./deploy-dev.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting development deployment...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if .env.dev file exists
if [ ! -f .env.dev ]; then
    echo -e "${YELLOW}⚠️  .env.dev file not found. Creating from template...${NC}"
    cp env.dev.example .env.dev
    echo -e "${GREEN}✅ .env.dev file created${NC}"
fi

# Load environment variables
source .env.dev

# Create necessary directories
mkdir -p uploads logs

# Stop existing containers
echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
docker-compose -f docker-compose.dev.yml down || true

# Build the application
echo -e "${BLUE}🔨 Building application...${NC}"
docker-compose -f docker-compose.dev.yml build

# Start the application
echo -e "${BLUE}🚀 Starting application...${NC}"
docker-compose -f docker-compose.dev.yml up -d

# Wait for application to start
echo -e "${BLUE}⏳ Waiting for application to start...${NC}"
sleep 15

# Check if application is healthy
echo -e "${BLUE}🔍 Checking application health...${NC}"
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is healthy${NC}"
else
    echo -e "${RED}❌ Application health check failed${NC}"
    echo -e "${YELLOW}📋 Application logs:${NC}"
    docker-compose -f docker-compose.dev.yml logs school-website
    exit 1
fi

# Display deployment information
echo -e "${GREEN}🎉 Development deployment completed successfully!${NC}"
echo -e "${BLUE}📋 Deployment Information:${NC}"
echo -e "  Environment: Development"
echo -e "  Container: school-website-dev"
echo -e "  Network: dev-network"
echo -e "  Application: http://localhost:3000"
echo -e "  pgAdmin: http://localhost:8080"
echo ""
echo -e "${YELLOW}📋 Useful commands:${NC}"
echo -e "  View logs: docker-compose -f docker-compose.dev.yml logs -f school-website"
echo -e "  Check status: docker-compose -f docker-compose.dev.yml ps"
echo -e "  Restart: docker-compose -f docker-compose.dev.yml restart school-website"
echo -e "  Stop: docker-compose -f docker-compose.dev.yml down"
echo ""
echo -e "${GREEN}🌐 Your application is available at: http://localhost:3000${NC}"
echo -e "${GREEN}🗄️  pgAdmin is available at: http://localhost:8080${NC}"
echo -e "${BLUE}📧 pgAdmin credentials: admin@localhost / admin${NC}"
