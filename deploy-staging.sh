#!/bin/bash

# Staging Deployment Script for School Website
# Usage: ./deploy-staging.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting staging deployment...${NC}"

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

# Check if .env.staging file exists
if [ ! -f .env.staging ]; then
    echo -e "${YELLOW}⚠️  .env.staging file not found. Creating from template...${NC}"
    cp env.staging.example .env.staging
    echo -e "${GREEN}✅ .env.staging file created${NC}"
    echo -e "${RED}❌ Please edit .env.staging file with your configuration before running deployment again.${NC}"
    exit 1
fi

# Load environment variables
source .env.staging

# Validate required environment variables
if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ] || [ -z "$NEXTAUTH_SECRET" ]; then
    echo -e "${RED}❌ Missing required environment variables. Please check your .env.staging file.${NC}"
    echo -e "${YELLOW}Required variables: DOMAIN, EMAIL, NEXTAUTH_SECRET${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables validated${NC}"

# Create necessary directories
mkdir -p uploads logs backups

# Check if nginx-proxy is running
if ! docker ps | grep -q nginx-proxy; then
    echo -e "${YELLOW}⚠️  nginx-proxy is not running. Please start it first.${NC}"
    echo -e "${BLUE}📋 To start nginx-proxy, run:${NC}"
    echo "cd nginx-proxy && docker-compose up -d"
    exit 1
fi

echo -e "${GREEN}✅ nginx-proxy is running${NC}"

# Stop existing containers
echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
docker-compose -f docker-compose.staging.yml down || true

# Build the application
echo -e "${BLUE}🔨 Building application...${NC}"
docker-compose -f docker-compose.staging.yml build --no-cache

# Start the application
echo -e "${BLUE}🚀 Starting application...${NC}"
docker-compose -f docker-compose.staging.yml up -d

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
    docker-compose -f docker-compose.staging.yml logs school-website
    exit 1
fi

# Check SSL certificate
echo -e "${BLUE}🔍 Checking SSL certificate...${NC}"
if curl -I https://${DOMAIN} > /dev/null 2>&1; then
    echo -e "${GREEN}✅ SSL certificate is working${NC}"
else
    echo -e "${YELLOW}⚠️  SSL certificate may not be ready yet. Please wait a few minutes.${NC}"
fi

# Display deployment information
echo -e "${GREEN}🎉 Staging deployment completed successfully!${NC}"
echo -e "${BLUE}📋 Deployment Information:${NC}"
echo -e "  Domain: ${DOMAIN}"
echo -e "  Environment: Staging"
echo -e "  Container: school-website-staging"
echo -e "  Network: nginx-net"
echo -e "  Monitoring: http://localhost:9090"
echo ""
echo -e "${YELLOW}📋 Useful commands:${NC}"
echo -e "  View logs: docker-compose -f docker-compose.staging.yml logs -f school-website"
echo -e "  Check status: docker-compose -f docker-compose.staging.yml ps"
echo -e "  Restart: docker-compose -f docker-compose.staging.yml restart school-website"
echo -e "  Stop: docker-compose -f docker-compose.staging.yml down"
echo ""
echo -e "${GREEN}🌐 Your application should be available at: https://${DOMAIN}${NC}"
echo -e "${GREEN}📊 Monitoring is available at: http://localhost:9090${NC}"
