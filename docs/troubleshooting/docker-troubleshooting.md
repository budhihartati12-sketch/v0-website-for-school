# Troubleshooting Guide

## 🔍 Overview

Panduan lengkap untuk troubleshooting masalah umum dalam aplikasi website sekolah dengan Docker.

## 📋 Prerequisites

- Docker dan Docker Compose terinstall
- nginx-proxy sudah berjalan
- nginx-net network sudah dibuat
- Basic understanding of troubleshooting concepts

## 🏗️ Troubleshooting Architecture

```
school-website → logs → monitoring → alerts
        ↓
    nginx-net network
```

## 🐳 Common Issues

### 1. Container Issues

#### Container Won't Start

**Symptoms:**
- Container exits immediately
- Error messages in logs
- Status shows "Exited"

**Diagnosis:**
```bash
# Check container status
docker ps -a

# Check container logs
docker logs school-website

# Check container configuration
docker inspect school-website
```

**Solutions:**
```bash
# Check environment variables
docker-compose config

# Check port conflicts
netstat -tulpn | grep :3000

# Check resource limits
docker stats school-website

# Restart container
docker-compose restart school-website

# Rebuild container
docker-compose build --no-cache school-website
docker-compose up -d school-website
```

#### Container Health Check Failed

**Symptoms:**
- Health status shows "unhealthy"
- Application not responding
- Error messages in health check

**Diagnosis:**
```bash
# Check health status
docker inspect school-website --format='{{.State.Health.Status}}'

# Check health check logs
docker inspect school-website --format='{{range .State.Health.Log}}{{.Output}}{{end}}'

# Test health endpoint manually
curl -f http://localhost:3000/api/health
```

**Solutions:**
```bash
# Check application logs
docker logs school-website

# Check database connection
docker exec school-website ping postgres

# Check Redis connection
docker exec school-website ping redis

# Restart health check
docker restart school-website
```

### 2. Network Issues

#### Container Can't Connect to Database

**Symptoms:**
- Database connection errors
- Application crashes
- Timeout errors

**Diagnosis:**
```bash
# Check network connectivity
docker exec school-website ping postgres

# Check database status
docker ps | grep postgres

# Check database logs
docker logs school-postgres

# Test database connection
docker exec school-postgres psql -U school_user -d school_db -c "SELECT 1;"
```

**Solutions:**
```bash
# Check network configuration
docker network inspect nginx-net

# Check database environment variables
docker exec school-postgres env | grep POSTGRES

# Restart database
docker-compose restart postgres

# Check firewall rules
iptables -L
```

#### nginx-proxy Not Working

**Symptoms:**
- 502 Bad Gateway errors
- SSL certificate issues
- Domain not resolving

**Diagnosis:**
```bash
# Check nginx-proxy status
docker ps | grep nginx-proxy

# Check nginx-proxy logs
docker logs nginx-proxy

# Check nginx configuration
docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf

# Test domain resolution
nslookup your-domain.com
```

**Solutions:**
```bash
# Check VIRTUAL_HOST environment variable
docker inspect school-website | grep VIRTUAL_HOST

# Check SSL certificate
docker exec nginx-proxy ls -la /etc/nginx/certs/

# Restart nginx-proxy
docker-compose restart nginx-proxy

# Check DNS configuration
dig your-domain.com
```

### 3. Database Issues

#### Database Connection Failed

**Symptoms:**
- Connection refused errors
- Authentication failed
- Database not found

**Diagnosis:**
```bash
# Check database status
docker ps | grep postgres

# Check database logs
docker logs school-postgres

# Check database environment variables
docker exec school-postgres env | grep POSTGRES

# Test database connection
docker exec school-postgres psql -U school_user -d school_db -c "SELECT version();"
```

**Solutions:**
```bash
# Check database configuration
docker exec school-postgres cat /var/lib/postgresql/data/postgresql.conf

# Check database permissions
docker exec school-postgres psql -U postgres -c "\du"

# Restart database
docker-compose restart postgres

# Check database data directory
docker exec school-postgres ls -la /var/lib/postgresql/data/
```

#### Database Performance Issues

**Symptoms:**
- Slow queries
- High CPU usage
- Memory issues

**Diagnosis:**
```bash
# Check database performance
docker exec school-postgres psql -U school_user -d school_db -c "SELECT * FROM pg_stat_activity;"

# Check database size
docker exec school-postgres psql -U school_user -d school_db -c "SELECT pg_size_pretty(pg_database_size('school_db'));"

# Check slow queries
docker exec school-postgres psql -U school_user -d school_db -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"
```

**Solutions:**
```bash
# Optimize database configuration
docker exec school-postgres psql -U postgres -c "ALTER SYSTEM SET shared_buffers = '256MB';"
docker exec school-postgres psql -U postgres -c "ALTER SYSTEM SET work_mem = '4MB';"
docker exec school-postgres psql -U postgres -c "SELECT pg_reload_conf();"

# Check database indexes
docker exec school-postgres psql -U school_user -d school_db -c "\di"

# Analyze database
docker exec school-postgres psql -U school_user -d school_db -c "ANALYZE;"
```

### 4. Redis Issues

#### Redis Connection Failed

**Symptoms:**
- Redis connection errors
- Cache not working
- Authentication failed

**Diagnosis:**
```bash
# Check Redis status
docker ps | grep redis

# Check Redis logs
docker logs school-redis

# Test Redis connection
docker exec school-redis redis-cli ping

# Check Redis configuration
docker exec school-redis redis-cli config get "*"
```

**Solutions:**
```bash
# Check Redis environment variables
docker exec school-redis env | grep REDIS

# Check Redis memory usage
docker exec school-redis redis-cli info memory

# Restart Redis
docker-compose restart redis

# Check Redis persistence
docker exec school-redis redis-cli info persistence
```

#### Redis Performance Issues

**Symptoms:**
- Slow Redis operations
- High memory usage
- Eviction issues

**Diagnosis:**
```bash
# Check Redis performance
docker exec school-redis redis-cli info stats

# Check Redis memory usage
docker exec school-redis redis-cli info memory

# Check Redis slow log
docker exec school-redis redis-cli slowlog get 10
```

**Solutions:**
```bash
# Check Redis configuration
docker exec school-redis redis-cli config get maxmemory
docker exec school-redis redis-cli config get maxmemory-policy

# Optimize Redis configuration
docker exec school-redis redis-cli config set maxmemory 128mb
docker exec school-redis redis-cli config set maxmemory-policy allkeys-lru

# Check Redis keys
docker exec school-redis redis-cli keys "*"
```

### 5. SSL/TLS Issues

#### SSL Certificate Problems

**Symptoms:**
- SSL certificate errors
- HTTPS not working
- Certificate expired

**Diagnosis:**
```bash
# Check SSL certificate
openssl x509 -in /etc/nginx/certs/your-domain.com.crt -text -noout

# Check certificate expiration
openssl x509 -in /etc/nginx/certs/your-domain.com.crt -noout -dates

# Test SSL connection
openssl s_client -connect your-domain.com:443 -servername your-domain.com
```

**Solutions:**
```bash
# Check Let's Encrypt logs
docker logs nginx-letsencrypt

# Check domain DNS
nslookup your-domain.com

# Renew SSL certificate
docker exec nginx-letsencrypt certbot renew

# Check nginx SSL configuration
docker exec nginx-proxy nginx -t
```

#### HTTPS Redirect Issues

**Symptoms:**
- HTTP not redirecting to HTTPS
- Mixed content errors
- SSL configuration errors

**Diagnosis:**
```bash
# Check nginx configuration
docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf

# Check redirect rules
curl -I http://your-domain.com

# Check SSL configuration
docker exec nginx-proxy nginx -t
```

**Solutions:**
```bash
# Check nginx configuration
docker exec nginx-proxy nginx -t

# Reload nginx configuration
docker exec nginx-proxy nginx -s reload

# Check SSL headers
curl -I https://your-domain.com
```

## 🚀 Troubleshooting Tools

### 1. Diagnostic Scripts

```bash
#!/bin/bash
# diagnostic.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Running system diagnostics...${NC}"

# Check Docker status
echo -e "${BLUE}🐳 Checking Docker status...${NC}"
if docker info > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker is running${NC}"
else
    echo -e "${RED}❌ Docker is not running${NC}"
fi

# Check containers
echo -e "${BLUE}📦 Checking containers...${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Check networks
echo -e "${BLUE}🌐 Checking networks...${NC}"
docker network ls

# Check volumes
echo -e "${BLUE}💾 Checking volumes...${NC}"
docker volume ls

# Check images
echo -e "${BLUE}🖼️  Checking images...${NC}"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Check system resources
echo -e "${BLUE}💻 Checking system resources...${NC}"
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1

echo "Memory Usage:"
free -h

echo "Disk Usage:"
df -h

# Check logs
echo -e "${BLUE}📝 Checking recent logs...${NC}"
echo "nginx-proxy logs:"
docker logs --tail 5 nginx-proxy

echo "school-website logs:"
docker logs --tail 5 school-website

echo "school-postgres logs:"
docker logs --tail 5 school-postgres

echo "school-redis logs:"
docker logs --tail 5 school-redis

echo -e "${GREEN}🎉 Diagnostics completed!${NC}"
```

### 2. Health Check Scripts

```bash
#!/bin/bash
# health-check.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏥 Running health checks...${NC}"

# Check application health
echo -e "${BLUE}📱 Checking application health...${NC}"
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is healthy${NC}"
else
    echo -e "${RED}❌ Application is unhealthy${NC}"
fi

# Check database health
echo -e "${BLUE}🗄️  Checking database health...${NC}"
if docker exec school-postgres pg_isready -U school_user -d school_db > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database is healthy${NC}"
else
    echo -e "${RED}❌ Database is unhealthy${NC}"
fi

# Check Redis health
echo -e "${BLUE}🔴 Checking Redis health...${NC}"
if docker exec school-redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis is healthy${NC}"
else
    echo -e "${RED}❌ Redis is unhealthy${NC}"
fi

# Check nginx-proxy health
echo -e "${BLUE}🌐 Checking nginx-proxy health...${NC}"
if curl -f http://localhost:80 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ nginx-proxy is healthy${NC}"
else
    echo -e "${RED}❌ nginx-proxy is unhealthy${NC}"
fi

echo -e "${GREEN}🎉 Health checks completed!${NC}"
```

### 3. Performance Monitoring

```bash
#!/bin/bash
# performance-monitor.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 Monitoring performance...${NC}"

# Check container resources
echo -e "${BLUE}💻 Container resources:${NC}"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

# Check system load
echo -e "${BLUE}⚡ System load:${NC}"
uptime

# Check memory usage
echo -e "${BLUE}🧠 Memory usage:${NC}"
free -h

# Check disk usage
echo -e "${BLUE}💾 Disk usage:${NC}"
df -h

# Check network connections
echo -e "${BLUE}🌐 Network connections:${NC}"
netstat -tulpn | grep -E ":(80|443|3000|5432|6379)"

# Check process count
echo -e "${BLUE}🔢 Process count:${NC}"
ps aux | wc -l

echo -e "${GREEN}🎉 Performance monitoring completed!${NC}"
```

## 🔧 Configuration Issues

### 1. Environment Variables

**Common Issues:**
- Missing environment variables
- Incorrect values
- Typos in variable names

**Diagnosis:**
```bash
# Check environment variables
docker-compose config

# Check specific container environment
docker exec school-website env | grep -E "(DATABASE|REDIS|NEXTAUTH)"
```

**Solutions:**
```bash
# Check .env file
cat .env

# Validate environment variables
docker-compose config --quiet

# Restart with new environment
docker-compose down
docker-compose up -d
```

### 2. Port Conflicts

**Common Issues:**
- Port already in use
- Wrong port configuration
- Firewall blocking ports

**Diagnosis:**
```bash
# Check port usage
netstat -tulpn | grep -E ":(80|443|3000|5432|6379)"

# Check Docker port mapping
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

**Solutions:**
```bash
# Kill process using port
sudo kill -9 $(lsof -t -i:3000)

# Check firewall rules
sudo ufw status

# Restart Docker daemon
sudo systemctl restart docker
```

### 3. Volume Issues

**Common Issues:**
- Volume not mounted
- Permission issues
- Volume not found

**Diagnosis:**
```bash
# Check volume mounts
docker inspect school-website | grep -A 10 "Mounts"

# Check volume permissions
ls -la /var/lib/docker/volumes/
```

**Solutions:**
```bash
# Check volume configuration
docker-compose config

# Recreate volumes
docker-compose down -v
docker-compose up -d

# Fix permissions
sudo chown -R 1001:1001 /var/lib/docker/volumes/school-website_data
```

## 📊 Monitoring and Logging

### 1. Log Analysis

```bash
# Check application logs
docker logs school-website --tail 100

# Check error logs
docker logs school-website 2>&1 | grep -i error

# Check access logs
docker logs nginx-proxy --tail 100

# Check database logs
docker logs school-postgres --tail 100
```

### 2. Performance Monitoring

```bash
# Monitor container resources
docker stats school-website

# Check system resources
htop

# Monitor disk I/O
iostat -x 1

# Monitor network
iftop
```

### 3. Alerting

```bash
# Set up log monitoring
tail -f /var/log/nginx/access.log | grep -E "(4[0-9]{2}|5[0-9]{2})"

# Set up resource monitoring
watch -n 1 'docker stats --no-stream'

# Set up health monitoring
while true; do
    if ! curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "Application is down at $(date)"
        # Send alert
    fi
    sleep 60
done
```

## 🎯 Best Practices

### 1. Prevention

```bash
# Regular health checks
# Monitor logs
# Set up alerts
# Regular backups
# Update regularly
```

### 2. Response

```bash
# Document issues
# Test solutions
# Implement fixes
# Monitor results
# Learn from issues
```

### 3. Recovery

```bash
# Have backup plans
# Test recovery procedures
# Document recovery steps
# Train team members
# Regular drills
```

## 📞 Support

- **Docker Troubleshooting**: https://docs.docker.com/config/troubleshooting/
- **Nginx Troubleshooting**: https://nginx.org/en/docs/
- **PostgreSQL Troubleshooting**: https://www.postgresql.org/docs/current/runtime-config-logging.html
- **Redis Troubleshooting**: https://redis.io/docs/management/troubleshooting/
- **Issues**: [GitHub Issues](https://github.com/sandikodev/v0-website-for-school/issues)

---

**Note**: Pastikan nginx-net network sudah dibuat sebelum menjalankan troubleshooting procedures.
