#!/bin/bash

# Deployment Script for School Website
# Usage: ./deploy.sh [environment]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT=${1:-production}

echo -e "${BLUE}🚀 Starting deployment for environment: ${ENVIRONMENT}${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if nginx-net network exists
if ! docker network ls | grep -q nginx-net; then
    echo -e "${YELLOW}⚠️  nginx-net network not found. Creating it...${NC}"
    docker network create nginx-net
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Copying from docker.env.example...${NC}"
    cp docker.env.example .env
    echo -e "${RED}❌ Please edit .env file with your configuration before running deployment again.${NC}"
    exit 1
fi

# Load environment variables
source .env

# Validate required environment variables
if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ] || [ -z "$NEXTAUTH_SECRET" ]; then
    echo -e "${RED}❌ Missing required environment variables. Please check your .env file.${NC}"
    echo -e "${YELLOW}Required variables: DOMAIN, EMAIL, NEXTAUTH_SECRET${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables validated${NC}"

# Create necessary directories
mkdir -p uploads logs

# Stop existing containers
echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
docker-compose down || true

# Build the application
echo -e "${BLUE}🔨 Building application...${NC}"
docker-compose build --no-cache

# Start the application
echo -e "${BLUE}🚀 Starting application...${NC}"
docker-compose up -d

# Wait for application to start
echo -e "${BLUE}⏳ Waiting for application to start...${NC}"
sleep 30

# Check if application is healthy
echo -e "${BLUE}🔍 Checking application health...${NC}"
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is healthy${NC}"
else
    echo -e "${RED}❌ Application health check failed${NC}"
    echo -e "${YELLOW}📋 Application logs:${NC}"
    docker-compose logs school-website
    exit 1
fi

# Check nginx-proxy configuration
echo -e "${BLUE}🔍 Checking nginx-proxy configuration...${NC}"
if docker ps | grep -q nginx-proxy; then
    echo -e "${GREEN}✅ nginx-proxy is running${NC}"
else
    echo -e "${YELLOW}⚠️  nginx-proxy is not running. Please start it first.${NC}"
fi

# Display deployment information
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}📋 Deployment Information:${NC}"
echo -e "  Domain: ${DOMAIN}"
echo -e "  Environment: ${ENVIRONMENT}"
echo -e "  Container: school-website"
echo -e "  Network: nginx-net"
echo ""
echo -e "${YELLOW}📋 Useful commands:${NC}"
echo -e "  View logs: docker-compose logs -f school-website"
echo -e "  Check status: docker-compose ps"
echo -e "  Restart: docker-compose restart school-website"
echo -e "  Stop: docker-compose down"
echo ""
echo -e "${GREEN}🌐 Your application should be available at: https://${DOMAIN}${NC}"
