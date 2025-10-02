#!/bin/bash

# Quick Testing Commands for School Website
# Usage: ./quick-test.sh [command]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to show usage
show_usage() {
    echo -e "${BLUE}🚀 Quick Testing Commands for School Website${NC}"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo -e "  $0 [command]"
    echo ""
    echo -e "${YELLOW}Available Commands:${NC}"
    echo -e "  dev       - Start development testing environment"
    echo -e "  full      - Start full testing environment (dev + staging + prod)"
    echo -e "  stop      - Stop all testing environments"
    echo -e "  status    - Check container status"
    echo -e "  test      - Test all endpoints"
    echo -e "  logs      - Show logs for all containers"
    echo -e "  cleanup   - Clean up all testing containers"
    echo -e "  help      - Show this help"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  $0 dev     # Start development testing"
    echo -e "  $0 test    # Test all endpoints"
    echo -e "  $0 status  # Check container status"
}

# Function to start development testing
start_dev() {
    echo -e "${BLUE}🚀 Starting Development Testing Environment...${NC}"
    ./scripts/test/setup-test-env.sh dev
}

# Function to start full testing
start_full() {
    echo -e "${BLUE}🚀 Starting Full Testing Environment...${NC}"
    ./scripts/test/setup-test-env.sh full
}

# Function to stop environments
stop_env() {
    echo -e "${YELLOW}🛑 Stopping Testing Environments...${NC}"
    cd docker/test
    docker compose -f docker-compose.dev-test.yml down 2>/dev/null || true
    docker compose -f docker-compose.test.yml down 2>/dev/null || true
    echo -e "${GREEN}✅ All testing environments stopped${NC}"
}

# Function to check status
check_status() {
    echo -e "${BLUE}📊 Container Status:${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(nginx-test|school-website.*-test)" || echo "No testing containers running"
}

# Function to test endpoints
test_endpoints() {
    echo -e "${BLUE}🧪 Testing All Endpoints:${NC}"
    
    # Test development
    echo -e "${YELLOW}Testing Development Environment:${NC}"
    if curl -f http://localhost:8080/websekolah-dev/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Development: http://localhost:8080/websekolah-dev/${NC}"
    else
        echo -e "${RED}❌ Development endpoint failed${NC}"
    fi
    
    # Test staging
    echo -e "${YELLOW}Testing Staging Environment:${NC}"
    if curl -f http://localhost:8080/websekolah-staging/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Staging: http://localhost:8080/websekolah-staging/${NC}"
    else
        echo -e "${RED}❌ Staging endpoint failed${NC}"
    fi
    
    # Test production
    echo -e "${YELLOW}Testing Production Environment:${NC}"
    if curl -f http://localhost:8080/websekolah/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Production: http://localhost:8080/websekolah/${NC}"
    else
        echo -e "${RED}❌ Production endpoint failed${NC}"
    fi
    
    # Test direct containers
    echo -e "${YELLOW}Testing Direct Container Access:${NC}"
    curl -f http://localhost:3001/ > /dev/null 2>&1 && echo -e "${GREEN}✅ Dev Container: http://localhost:3001/${NC}" || echo -e "${RED}❌ Dev container failed${NC}"
    curl -f http://localhost:3002/ > /dev/null 2>&1 && echo -e "${GREEN}✅ Staging Container: http://localhost:3002/${NC}" || echo -e "${RED}❌ Staging container failed${NC}"
    curl -f http://localhost:3003/ > /dev/null 2>&1 && echo -e "${GREEN}✅ Prod Container: http://localhost:3003/${NC}" || echo -e "${RED}❌ Prod container failed${NC}"
}

# Function to show logs
show_logs() {
    echo -e "${BLUE}📝 Container Logs:${NC}"
    echo -e "${YELLOW}Nginx Logs:${NC}"
    docker logs nginx-test --tail 5 2>/dev/null || echo "Nginx container not running"
    
    echo -e "${YELLOW}Development Container Logs:${NC}"
    docker logs school-website-dev-test --tail 5 2>/dev/null || echo "Dev container not running"
    
    echo -e "${YELLOW}Staging Container Logs:${NC}"
    docker logs school-website-staging-test --tail 5 2>/dev/null || echo "Staging container not running"
    
    echo -e "${YELLOW}Production Container Logs:${NC}"
    docker logs school-website-prod-test --tail 5 2>/dev/null || echo "Prod container not running"
}

# Function to cleanup
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up all testing containers...${NC}"
    ./scripts/test/setup-test-env.sh cleanup
}

# Main execution
case "${1:-help}" in
    "dev")
        start_dev
        ;;
    "full")
        start_full
        ;;
    "stop")
        stop_env
        ;;
    "status")
        check_status
        ;;
    "test")
        test_endpoints
        ;;
    "logs")
        show_logs
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo -e "${YELLOW}Use '$0 help' for available commands${NC}"
        exit 1
        ;;
esac
