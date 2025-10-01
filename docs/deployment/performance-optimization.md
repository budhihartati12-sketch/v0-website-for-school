# Performance Optimization Guide

## ⚡ Overview

Panduan lengkap untuk performance optimization untuk aplikasi website sekolah dengan Docker.

## 📋 Prerequisites

- Docker dan Docker Compose terinstall
- nginx-proxy sudah berjalan
- nginx-net network sudah dibuat
- Basic understanding of performance concepts

## 🏗️ Performance Architecture

```
Internet → nginx-proxy → school-website-container
                ↓
        nginx-net network (optimized)
```

## 🐳 Performance Setup

### 1. Performance Docker Compose

```yaml
# docker-compose.performance.yml
version: '3.8'

services:
  nginx-cache:
    image: nginx:alpine
    container_name: school-nginx-cache
    restart: unless-stopped
    volumes:
      - ./nginx-cache.conf:/etc/nginx/nginx.conf
      - nginx-cache-data:/var/cache/nginx
    networks:
      - nginx-net
    ports:
      - "8083:80"

  redis-cache:
    image: redis:7-alpine
    container_name: school-redis-cache
    restart: unless-stopped
    command: redis-server --maxmemory 128mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-cache-data:/data
    networks:
      - nginx-net
    ports:
      - "6380:6379"

  memcached:
    image: memcached:alpine
    container_name: school-memcached
    restart: unless-stopped
    command: memcached -m 64 -I 1m
    networks:
      - nginx-net
    ports:
      - "11211:11211"

volumes:
  nginx-cache-data:
  redis-cache-data:

networks:
  nginx-net:
    external: true
```

### 2. Nginx Cache Configuration

```nginx
# nginx-cache.conf
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
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;
    
    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 16M;
    
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
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=app_cache:10m max_size=1g inactive=60m use_temp_path=off;
    proxy_cache_path /var/cache/nginx/static levels=1:2 keys_zone=static_cache:10m max_size=500m inactive=7d use_temp_path=off;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    
    # Upstream servers
    upstream app_backend {
        server school-website:3000;
        keepalive 32;
    }
    
    upstream cache_backend {
        server redis-cache:6379;
        keepalive 32;
    }
    
    # Main server
    server {
        listen 80;
        server_name _;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        
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

### 3. Application Performance Configuration

```typescript
// lib/performance.ts
import { NextResponse } from 'next/server'

export function addPerformanceHeaders(response: NextResponse) {
  // Cache control headers
  response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600')
  
  // Performance headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  return response
}

export function addStaticHeaders(response: NextResponse) {
  // Static file headers
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  response.headers.set('Expires', new Date(Date.now() + 31536000000).toUTCString())
  
  return response
}
```

## 🚀 Deployment Steps

### 1. Setup Performance Environment

```bash
# Create performance directories
mkdir -p performance-configs

# Copy configuration files
cp performance-configs/* ./
```

### 2. Start Performance Services

```bash
# Start performance services
docker-compose -f docker-compose.performance.yml up -d

# Check status
docker-compose -f docker-compose.performance.yml ps
```

### 3. Verify Performance

```bash
# Check cache status
curl http://localhost:8083/cache-status

# Check Redis cache
docker exec school-redis-cache redis-cli ping

# Check Memcached
docker exec school-memcached memcached-tool localhost:11211 stats
```

## 🔧 Configuration

### Performance Settings

| Setting | Value | Description |
|---------|-------|-------------|
| Worker Processes | auto | CPU cores |
| Worker Connections | 4096 | Max connections per worker |
| Keepalive Timeout | 65s | Connection timeout |
| Gzip Level | 6 | Compression level |
| Cache Size | 1GB | Nginx cache size |
| Redis Memory | 128MB | Redis cache memory |

### Application Optimization

```typescript
// lib/cache.ts
import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis-cache',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
})

export class CacheService {
  // Set cache with TTL
  static async set(key: string, value: any, ttl: number = 3600) {
    await redis.setex(key, ttl, JSON.stringify(value))
  }

  // Get cache
  static async get(key: string) {
    const value = await redis.get(key)
    return value ? JSON.parse(value) : null
  }

  // Delete cache
  static async delete(key: string) {
    await redis.del(key)
  }

  // Clear all cache
  static async clear() {
    await redis.flushall()
  }

  // Get cache keys by pattern
  static async getKeys(pattern: string) {
    return await redis.keys(pattern)
  }
}
```

## 📊 Monitoring

### Performance Metrics

```bash
# Check nginx cache status
curl http://localhost:8083/cache-status

# Check Redis performance
docker exec school-redis-cache redis-cli info stats

# Check Memcached performance
docker exec school-memcached memcached-tool localhost:11211 stats

# Check container resources
docker stats school-nginx-cache school-redis-cache school-memcached
```

### Performance Dashboard

```json
{
  "dashboard": {
    "id": null,
    "title": "Performance Overview",
    "tags": ["performance"],
    "panels": [
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Cache Hit Ratio",
        "type": "stat",
        "targets": [
          {
            "expr": "rate(cache_hits_total[5m]) / rate(cache_requests_total[5m]) * 100",
            "legendFormat": "Cache Hit Ratio %"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "container_memory_usage_bytes{name=~\"school-.*\"}",
            "legendFormat": "{{name}}"
          }
        ]
      }
    ]
  }
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **High Memory Usage**
   ```bash
   # Check memory usage
   docker stats school-nginx-cache
   
   # Check cache size
   du -sh /var/cache/nginx/*
   ```

2. **Slow Response Times**
   ```bash
   # Check nginx logs
   docker logs school-nginx-cache
   
   # Check cache hit ratio
   curl http://localhost:8083/cache-status
   ```

3. **Cache Not Working**
   ```bash
   # Check Redis connection
   docker exec school-redis-cache redis-cli ping
   
   # Check cache configuration
   docker exec school-nginx-cache nginx -t
   ```

### Performance Issues

1. **High CPU Usage**
   ```bash
   # Check CPU usage
   docker stats school-nginx-cache
   
   # Check worker processes
   docker exec school-nginx-cache ps aux
   ```

2. **Disk I/O Issues**
   ```bash
   # Check disk usage
   df -h
   
   # Check I/O stats
   iostat -x 1
   ```

## 🔒 Security

### Performance Security

1. **Rate Limiting**
   ```nginx
   # nginx.conf
   limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
   limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
   ```

2. **Cache Security**
   ```nginx
   # nginx.conf
   proxy_cache_key "$scheme$request_method$host$request_uri";
   proxy_cache_valid 200 1m;
   proxy_cache_valid 404 1m;
   ```

3. **Resource Limits**
   ```yaml
   # docker-compose.yml
   deploy:
     resources:
       limits:
         memory: 512M
         cpus: '0.5'
   ```

## 📈 Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  school-website:
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### Load Balancing

```nginx
# nginx.conf
upstream app_backend {
    server school-website-1:3000;
    server school-website-2:3000;
    server school-website-3:3000;
    keepalive 32;
}
```

### Caching Strategy

```typescript
// lib/cache-strategy.ts
export class CacheStrategy {
  // Page cache
  static async cachePage(url: string, content: string, ttl: number = 3600) {
    await CacheService.set(`page:${url}`, content, ttl)
  }

  // API cache
  static async cacheAPI(endpoint: string, data: any, ttl: number = 300) {
    await CacheService.set(`api:${endpoint}`, data, ttl)
  }

  // User cache
  static async cacheUser(userId: string, userData: any, ttl: number = 1800) {
    await CacheService.set(`user:${userId}`, userData, ttl)
  }

  // Session cache
  static async cacheSession(sessionId: string, sessionData: any, ttl: number = 3600) {
    await CacheService.set(`session:${sessionId}`, sessionData, ttl)
  }
}
```

## 🎯 Best Practices

1. **Caching Strategy**
   ```bash
   # Cache static files for 7 days
   # Cache API responses for 5 minutes
   # Cache user data for 30 minutes
   # Cache sessions for 1 hour
   ```

2. **Compression**
   ```bash
   # Enable Gzip compression
   # Enable Brotli compression
   # Compress all text-based content
   # Use appropriate compression levels
   ```

3. **Resource Optimization**
   ```bash
   # Optimize images
   # Minify CSS and JavaScript
   # Use CDN for static assets
   # Implement lazy loading
   ```

## 📞 Support

- **Nginx Performance**: https://nginx.org/en/docs/
- **Redis Performance**: https://redis.io/docs/management/optimization/
- **Docker Performance**: https://docs.docker.com/config/containers/resource_constraints/
- **Issues**: [GitHub Issues](https://github.com/sandikodev/v0-website-for-school/issues)

---

**Note**: Pastikan nginx-net network sudah dibuat sebelum menjalankan performance services.
