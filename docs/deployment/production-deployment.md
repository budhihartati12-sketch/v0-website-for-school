# Production Deployment Guide

## 🚀 Overview

Panduan lengkap untuk production deployment aplikasi website sekolah dengan Docker di VPS.

## 📋 Prerequisites

- VPS dengan Docker dan Docker Compose terinstall
- Domain yang sudah diarahkan ke VPS
- nginx-proxy sudah berjalan
- nginx-net network sudah dibuat
- SSL certificates configured

## 🏗️ Production Architecture

```
Internet → nginx-proxy → school-website-container
                ↓
        nginx-net network (production)
```

## 🐳 Production Setup

### 1. Production Docker Compose

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
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=https://${DOMAIN}
      - REDIS_URL=${REDIS_URL}
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

  postgres:
    image: postgres:15-alpine
    container_name: school-postgres-prod
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
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
      - redis-data:/data
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
  postgres-data:
  redis-data:

networks:
  nginx-net:
    external: true
```

### 2. Production Environment Variables

```bash
# .env.prod
# Production environment variables

# Domain Configuration
DOMAIN=your-school-domain.com
EMAIL=admin@your-school-domain.com

# Database Configuration
DB_NAME=school_db
DB_USER=school_user
DB_PASSWORD=your-secure-database-password
DATABASE_URL=postgresql://school_user:your-secure-database-password@postgres:5432/school_db

# Redis Configuration
REDIS_PASSWORD=your-secure-redis-password
REDIS_URL=redis://:your-secure-redis-password@redis:6379

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-school-domain.com

# External Services
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
GOOGLE_MAPS_API_KEY=your-google-maps-key

# Monitoring
GRAFANA_PASSWORD=your-grafana-password
PROMETHEUS_RETENTION=30d

# Security
FAIL2BAN_ENABLED=true
CROWDSEC_ENABLED=true
```

### 3. Production Nginx Configuration

```nginx
# nginx-prod.conf
worker_processes auto;
worker_cpu_affinity auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct="$upstream_connect_time" '
                    'uht="$upstream_header_time" urt="$upstream_response_time"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;
    
    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 16M;
    client_body_buffer_size 128k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Brotli compression
    brotli on;
    brotli_comp_level 6;
    brotli_types
        text/plain
        text/css
        application/json
        application/javascript
        text/xml
        application/xml
        application/xml+rss
        text/javascript;
    
    # Cache settings
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=app_cache:10m max_size=2g inactive=60m use_temp_path=off;
    proxy_cache_path /var/cache/nginx/static levels=1:2 keys_zone=static_cache:10m max_size=1g inactive=7d use_temp_path=off;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=general:10m rate=1r/s;
    
    # Upstream servers
    upstream app_backend {
        server school-website-prod:3000;
        keepalive 32;
    }
    
    # Main server
    server {
        listen 80;
        server_name _;
        
        # Redirect HTTP to HTTPS
        return 301 https://$host$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name _;
        
        # SSL configuration
        ssl_certificate /etc/nginx/certs/default.crt;
        ssl_certificate_key /etc/nginx/certs/default.key;
        
        # SSL security
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;
        ssl_session_tickets off;
        
        # OCSP stapling
        ssl_stapling on;
        ssl_stapling_verify on;
        ssl_trusted_certificate /etc/nginx/certs/chain.pem;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
        
        # Static files caching
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
            proxy_pass http://app_backend;
            proxy_cache static_cache;
            proxy_cache_valid 200 7d;
            proxy_cache_valid 404 1m;
            proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
            proxy_cache_lock on;
            add_header Cache-Control "public, immutable";
            add_header X-Cache-Status $upstream_cache_status;
            expires 7d;
        }
        
        # API caching
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://app_backend;
            proxy_cache app_cache;
            proxy_cache_valid 200 5m;
            proxy_cache_valid 404 1m;
            proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
            proxy_cache_lock on;
            add_header X-Cache-Status $upstream_cache_status;
        }
        
        # Login rate limiting
        location /signin {
            limit_req zone=login burst=3 nodelay;
            proxy_pass http://app_backend;
        }
        
        # Main application
        location / {
            limit_req zone=general burst=10 nodelay;
            proxy_pass http://app_backend;
            proxy_cache app_cache;
            proxy_cache_valid 200 1m;
            proxy_cache_valid 404 1m;
            proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
            proxy_cache_lock on;
            add_header X-Cache-Status $upstream_cache_status;
        }
        
        # Cache status endpoint
        location /cache-status {
            access_log off;
            return 200 "Cache Status: $upstream_cache_status\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## 🚀 Deployment Steps

### 1. Prepare Production Environment

```bash
# Clone repository
git clone https://github.com/sandikodev/v0-website-for-school.git
cd v0-website-for-school

# Copy production environment
cp .env.prod .env

# Edit environment variables
nano .env
```

### 2. Setup nginx-proxy

```bash
# Create nginx-proxy directory
mkdir nginx-proxy
cd nginx-proxy

# Create nginx-proxy docker-compose
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  nginx-proxy:
    image: nginxproxy/nginx-proxy:latest
    container_name: nginx-proxy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - nginx-certs:/etc/nginx/certs
      - nginx-vhost:/etc/nginx/vhost.d
      - nginx-html:/usr/share/nginx/html
    networks:
      - nginx-net
    labels:
      - "com.github.jrcs.letsencrypt_nginx_proxy_companion.nginx_proxy=true"

  letsencrypt:
    image: nginxproxy/acme-companion:latest
    container_name: nginx-letsencrypt
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - nginx-certs:/etc/nginx/certs
      - nginx-vhost:/etc/nginx/vhost.d
      - nginx-html:/usr/share/nginx/html
    environment:
      - NGINX_PROXY_CONTAINER=nginx-proxy
    networks:
      - nginx-net

volumes:
  nginx-certs:
  nginx-vhost:
  nginx-html:

networks:
  nginx-net:
    external: true
EOF

# Start nginx-proxy
docker-compose up -d
```

### 3. Deploy Application

```bash
# Build and start application
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### 4. Verify Deployment

```bash
# Check application health
curl -f http://localhost:3000/api/health

# Check SSL certificate
curl -I https://your-domain.com

# Check nginx-proxy configuration
docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf
```

## 🔧 Configuration

### Production Settings

| Setting | Value | Description |
|---------|-------|-------------|
| NODE_ENV | production | Production environment |
| Worker Processes | auto | CPU cores |
| Worker Connections | 4096 | Max connections per worker |
| Keepalive Timeout | 65s | Connection timeout |
| Gzip Level | 6 | Compression level |
| Cache Size | 2GB | Nginx cache size |
| Redis Memory | 256MB | Redis cache memory |
| Database Memory | 512MB | PostgreSQL memory |

### Security Configuration

```yaml
# Security settings
security_opt:
  - no-new-privileges:true

# Resource limits
deploy:
  resources:
    limits:
      memory: 1G
      cpus: '1.0'
    reservations:
      memory: 512M
      cpus: '0.5'

# Health checks
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## 📊 Monitoring

### Production Monitoring

```bash
# Check application status
docker-compose -f docker-compose.prod.yml ps

# Check resource usage
docker stats school-website-prod

# Check logs
docker-compose -f docker-compose.prod.yml logs -f school-website

# Check health
curl -f https://your-domain.com/api/health
```

### Performance Monitoring

```bash
# Check cache status
curl https://your-domain.com/cache-status

# Check database performance
docker exec school-postgres-prod psql -U school_user -d school_db -c "SELECT * FROM pg_stat_activity;"

# Check Redis performance
docker exec school-redis-prod redis-cli info stats
```

## 🛠️ Troubleshooting

### Common Issues

1. **Application Not Starting**
   ```bash
   # Check logs
   docker-compose -f docker-compose.prod.yml logs school-website
   
   # Check environment variables
   docker-compose -f docker-compose.prod.yml config
   
   # Check resource limits
   docker stats school-website-prod
   ```

2. **SSL Certificate Issues**
   ```bash
   # Check Let's Encrypt logs
   docker logs nginx-letsencrypt
   
   # Check domain DNS
   nslookup your-domain.com
   
   # Check SSL certificate
   openssl x509 -in /etc/nginx/certs/your-domain.com.crt -text -noout
   ```

3. **Database Connection Issues**
   ```bash
   # Check database status
   docker ps | grep postgres
   
   # Check database logs
   docker logs school-postgres-prod
   
   # Test database connection
   docker exec school-postgres-prod psql -U school_user -d school_db -c "SELECT 1;"
   ```

## 🔒 Security

### Production Security

1. **SSL/TLS**
   - Automatic SSL certificates via Let's Encrypt
   - HTTP to HTTPS redirect
   - Security headers configured
   - OCSP stapling enabled

2. **Container Security**
   - Non-root user in container
   - Resource limits configured
   - Health checks enabled
   - Security options enabled

3. **Network Security**
   - Isolated container network
   - No direct external access to app container
   - nginx-proxy handles all external traffic

## 📈 Scaling

### Horizontal Scaling

```yaml
# Scale application
services:
  school-website:
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'
```

### Load Balancing

nginx-proxy automatically handles load balancing when multiple replicas are running.

## 🎯 Best Practices

1. **Production Deployment**
   ```bash
   # Use production environment
   # Enable health checks
   # Set resource limits
   # Configure monitoring
   ```

2. **Security**
   ```bash
   # Use SSL/TLS
   # Enable security headers
   # Set up rate limiting
   # Monitor security
   ```

3. **Performance**
   ```bash
   # Enable caching
   # Use compression
   # Optimize images
   # Monitor performance
   ```

## 📞 Support

- **Production Deployment**: [docs/deployment/README.md](../deployment/README.md)
- **Issues**: [GitHub Issues](https://github.com/sandikodev/v0-website-for-school/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sandikodev/v0-website-for-school/discussions)

---

**Note**: Pastikan nginx-proxy dan nginx-net sudah berjalan sebelum menjalankan production deployment.
