#!/bin/bash

# Enhanced Testing Environment Setup Script
# This script sets up a robust testing environment for School Website

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Setting up Testing Environment for School Website...${NC}"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is running${NC}"
}

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
TEST_DIR="$PROJECT_ROOT/docker/test"

# Function to cleanup existing containers
cleanup_containers() {
    echo -e "${YELLOW}🧹 Cleaning up existing containers...${NC}"
    cd "$TEST_DIR"
    
    # Stop development testing environment
    docker compose -f docker-compose.dev-test.yml down 2>/dev/null || true
    
    # Stop full testing environment
    docker compose -f docker-compose.test.yml down 2>/dev/null || true
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Function to setup development testing environment
setup_dev_testing() {
    echo -e "${BLUE}📦 Setting up Development Testing Environment...${NC}"
    cd "$TEST_DIR"
    
    # Build development testing containers
    echo -e "${YELLOW}🔨 Building development testing containers...${NC}"
    docker compose -f docker-compose.dev-test.yml build --no-cache
    
    # Start development testing environment
    echo -e "${YELLOW}🚀 Starting development testing environment...${NC}"
    docker compose -f docker-compose.dev-test.yml up -d
    
    # Wait for services to be ready
    echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
    sleep 15
    
    # Check if services are running
    echo -e "${BLUE}🔍 Checking service status...${NC}"
    docker compose -f docker-compose.dev-test.yml ps
    
    # Test endpoints
    echo -e "${BLUE}🧪 Testing endpoints...${NC}"
    
    # Test development environment
    echo -e "${YELLOW}Testing development environment...${NC}"
    if curl -f http://localhost:8080/websekolah-dev/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Development endpoint: http://localhost:8080/websekolah-dev/${NC}"
    else
        echo -e "${RED}❌ Development endpoint failed${NC}"
        echo -e "${YELLOW}📋 Container logs:${NC}"
        docker compose -f docker-compose.dev-test.yml logs school-website-dev-test --tail 10
        return 1
    fi
    
    # Test direct container access
    echo -e "${YELLOW}Testing direct container access...${NC}"
    if curl -f http://localhost:3001/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Direct container: http://localhost:3001/${NC}"
    else
        echo -e "${RED}❌ Direct container access failed${NC}"
        return 1
    fi
    
    # Test root path
    echo -e "${YELLOW}Testing root path...${NC}"
    if curl -f http://localhost:8080/ > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Root path: http://localhost:8080/${NC}"
    else
        echo -e "${RED}❌ Root path failed${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Development testing environment setup complete!${NC}"
}

# Function to setup full testing environment (optional)
setup_full_testing() {
    echo -e "${BLUE}📦 Setting up Full Testing Environment (Optional)...${NC}"
    cd "$TEST_DIR"
    
    # Build all containers
    echo -e "${YELLOW}🔨 Building all testing containers...${NC}"
    docker compose -f docker-compose.test.yml build --no-cache
    
    # Start testing environment
    echo -e "${YELLOW}🚀 Starting full testing environment...${NC}"
    docker compose -f docker-compose.test.yml up -d
    
    # Wait for services to be ready
    echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
    sleep 20
    
    # Check if services are running
    echo -e "${BLUE}🔍 Checking service status...${NC}"
    docker compose -f docker-compose.test.yml ps
    
    # Test endpoints
    echo -e "${BLUE}🧪 Testing endpoints...${NC}"
    
    # Test development environment
    echo -e "${YELLOW}Testing development environment...${NC}"
    curl -f http://localhost:8080/websekolah-dev/ > /dev/null 2>&1 && echo -e "${GREEN}✅ Development endpoint: http://localhost:8080/websekolah-dev/${NC}" || echo -e "${RED}❌ Development endpoint failed${NC}"
    
    # Test staging environment  
    echo -e "${YELLOW}Testing staging environment...${NC}"
    curl -f http://localhost:8080/websekolah-staging/ > /dev/null 2>&1 && echo -e "${GREEN}✅ Staging endpoint: http://localhost:8080/websekolah-staging/${NC}" || echo -e "${RED}❌ Staging endpoint failed${NC}"
    
    # Test production environment
    echo -e "${YELLOW}Testing production environment...${NC}"
    curl -f http://localhost:8080/websekolah/ > /dev/null 2>&1 && echo -e "${GREEN}✅ Production endpoint: http://localhost:8080/websekolah/${NC}" || echo -e "${RED}❌ Production endpoint failed${NC}"
    
    echo -e "${GREEN}✅ Full testing environment setup complete!${NC}"
}

# Function to display usage information
show_usage() {
    echo -e "${BLUE}📋 Usage Information:${NC}"
    echo ""
    echo -e "${GREEN}🌐 Access URLs:${NC}"
    echo -e "  Development: http://localhost:8080/websekolah-dev/"
    echo -e "  Direct App:  http://localhost:3001/"
    echo -e "  Root Path:   http://localhost:8080/"
    echo ""
    echo -e "${GREEN}📊 Container Status:${NC}"
    cd "$TEST_DIR"
    docker compose -f docker-compose.dev-test.yml ps
    echo ""
    echo -e "${GREEN}📝 Management Commands:${NC}"
    echo -e "  Stop:        cd docker/test && docker compose -f docker-compose.dev-test.yml down"
    echo -e "  Restart:     cd docker/test && docker compose -f docker-compose.dev-test.yml restart"
    echo -e "  Logs:        cd docker/test && docker compose -f docker-compose.dev-test.yml logs -f"
    echo -e "  Rebuild:     cd docker/test && docker compose -f docker-compose.dev-test.yml build --no-cache"
    echo ""
    echo -e "${GREEN}🔧 Troubleshooting:${NC}"
    echo -e "  Check logs:  docker logs school-website-dev-test"
    echo -e "  Check nginx: docker logs nginx-test-dev"
    echo -e "  Test config: docker exec nginx-test-dev nginx -t"
}

# Main execution
main() {
    # Check command line arguments
    case "${1:-dev}" in
        "dev"|"development")
            check_docker
            cleanup_containers
            setup_dev_testing
            show_usage
            ;;
        "full"|"all")
            check_docker
            cleanup_containers
            setup_dev_testing
            setup_full_testing
            show_usage
            ;;
        "cleanup"|"clean")
            cleanup_containers
            echo -e "${GREEN}✅ Cleanup completed${NC}"
            ;;
        "help"|"-h"|"--help")
            echo -e "${BLUE}Testing Environment Setup Script${NC}"
            echo ""
            echo -e "${YELLOW}Usage:${NC}"
            echo -e "  $0 [dev|full|cleanup|help]"
            echo ""
            echo -e "${YELLOW}Options:${NC}"
            echo -e "  dev      - Setup development testing environment (default)"
            echo -e "  full     - Setup full testing environment (all environments)"
            echo -e "  cleanup  - Clean up all testing containers"
            echo -e "  help     - Show this help message"
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            echo -e "${YELLOW}Use '$0 help' for usage information${NC}"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"