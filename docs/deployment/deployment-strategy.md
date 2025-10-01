# Deployment Strategy Guide

## 🚀 Overview

Strategi deployment yang komprehensif untuk aplikasi website sekolah dengan berbagai jenis environment untuk memastikan stabilitas dan keamanan.

## 📋 Prerequisites

- Docker dan Docker Compose terinstall
- Domain yang sudah diarahkan ke VPS
- Basic understanding of deployment concepts

## 🏗️ Deployment Architecture

```
Development → Staging → Production
     ↓           ↓         ↓
   Local      Testing    Live
```

## 🎯 Deployment Types

### 1. Development Deployment
- **Purpose**: Development dan testing lokal
- **Environment**: Local development
- **Stability**: Basic
- **Security**: Minimal
- **Monitoring**: Basic logging

### 2. Staging Deployment
- **Purpose**: Testing sebelum production
- **Environment**: Staging server
- **Stability**: High
- **Security**: Medium
- **Monitoring**: Full monitoring

### 3. Production Deployment
- **Purpose**: Live application untuk users
- **Environment**: Production server
- **Stability**: Maximum
- **Security**: Maximum
- **Monitoring**: Full monitoring + alerts

## 🔧 Environment Configuration

### Development Environment

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  school-website:
    build: .
    container_name: school-website-dev
    restart: unless-stopped
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://school_user:dev_password@postgres:5432/school_db_dev
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_SECRET=dev-secret-key
      - NEXTAUTH_URL=http://localhost:3000
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - dev-network
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    container_name: school-postgres-dev
    restart: unless-stopped
    environment:
      - POSTGRES_DB=school_db_dev
      - POSTGRES_USER=school_user
      - POSTGRES_PASSWORD=dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres-dev-data:/var/lib/postgresql/data
    networks:
      - dev-network

  redis:
    image: redis:7-alpine
    container_name: school-redis-dev
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-dev-data:/data
    networks:
      - dev-network

volumes:
  postgres-dev-data:
  redis-dev-data:

networks:
  dev-network:
    driver: bridge
```

### Staging Environment

```yaml
# docker-compose.staging.yml
version: '3.8'

services:
  school-website:
    build: .
    container_name: school-website-staging
    restart: unless-stopped
    environment:
      - VIRTUAL_HOST=staging.your-domain.com
      - VIRTUAL_PORT=3000
      - LETSENCRYPT_HOST=staging.your-domain.com
      - LETSENCRYPT_EMAIL=admin@your-domain.com
      - NODE_ENV=staging
      - DATABASE_URL=postgresql://school_user:staging_password@postgres:5432/school_db_staging
      - REDIS_URL=redis://:staging_password@redis:6379
      - NEXTAUTH_SECRET=staging-secret-key
      - NEXTAUTH_URL=https://staging.your-domain.com
    networks:
      - nginx-net
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    labels:
      - "com.github.jrcs.letsencrypt_nginx_proxy_companion.nginx_proxy=true"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'

  postgres:
    image: postgres:15-alpine
    container_name: school-postgres-staging
    restart: unless-stopped
    environment:
      - POSTGRES_DB=school_db_staging
      - POSTGRES_USER=school_user
      - POSTGRES_PASSWORD=staging_password
    volumes:
      - postgres-staging-data:/var/lib/postgresql/data
    networks:
      - nginx-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U school_user -d school_db_staging"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.25'
        reservations:
          memory: 128M
          cpus: '0.1'

  redis:
    image: redis:7-alpine
    container_name: school-redis-staging
    restart: unless-stopped
    command: redis-server --requirepass staging_password --maxmemory 128mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-staging-data:/data
    networks:
      - nginx-net
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          memory: 128M
          cpus: '0.1'
        reservations:
          memory: 64M
          cpus: '0.05'

volumes:
  postgres-staging-data:
  redis-staging-data:

networks:
  nginx-net:
    external: true
```

### Production Environment

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  school-website:
    build: .
    container_name: school-website-prod
    restart: unless-stopped
    environment:
      - VIRTUAL_HOST=${DOMAIN}
      - VIRTUAL_PORT=3000
      - LETSENCRYPT_HOST=${DOMAIN}
      - LETSENCRYPT_EMAIL=${EMAIL}
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=https://${DOMAIN}
    networks:
      - nginx-net
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    labels:
      - "com.github.jrcs.letsencrypt_nginx_proxy_companion.nginx_proxy=true"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'
      replicas: 2

  postgres:
    image: postgres:15-alpine
    container_name: school-postgres-prod
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres-prod-data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    networks:
      - nginx-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'

  redis:
    image: redis:7-alpine
    container_name: school-redis-prod
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-prod-data:/data
    networks:
      - nginx-net
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.25'
        reservations:
          memory: 128M
          cpus: '0.1'

volumes:
  postgres-prod-data:
  redis-prod-data:

networks:
  nginx-net:
    external: true
```

## 🚀 Deployment Scripts

### Development Deployment Script

```bash
#!/bin/bash
# deploy-dev.sh

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
    cat > .env.dev << 'EOF'
# Development Environment Variables
NODE_ENV=development
DATABASE_URL=postgresql://school_user:dev_password@postgres:5432/school_db_dev
REDIS_URL=redis://redis:6379
NEXTAUTH_SECRET=dev-secret-key
NEXTAUTH_URL=http://localhost:3000
EOF
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
echo ""
echo -e "${YELLOW}📋 Useful commands:${NC}"
echo -e "  View logs: docker-compose -f docker-compose.dev.yml logs -f school-website"
echo -e "  Check status: docker-compose -f docker-compose.dev.yml ps"
echo -e "  Restart: docker-compose -f docker-compose.dev.yml restart school-website"
echo -e "  Stop: docker-compose -f docker-compose.dev.yml down"
echo ""
echo -e "${GREEN}🌐 Your application is available at: http://localhost:3000${NC}"
```

### Staging Deployment Script

```bash
#!/bin/bash
# deploy-staging.sh

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
    cat > .env.staging << 'EOF'
# Staging Environment Variables
DOMAIN=staging.your-domain.com
EMAIL=admin@your-domain.com
NODE_ENV=staging
DATABASE_URL=postgresql://school_user:staging_password@postgres:5432/school_db_staging
REDIS_URL=redis://:staging_password@redis:6379
NEXTAUTH_SECRET=staging-secret-key
NEXTAUTH_URL=https://staging.your-domain.com
EOF
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
echo ""
echo -e "${YELLOW}📋 Useful commands:${NC}"
echo -e "  View logs: docker-compose -f docker-compose.staging.yml logs -f school-website"
echo -e "  Check status: docker-compose -f docker-compose.staging.yml ps"
echo -e "  Restart: docker-compose -f docker-compose.staging.yml restart school-website"
echo -e "  Stop: docker-compose -f docker-compose.staging.yml down"
echo ""
echo -e "${GREEN}🌐 Your application should be available at: https://${DOMAIN}${NC}"
```

## 🔧 Environment Configuration

### Development Environment Variables

```bash
# .env.dev
NODE_ENV=development
DATABASE_URL=postgresql://school_user:dev_password@postgres:5432/school_db_dev
REDIS_URL=redis://redis:6379
NEXTAUTH_SECRET=dev-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Staging Environment Variables

```bash
# .env.staging
DOMAIN=staging.your-domain.com
EMAIL=admin@your-domain.com
NODE_ENV=staging
DATABASE_URL=postgresql://school_user:staging_password@postgres:5432/school_db_staging
REDIS_URL=redis://:staging_password@redis:6379
NEXTAUTH_SECRET=staging-secret-key
NEXTAUTH_URL=https://staging.your-domain.com
```

### Production Environment Variables

```bash
# .env.prod
DOMAIN=your-domain.com
EMAIL=admin@your-domain.com
NODE_ENV=production
DATABASE_URL=postgresql://school_user:production_password@postgres:5432/school_db
REDIS_URL=redis://:production_password@redis:6379
NEXTAUTH_SECRET=production-secret-key
NEXTAUTH_URL=https://your-domain.com
```

## 📊 Monitoring Strategy

### Development Monitoring
- Basic logging
- Console output
- Simple health checks

### Staging Monitoring
- Full logging
- Performance metrics
- Health checks
- Error tracking

### Production Monitoring
- Full logging
- Performance metrics
- Health checks
- Error tracking
- Alerting
- Uptime monitoring

## 🔒 Security Strategy

### Development Security
- Basic authentication
- Local network access
- Minimal security headers

### Staging Security
- Full authentication
- SSL/TLS
- Security headers
- Rate limiting

### Production Security
- Full authentication
- SSL/TLS
- Security headers
- Rate limiting
- Fail2Ban
- CrowdSec
- Firewall rules

## 🎯 Best Practices

### Development
- Use local development
- Enable hot reload
- Basic error handling
- Simple logging

### Staging
- Mirror production environment
- Full testing
- Performance testing
- Security testing

### Production
- High availability
- Full monitoring
- Automated backups
- Security hardening
- Performance optimization

## 📞 Support

- **Documentation**: [docs/README.md](../README.md)
- **Issues**: [GitHub Issues](https://github.com/sandikodev/v0-website-for-school/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sandikodev/v0-website-for-school/discussions)

---

**Note**: Pastikan nginx-proxy dan nginx-net sudah berjalan sebelum menjalankan staging dan production deployment.
