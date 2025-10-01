# Staging Deployment Guide

## 🚀 Overview

Panduan lengkap untuk deployment staging aplikasi website sekolah dengan Docker untuk testing sebelum production.

## 📋 Prerequisites

- Docker dan Docker Compose terinstall
- nginx-proxy sudah berjalan
- nginx-net network sudah dibuat
- Staging domain sudah diarahkan ke VPS

## 🏗️ Staging Architecture

```
Internet → nginx-proxy → school-website-staging
                ↓
        nginx-net network
```

## 🐳 Staging Setup

### 1. Staging Docker Compose

```yaml
# docker-compose.staging.yml
version: '3.8'

services:
  school-website:
    build: .
    container_name: school-website-staging
    restart: unless-stopped
    environment:
      - VIRTUAL_HOST=${DOMAIN}
      - VIRTUAL_PORT=3000
      - LETSENCRYPT_HOST=${DOMAIN}
      - LETSENCRYPT_EMAIL=${EMAIL}
      - NODE_ENV=staging
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
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres-staging-data:/var/lib/postgresql/data
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
          memory: 256M
          cpus: '0.25'
        reservations:
          memory: 128M
          cpus: '0.1'

  redis:
    image: redis:7-alpine
    container_name: school-redis-staging
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 128mb --maxmemory-policy allkeys-lru
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

  monitoring:
    image: prom/prometheus:latest
    container_name: school-prometheus-staging
    restart: unless-stopped
    volumes:
      - ./prometheus-staging.yml:/etc/prometheus/prometheus.yml
      - prometheus-staging-data:/prometheus
    networks:
      - nginx-net
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=7d'
      - '--web.enable-lifecycle'

volumes:
  postgres-staging-data:
  redis-staging-data:
  prometheus-staging-data:

networks:
  nginx-net:
    external: true
```

### 2. Staging Environment Variables

```bash
# .env.staging
# Staging Environment Variables

# Domain Configuration
DOMAIN=staging.your-domain.com
EMAIL=admin@your-domain.com

# Application
NODE_ENV=staging
NEXTAUTH_SECRET=staging-secret-key
NEXTAUTH_URL=https://staging.your-domain.com

# Database
DATABASE_URL=postgresql://school_user:staging_password@postgres:5432/school_db_staging
DB_NAME=school_db_staging
DB_USER=school_user
DB_PASSWORD=staging_password

# Redis
REDIS_URL=redis://:staging_password@redis:6379
REDIS_PASSWORD=staging_password

# Monitoring
PROMETHEUS_RETENTION=7d

# Optional: External Services
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### 3. Staging Prometheus Configuration

```yaml
# prometheus-staging.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'school-website-staging'
    static_configs:
      - targets: ['school-website-staging:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 30s

  - job_name: 'postgres-staging'
    static_configs:
      - targets: ['postgres-staging:5432']

  - job_name: 'redis-staging'
    static_configs:
      - targets: ['redis-staging:6379']
```

## 🚀 Deployment Steps

### 1. Setup Staging Environment

```bash
# Clone repository
git clone https://github.com/sandikodev/v0-website-for-school.git
cd v0-website-for-school

# Copy staging environment
cp .env.staging .env

# Edit environment variables
nano .env
```

### 2. Start Staging Services

```bash
# Start staging services
docker-compose -f docker-compose.staging.yml up -d

# Check status
docker-compose -f docker-compose.staging.yml ps
```

### 3. Verify Staging Setup

```bash
# Check application health
curl -f http://localhost:3000/api/health

# Check SSL certificate
curl -I https://staging.your-domain.com

# Check nginx-proxy configuration
docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf
```

## 🔧 Staging Configuration

### Staging Settings

| Setting | Value | Description |
|---------|-------|-------------|
| NODE_ENV | staging | Staging environment |
| Worker Processes | auto | CPU cores |
| Worker Connections | 2048 | Max connections per worker |
| Keepalive Timeout | 65s | Connection timeout |
| Gzip Level | 6 | Compression level |
| Cache Size | 1GB | Nginx cache size |
| Redis Memory | 128MB | Redis cache memory |
| Database Memory | 256MB | PostgreSQL memory |

### Staging Database

```sql
-- init-scripts/01-staging-tables.sql
-- Staging database tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    birth_date DATE,
    class VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert staging data
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@staging.your-domain.com', '$2a$10$example_hash', 'admin'),
('user', 'user@staging.your-domain.com', '$2a$10$example_hash', 'user')
ON CONFLICT (username) DO NOTHING;

INSERT INTO students (student_id, full_name, email, phone, address, birth_date, class) VALUES
('STG001', 'John Doe', 'john@staging.your-domain.com', '08123456789', 'Jl. Test No. 1', '2010-01-01', '7A'),
('STG002', 'Jane Smith', 'jane@staging.your-domain.com', '08123456790', 'Jl. Test No. 2', '2010-02-01', '7B')
ON CONFLICT (student_id) DO NOTHING;
```

## 📊 Staging Monitoring

### Health Checks

```bash
# Check application health
curl -f http://localhost:3000/api/health

# Check container health
docker inspect school-website-staging --format='{{.State.Health.Status}}'

# Check database health
docker exec school-postgres-staging pg_isready -U school_user -d school_db_staging

# Check Redis health
docker exec school-redis-staging redis-cli ping
```

### Performance Monitoring

```bash
# Check Prometheus metrics
curl http://localhost:9090/api/v1/targets

# Check container resources
docker stats school-website-staging

# Check application metrics
curl http://localhost:3000/api/metrics
```

### Staging Logs

```bash
# Application logs
docker-compose -f docker-compose.staging.yml logs -f school-website

# Database logs
docker-compose -f docker-compose.staging.yml logs -f postgres

# Redis logs
docker-compose -f docker-compose.staging.yml logs -f redis

# Monitoring logs
docker-compose -f docker-compose.staging.yml logs -f monitoring
```

## 🛠️ Staging Troubleshooting

### Common Issues

1. **Application Not Starting**
   ```bash
   # Check logs
   docker-compose -f docker-compose.staging.yml logs school-website
   
   # Check environment variables
   docker-compose -f docker-compose.staging.yml config
   
   # Check resource limits
   docker stats school-website-staging
   ```

2. **SSL Certificate Issues**
   ```bash
   # Check Let's Encrypt logs
   docker logs nginx-letsencrypt
   
   # Check domain DNS
   nslookup staging.your-domain.com
   
   # Check SSL certificate
   openssl x509 -in /etc/nginx/certs/staging.your-domain.com.crt -text -noout
   ```

3. **Database Connection Issues**
   ```bash
   # Check database status
   docker ps | grep postgres
   
   # Check database logs
   docker logs school-postgres-staging
   
   # Test database connection
   docker exec school-postgres-staging psql -U school_user -d school_db_staging -c "SELECT 1;"
   ```

### Staging Commands

```bash
# Start staging
docker-compose -f docker-compose.staging.yml up -d

# Stop staging
docker-compose -f docker-compose.staging.yml down

# View logs
docker-compose -f docker-compose.staging.yml logs -f

# Restart services
docker-compose -f docker-compose.staging.yml restart

# Rebuild containers
docker-compose -f docker-compose.staging.yml build --no-cache

# Clean everything
docker-compose -f docker-compose.staging.yml down -v
```

## 🔒 Staging Security

### Security Configuration

```yaml
# docker-compose.staging.yml
services:
  school-website:
    security_opt:
      - no-new-privileges:true
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### Staging Security Features

1. **SSL/TLS**
   - Automatic SSL certificates via Let's Encrypt
   - HTTP to HTTPS redirect
   - Security headers configured

2. **Container Security**
   - Non-root user in container
   - Resource limits configured
   - Health checks enabled

3. **Network Security**
   - Isolated container network
   - No direct external access to app container
   - nginx-proxy handles all external traffic

## 📈 Staging Performance

### Performance Optimization

```yaml
# docker-compose.staging.yml
services:
  school-website:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### Staging Performance Features

1. **Caching**
   - Redis caching enabled
   - Nginx caching configured
   - Static file caching

2. **Compression**
   - Gzip compression enabled
   - Brotli compression enabled
   - Static file optimization

3. **Monitoring**
   - Prometheus metrics
   - Performance monitoring
   - Resource monitoring

## 🎯 Staging Best Practices

### Testing Strategy

1. **Functional Testing**
   - Test all features
   - Test user workflows
   - Test error handling

2. **Performance Testing**
   - Load testing
   - Stress testing
   - Performance monitoring

3. **Security Testing**
   - Security scanning
   - Vulnerability testing
   - Penetration testing

### Staging Management

1. **Data Management**
   - Use staging data
   - Reset data regularly
   - Backup staging data

2. **Environment Management**
   - Keep staging updated
   - Monitor staging health
   - Document staging issues

## 📞 Support

- **Documentation**: [docs/README.md](../README.md)
- **Issues**: [GitHub Issues](https://github.com/sandikodev/v0-website-for-school/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sandikodev/v0-website-for-school/discussions)

---

**Note**: Staging deployment untuk testing sebelum production. Pastikan nginx-proxy dan nginx-net sudah berjalan.
