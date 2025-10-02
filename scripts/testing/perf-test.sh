#!/bin/bash

# Performance Testing Script for School Website
# Usage: ./perf-test.sh [command]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to show usage
show_usage() {
    echo -e "${BLUE}⚡ Performance Testing Script for School Website${NC}"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo -e "  $0 [command]"
    echo ""
    echo -e "${YELLOW}Available Commands:${NC}"
    echo -e "  single    - Single request test to all environments"
    echo -e "  load      - Load test with multiple concurrent requests"
    echo -e "  stress    - Stress test with many concurrent requests"
    echo -e "  compare   - Compare performance between environments"
    echo -e "  monitor   - Monitor response times over time"
    echo -e "  help      - Show this help"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  $0 single   # Single request test"
    echo -e "  $0 load     # Load test (10 concurrent)"
    echo -e "  $0 stress   # Stress test (50 concurrent)"
    echo -e "  $0 compare  # Compare all environments"
}

# Function to test single requests
test_single() {
    echo -e "${BLUE}⚡ Single Request Performance Test${NC}"
    echo ""
    
    echo -e "${YELLOW}Development Environment:${NC}"
    curl -s -o /dev/null -w "Status: %{http_code}, Time: %{time_total}s, Size: %{size_download} bytes\n" http://localhost:8080/websekolah-dev/
    
    echo -e "${YELLOW}Staging Environment:${NC}"
    curl -s -o /dev/null -w "Status: %{http_code}, Time: %{time_total}s, Size: %{size_download} bytes\n" http://localhost:8080/websekolah-staging/
    
    echo -e "${YELLOW}Production Environment:${NC}"
    curl -s -o /dev/null -w "Status: %{http_code}, Time: %{time_total}s, Size: %{size_download} bytes\n" http://localhost:8080/websekolah/
    
    echo -e "${YELLOW}Direct Container Access:${NC}"
    curl -s -o /dev/null -w "Dev Direct: %{time_total}s\n" http://localhost:3001/
    curl -s -o /dev/null -w "Staging Direct: %{time_total}s\n" http://localhost:3002/
    curl -s -o /dev/null -w "Prod Direct: %{time_total}s\n" http://localhost:3003/
}

# Function to load test
test_load() {
    echo -e "${BLUE}⚡ Load Test (10 Concurrent Requests)${NC}"
    echo ""
    
    echo -e "${YELLOW}Testing Development Environment:${NC}"
    start_time=$(date +%s.%N)
    for i in {1..10}; do
        curl -s -o /dev/null -w "Request $i: %{time_total}s\n" http://localhost:8080/websekolah-dev/ &
    done
    wait
    end_time=$(date +%s.%N)
    duration=$(echo "$end_time - $start_time" | bc)
    echo -e "${GREEN}Total time for 10 requests: ${duration}s${NC}"
    
    echo -e "${YELLOW}Testing Staging Environment:${NC}"
    start_time=$(date +%s.%N)
    for i in {1..10}; do
        curl -s -o /dev/null -w "Request $i: %{time_total}s\n" http://localhost:8080/websekolah-staging/ &
    done
    wait
    end_time=$(date +%s.%N)
    duration=$(echo "$end_time - $start_time" | bc)
    echo -e "${GREEN}Total time for 10 requests: ${duration}s${NC}"
    
    echo -e "${YELLOW}Testing Production Environment:${NC}"
    start_time=$(date +%s.%N)
    for i in {1..10}; do
        curl -s -o /dev/null -w "Request $i: %{time_total}s\n" http://localhost:8080/websekolah/ &
    done
    wait
    end_time=$(date +%s.%N)
    duration=$(echo "$end_time - $start_time" | bc)
    echo -e "${GREEN}Total time for 10 requests: ${duration}s${NC}"
}

# Function to stress test
test_stress() {
    echo -e "${BLUE}⚡ Stress Test (50 Concurrent Requests)${NC}"
    echo ""
    
    echo -e "${YELLOW}Testing Development Environment:${NC}"
    start_time=$(date +%s.%N)
    for i in {1..50}; do
        curl -s -o /dev/null -w "Request $i: %{time_total}s\n" http://localhost:8080/websekolah-dev/ &
    done
    wait
    end_time=$(date +%s.%N)
    duration=$(echo "$end_time - $start_time" | bc)
    echo -e "${GREEN}Total time for 50 requests: ${duration}s${NC}"
    
    echo -e "${YELLOW}Testing Staging Environment:${NC}"
    start_time=$(date +%s.%N)
    for i in {1..50}; do
        curl -s -o /dev/null -w "Request $i: %{time_total}s\n" http://localhost:8080/websekolah-staging/ &
    done
    wait
    end_time=$(date +%s.%N)
    duration=$(echo "$end_time - $start_time" | bc)
    echo -e "${GREEN}Total time for 50 requests: ${duration}s${NC}"
    
    echo -e "${YELLOW}Testing Production Environment:${NC}"
    start_time=$(date +%s.%N)
    for i in {1..50}; do
        curl -s -o /dev/null -w "Request $i: %{time_total}s\n" http://localhost:8080/websekolah/ &
    done
    wait
    end_time=$(date +%s.%N)
    duration=$(echo "$end_time - $start_time" | bc)
    echo -e "${GREEN}Total time for 50 requests: ${duration}s${NC}"
}

# Function to compare environments
test_compare() {
    echo -e "${BLUE}⚡ Environment Performance Comparison${NC}"
    echo ""
    
    echo -e "${YELLOW}Running 5 requests to each environment...${NC}"
    
    # Development
    echo -e "${BLUE}Development Environment:${NC}"
    dev_times=()
    for i in {1..5}; do
        time=$(curl -s -o /dev/null -w "%{time_total}" http://localhost:8080/websekolah-dev/)
        dev_times+=($time)
        echo "Request $i: ${time}s"
    done
    
    # Staging
    echo -e "${BLUE}Staging Environment:${NC}"
    staging_times=()
    for i in {1..5}; do
        time=$(curl -s -o /dev/null -w "%{time_total}" http://localhost:8080/websekolah-staging/)
        staging_times+=($time)
        echo "Request $i: ${time}s"
    done
    
    # Production
    echo -e "${BLUE}Production Environment:${NC}"
    prod_times=()
    for i in {1..5}; do
        time=$(curl -s -o /dev/null -w "%{time_total}" http://localhost:8080/websekolah/)
        prod_times+=($time)
        echo "Request $i: ${time}s"
    done
    
    # Calculate averages
    dev_avg=$(printf '%s\n' "${dev_times[@]}" | awk '{sum+=$1} END {print sum/NR}')
    staging_avg=$(printf '%s\n' "${staging_times[@]}" | awk '{sum+=$1} END {print sum/NR}')
    prod_avg=$(printf '%s\n' "${prod_times[@]}" | awk '{sum+=$1} END {print sum/NR}')
    
    echo ""
    echo -e "${GREEN}📊 Performance Summary:${NC}"
    echo -e "Development Average: ${dev_avg}s"
    echo -e "Staging Average:     ${staging_avg}s"
    echo -e "Production Average:  ${prod_avg}s"
}

# Function to monitor over time
test_monitor() {
    echo -e "${BLUE}⚡ Response Time Monitoring (10 requests over 30 seconds)${NC}"
    echo ""
    
    for i in {1..10}; do
        echo -e "${YELLOW}Request $i:${NC}"
        curl -s -o /dev/null -w "Dev: %{time_total}s, Staging: " http://localhost:8080/websekolah-dev/
        curl -s -o /dev/null -w "%{time_total}s, Prod: " http://localhost:8080/websekolah-staging/
        curl -s -o /dev/null -w "%{time_total}s\n" http://localhost:8080/websekolah/
        sleep 3
    done
}

# Main execution
case "${1:-help}" in
    "single")
        test_single
        ;;
    "load")
        test_load
        ;;
    "stress")
        test_stress
        ;;
    "compare")
        test_compare
        ;;
    "monitor")
        test_monitor
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
