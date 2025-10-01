# Maintenance & Updates Guide

## 🔧 Overview

Panduan lengkap untuk maintenance dan updates untuk aplikasi website sekolah dengan Docker.

## 📋 Prerequisites

- Docker dan Docker Compose terinstall
- nginx-proxy sudah berjalan
- nginx-net network sudah dibuat
- Basic understanding of maintenance concepts

## 🏗️ Maintenance Architecture

```
school-website → maintenance-scripts → monitoring
        ↓
    nginx-net network
```

## 🐳 Maintenance Setup

### 1. Maintenance Docker Compose

```yaml
# docker-compose.maintenance.yml
version: '3.8'

services:
  maintenance-manager:
    image: alpine:latest
    container_name: school-maintenance-manager
    restart: unless-stopped
    volumes:
      - ./maintenance-scripts:/scripts
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./logs:/logs
    networks:
      - nginx-net
    environment:
      - MAINTENANCE_SCHEDULE=0 3 * * *
      - LOG_RETENTION_DAYS=30
      - BACKUP_RETENTION_DAYS=30
      - UPDATE_CHECK_SCHEDULE=0 2 * * 0
    command: /scripts/maintenance-manager.sh

  log-rotator:
    image: alpine:latest
    container_name: school-log-rotator
    restart: unless-stopped
    volumes:
      - ./logs:/logs
      - ./logrotate.conf:/etc/logrotate.conf
    networks:
      - nginx-net
    command: /scripts/log-rotator.sh

  update-checker:
    image: alpine:latest
    container_name: school-update-checker
    restart: unless-stopped
    volumes:
      - ./update-scripts:/scripts
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - nginx-net
    environment:
      - UPDATE_CHECK_SCHEDULE=0 2 * * 0
      - NOTIFICATION_EMAIL=${NOTIFICATION_EMAIL}
    command: /scripts/update-checker.sh

volumes:
  maintenance-data:

networks:
  nginx-net:
    external: true
```

### 2. Maintenance Scripts

```bash
#!/bin/bash
# maintenance-scripts/maintenance-manager.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
LOG_DIR="/logs"
RETENTION_DAYS=${LOG_RETENTION_DAYS:-30}
BACKUP_RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}

echo -e "${BLUE}🔧 Starting maintenance process...${NC}"

# Function to cleanup logs
cleanup_logs() {
    echo -e "${BLUE}📝 Cleaning up old logs...${NC}"
    
    # Clean application logs
    find $LOG_DIR -name "*.log" -mtime +$RETENTION_DAYS -delete
    
    # Clean Docker logs
    docker system prune -f --volumes
    
    # Clean unused images
    docker image prune -f
    
    # Clean unused containers
    docker container prune -f
    
    echo -e "${GREEN}✅ Log cleanup completed${NC}"
}

# Function to cleanup backups
cleanup_backups() {
    echo -e "${BLUE}💾 Cleaning up old backups...${NC}"
    
    # Clean backup files
    find /backups -name "*.tar.gz" -mtime +$BACKUP_RETENTION_DAYS -delete
    find /backups -name "*.sql.gz" -mtime +$BACKUP_RETENTION_DAYS -delete
    find /backups -name "*.rdb.gz" -mtime +$BACKUP_RETENTION_DAYS -delete
    
    echo -e "${GREEN}✅ Backup cleanup completed${NC}"
}

# Function to check disk space
check_disk_space() {
    echo -e "${BLUE}💽 Checking disk space...${NC}"
    
    # Check root partition
    ROOT_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $ROOT_USAGE -gt 80 ]; then
        echo -e "${RED}⚠️  Root partition usage is high: ${ROOT_USAGE}%${NC}"
    else
        echo -e "${GREEN}✅ Root partition usage: ${ROOT_USAGE}%${NC}"
    fi
    
    # Check Docker partition
    DOCKER_USAGE=$(df /var/lib/docker | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $DOCKER_USAGE -gt 80 ]; then
        echo -e "${RED}⚠️  Docker partition usage is high: ${DOCKER_USAGE}%${NC}"
    else
        echo -e "${GREEN}✅ Docker partition usage: ${DOCKER_USAGE}%${NC}"
    fi
}

# Function to check container health
check_container_health() {
    echo -e "${BLUE}🏥 Checking container health...${NC}"
    
    # Check all containers
    for container in $(docker ps --format "{{.Names}}"); do
        HEALTH=$(docker inspect $container --format='{{.State.Health.Status}}' 2>/dev/null || echo "no-health-check")
        if [ "$HEALTH" = "unhealthy" ]; then
            echo -e "${RED}❌ Container $container is unhealthy${NC}"
        elif [ "$HEALTH" = "healthy" ]; then
            echo -e "${GREEN}✅ Container $container is healthy${NC}"
        else
            echo -e "${YELLOW}⚠️  Container $container has no health check${NC}"
        fi
    done
}

# Function to check service status
check_service_status() {
    echo -e "${BLUE}🔍 Checking service status...${NC}"
    
    # Check nginx-proxy
    if docker ps | grep -q nginx-proxy; then
        echo -e "${GREEN}✅ nginx-proxy is running${NC}"
    else
        echo -e "${RED}❌ nginx-proxy is not running${NC}"
    fi
    
    # Check school-website
    if docker ps | grep -q school-website; then
        echo -e "${GREEN}✅ school-website is running${NC}"
    else
        echo -e "${RED}❌ school-website is not running${NC}"
    fi
    
    # Check database
    if docker ps | grep -q school-postgres; then
        echo -e "${GREEN}✅ school-postgres is running${NC}"
    else
        echo -e "${RED}❌ school-postgres is not running${NC}"
    fi
    
    # Check Redis
    if docker ps | grep -q school-redis; then
        echo -e "${GREEN}✅ school-redis is running${NC}"
    else
        echo -e "${RED}❌ school-redis is not running${NC}"
    fi
}

# Function to generate maintenance report
generate_report() {
    echo -e "${BLUE}📊 Generating maintenance report...${NC}"
    
    REPORT_FILE="/logs/maintenance-report-$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "Maintenance Report - $(date)"
        echo "=================================="
        echo ""
        echo "Disk Space:"
        df -h
        echo ""
        echo "Container Status:"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        echo ""
        echo "Container Health:"
        for container in $(docker ps --format "{{.Names}}"); do
            HEALTH=$(docker inspect $container --format='{{.State.Health.Status}}' 2>/dev/null || echo "no-health-check")
            echo "$container: $HEALTH"
        done
        echo ""
        echo "Docker System Info:"
        docker system df
        echo ""
        echo "Recent Logs:"
        docker logs --tail 10 school-website
    } > $REPORT_FILE
    
    echo -e "${GREEN}✅ Report generated: $REPORT_FILE${NC}"
}

# Main maintenance process
main() {
    cleanup_logs
    cleanup_backups
    check_disk_space
    check_container_health
    check_service_status
    generate_report
    
    echo -e "${GREEN}🎉 Maintenance process completed successfully!${NC}"
}

# Run main function
main
```

### 3. Log Rotation Configuration

```conf
# logrotate.conf
/var/log/nginx/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 www-data www-data
    postrotate
        docker exec nginx-proxy nginx -s reload
    endscript
}

/var/log/docker/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 root root
    postrotate
        docker system prune -f
    endscript
}

/var/log/application/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 root root
    postrotate
        docker restart school-website
    endscript
}
```

### 4. Update Checker Script

```bash
#!/bin/bash
# update-scripts/update-checker.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NOTIFICATION_EMAIL=${NOTIFICATION_EMAIL:-""}
UPDATE_LOG="/logs/update-check-$(date +%Y%m%d_%H%M%S).log"

echo -e "${BLUE}🔍 Checking for updates...${NC}"

# Function to check Docker image updates
check_docker_updates() {
    echo -e "${BLUE}🐳 Checking Docker image updates...${NC}"
    
    # Check nginx-proxy
    docker pull nginxproxy/nginx-proxy:latest
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ nginx-proxy image updated${NC}"
    else
        echo -e "${RED}❌ Failed to update nginx-proxy image${NC}"
    fi
    
    # Check school-website
    docker pull node:18-alpine
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Node.js image updated${NC}"
    else
        echo -e "${RED}❌ Failed to update Node.js image${NC}"
    fi
    
    # Check PostgreSQL
    docker pull postgres:15-alpine
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PostgreSQL image updated${NC}"
    else
        echo -e "${RED}❌ Failed to update PostgreSQL image${NC}"
    fi
    
    # Check Redis
    docker pull redis:7-alpine
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Redis image updated${NC}"
    else
        echo -e "${RED}❌ Failed to update Redis image${NC}"
    fi
}

# Function to check application updates
check_app_updates() {
    echo -e "${BLUE}📱 Checking application updates...${NC}"
    
    # Check for new commits
    cd /app
    git fetch origin
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    
    if [ "$LOCAL" != "$REMOTE" ]; then
        echo -e "${YELLOW}⚠️  New commits available${NC}"
        echo "Local: $LOCAL"
        echo "Remote: $REMOTE"
        
        # Send notification
        if [ ! -z "$NOTIFICATION_EMAIL" ]; then
            echo "New commits available for school-website" | mail -s "Update Available" $NOTIFICATION_EMAIL
        fi
    else
        echo -e "${GREEN}✅ Application is up to date${NC}"
    fi
}

# Function to check security updates
check_security_updates() {
    echo -e "${BLUE}🔒 Checking security updates...${NC}"
    
    # Check for security vulnerabilities
    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
        aquasec/trivy image school-website:latest
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ No security vulnerabilities found${NC}"
    else
        echo -e "${RED}❌ Security vulnerabilities detected${NC}"
        
        # Send notification
        if [ ! -z "$NOTIFICATION_EMAIL" ]; then
            echo "Security vulnerabilities detected in school-website" | mail -s "Security Alert" $NOTIFICATION_EMAIL
        fi
    fi
}

# Function to generate update report
generate_update_report() {
    echo -e "${BLUE}📊 Generating update report...${NC}"
    
    {
        echo "Update Check Report - $(date)"
        echo "=================================="
        echo ""
        echo "Docker Images:"
        docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.CreatedAt}}"
        echo ""
        echo "Application Status:"
        git log --oneline -5
        echo ""
        echo "System Information:"
        uname -a
        echo ""
        echo "Docker Version:"
        docker --version
        echo ""
        echo "Docker Compose Version:"
        docker-compose --version
    } > $UPDATE_LOG
    
    echo -e "${GREEN}✅ Update report generated: $UPDATE_LOG${NC}"
}

# Main update check process
main() {
    check_docker_updates
    check_app_updates
    check_security_updates
    generate_update_report
    
    echo -e "${GREEN}🎉 Update check completed successfully!${NC}"
}

# Run main function
main
```

## 🚀 Deployment Steps

### 1. Setup Maintenance Environment

```bash
# Create maintenance directories
mkdir -p maintenance-scripts update-scripts logs

# Copy scripts
cp maintenance-scripts/* ./
cp update-scripts/* ./
```

### 2. Configure Environment Variables

```bash
# Add to your .env file
NOTIFICATION_EMAIL=admin@your-domain.com
LOG_RETENTION_DAYS=30
BACKUP_RETENTION_DAYS=30
```

### 3. Start Maintenance Services

```bash
# Start maintenance services
docker-compose -f docker-compose.maintenance.yml up -d

# Check status
docker-compose -f docker-compose.maintenance.yml ps
```

### 4. Schedule Maintenance

```bash
# Add to crontab
crontab -e

# Add maintenance schedule
0 3 * * * docker exec school-maintenance-manager /scripts/maintenance-manager.sh
0 2 * * 0 docker exec school-update-checker /scripts/update-checker.sh
```

## 🔧 Configuration

### Maintenance Schedule

| Task | Schedule | Description |
|------|----------|-------------|
| Log Cleanup | Daily 3 AM | Clean old logs |
| Backup Cleanup | Daily 3 AM | Clean old backups |
| Health Check | Daily 3 AM | Check container health |
| Update Check | Weekly Sunday 2 AM | Check for updates |
| Security Scan | Weekly Sunday 2 AM | Check security vulnerabilities |

### Log Retention

| Log Type | Retention | Description |
|----------|-----------|-------------|
| Application Logs | 30 days | Recent application logs |
| Nginx Logs | 30 days | Web server logs |
| Docker Logs | 30 days | Container logs |
| Maintenance Logs | 90 days | Maintenance reports |

## 📊 Monitoring

### Maintenance Monitoring

```bash
# Check maintenance logs
docker logs school-maintenance-manager

# Check update logs
docker logs school-update-checker

# Check log rotation
docker logs school-log-rotator
```

### Maintenance Reports

```bash
# View maintenance reports
ls -la logs/maintenance-report-*.txt

# View update reports
ls -la logs/update-check-*.log

# View latest report
tail -f logs/maintenance-report-$(date +%Y%m%d)*.txt
```

## 🛠️ Troubleshooting

### Common Issues

1. **Maintenance Failed**
   ```bash
   # Check logs
   docker logs school-maintenance-manager
   
   # Check disk space
   df -h
   
   # Check permissions
   ls -la logs/
   ```

2. **Update Check Failed**
   ```bash
   # Check logs
   docker logs school-update-checker
   
   # Check network
   ping github.com
   
   # Check Git status
   git status
   ```

3. **Log Rotation Failed**
   ```bash
   # Check logs
   docker logs school-log-rotator
   
   # Check logrotate config
   docker exec school-log-rotator cat /etc/logrotate.conf
   ```

### Performance Issues

1. **High Disk Usage**
   ```bash
   # Check disk usage
   du -sh logs/*
   
   # Clean old logs
   find logs/ -name "*.log" -mtime +30 -delete
   ```

2. **Slow Maintenance**
   ```bash
   # Check resource usage
   docker stats school-maintenance-manager
   
   # Check I/O
   iostat -x 1
   ```

## 🔒 Security

### Maintenance Security

1. **Access Control**
   ```bash
   # Set proper permissions
   chmod 600 maintenance-scripts/*
   chown root:root maintenance-scripts/*
   ```

2. **Log Security**
   ```bash
   # Encrypt sensitive logs
   gpg --symmetric --cipher-algo AES256 sensitive.log
   ```

3. **Update Security**
   ```bash
   # Verify updates
   git verify-commit HEAD
   
   # Check signatures
   gpg --verify update.sig update.tar.gz
   ```

## 📈 Scaling

### Maintenance Scaling

```yaml
# docker-compose.yml
services:
  maintenance-manager:
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.25'
```

### Distributed Maintenance

```bash
# Run maintenance on multiple nodes
for node in node1 node2 node3; do
    ssh $node "docker exec school-maintenance-manager /scripts/maintenance-manager.sh"
done
```

## 🎯 Best Practices

1. **Maintenance Strategy**
   ```bash
   # Regular maintenance
   # Automated cleanup
   # Health monitoring
   # Update management
   ```

2. **Log Management**
   ```bash
   # Centralized logging
   # Log rotation
   # Log analysis
   # Log security
   ```

3. **Update Management**
   ```bash
   # Regular updates
   # Security patches
   # Version control
   # Rollback procedures
   ```

## 📞 Support

- **Docker Maintenance**: https://docs.docker.com/config/containers/logging/
- **Logrotate Documentation**: https://linux.die.net/man/8/logrotate
- **Cron Documentation**: https://linux.die.net/man/8/cron
- **Issues**: [GitHub Issues](https://github.com/sandikodev/v0-website-for-school/issues)

---

**Note**: Pastikan nginx-net network sudah dibuat sebelum menjalankan maintenance services.
