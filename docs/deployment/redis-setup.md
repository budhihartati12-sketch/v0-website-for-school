# Redis Caching Setup Guide

## 🚀 Overview

Panduan lengkap untuk setup Redis sebagai caching layer untuk aplikasi website sekolah dengan Docker.

## 📋 Prerequisites

- Docker dan Docker Compose terinstall
- nginx-proxy sudah berjalan
- nginx-net network sudah dibuat

## 🏗️ Redis Architecture

```
school-website → redis-container
        ↓
    nginx-net network
```

## 🐳 Redis Setup

### 1. Redis Docker Compose

```yaml
# docker-compose.redis.yml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    container_name: school-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
      - ./redis.conf:/usr/local/etc/redis/redis.conf
    networks:
      - nginx-net
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  redis-commander:
    image: rediscommander/redis-commander:latest
    container_name: school-redis-commander
    restart: unless-stopped
    environment:
      - REDIS_HOSTS=local:redis:6379:0:${REDIS_PASSWORD}
    networks:
      - nginx-net
    ports:
      - "8081:8081"
    depends_on:
      - redis

volumes:
  redis-data:

networks:
  nginx-net:
    external: true
```

### 2. Redis Configuration

```conf
# redis.conf
# Redis configuration for school website

# Network
bind 0.0.0.0
port 6379
timeout 0
tcp-keepalive 300

# General
daemonize no
supervised no
pidfile /var/run/redis_6379.pid
loglevel notice
logfile ""

# Snapshotting
save 900 1
save 300 10
save 60 10000

# Security
requirepass your-redis-password

# Memory management
maxmemory 256mb
maxmemory-policy allkeys-lru

# Append only file
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# Slow log
slowlog-log-slower-than 10000
slowlog-max-len 128

# Latency monitoring
latency-monitor-threshold 100
```

### 3. Environment Variables

```bash
# Add to your .env file
REDIS_PASSWORD=your-redis-password
REDIS_URL=redis://:your-redis-password@redis:6379
```

## 🚀 Deployment Steps

### 1. Start Redis

```bash
# Start Redis services
docker-compose -f docker-compose.redis.yml up -d

# Check status
docker-compose -f docker-compose.redis.yml ps
```

### 2. Verify Redis

```bash
# Check Redis logs
docker logs school-redis

# Test connection
docker exec school-redis redis-cli -a your-redis-password ping

# Check Redis info
docker exec school-redis redis-cli -a your-redis-password info
```

### 3. Access Redis Commander

```bash
# Access Redis Commander at http://your-vps-ip:8081
# No authentication required for web interface
```

## 🔧 Configuration

### Redis Settings

| Setting | Value | Description |
|---------|-------|-------------|
| Port | 6379 | Redis port |
| Password | ${REDIS_PASSWORD} | Authentication password |
| Max Memory | 256mb | Memory limit |
| Policy | allkeys-lru | Eviction policy |
| Persistence | AOF | Append only file |

### Application Integration

```typescript
// lib/redis.ts
import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
})

export default redis
```

### Caching Strategy

```typescript
// lib/cache.ts
import redis from './redis'

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

### Health Checks

```bash
# Check Redis health
docker exec school-redis redis-cli -a your-redis-password ping

# Check container health
docker inspect school-redis --format='{{.State.Health.Status}}'
```

### Performance Monitoring

```bash
# Check Redis info
docker exec school-redis redis-cli -a your-redis-password info

# Check memory usage
docker exec school-redis redis-cli -a your-redis-password info memory

# Check connected clients
docker exec school-redis redis-cli -a your-redis-password info clients

# Check slow log
docker exec school-redis redis-cli -a your-redis-password slowlog get 10
```

### Redis Commander

Redis Commander provides a web interface for:
- Viewing all keys and values
- Monitoring Redis performance
- Executing Redis commands
- Managing Redis configuration

## 🔄 Backups

### Automated Backups

```bash
# Create backup script
cat > backup-redis.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/redis"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="redis_${DATE}.rdb"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
docker exec school-redis redis-cli -a your-redis-password BGSAVE

# Wait for backup to complete
while [ $(docker exec school-redis redis-cli -a your-redis-password LASTSAVE) -eq $(docker exec school-redis redis-cli -a your-redis-password LASTSAVE) ]; do
  sleep 1
done

# Copy backup file
docker cp school-redis:/data/dump.rdb $BACKUP_DIR/$BACKUP_FILE

# Compress backup
gzip $BACKUP_DIR/$BACKUP_FILE

# Remove old backups (keep last 7 days)
find $BACKUP_DIR -name "redis_*.rdb.gz" -mtime +7 -delete

echo "Redis backup created: $BACKUP_DIR/$BACKUP_FILE.gz"
EOF

chmod +x backup-redis.sh

# Schedule daily backups
crontab -e
# Add: 0 3 * * * /path/to/backup-redis.sh
```

### Restore from Backup

```bash
# Stop Redis
docker-compose -f docker-compose.redis.yml stop redis

# Copy backup file
docker cp backup.rdb school-redis:/data/dump.rdb

# Start Redis
docker-compose -f docker-compose.redis.yml start redis
```

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Refused**
   ```bash
   # Check if container is running
   docker ps | grep redis
   
   # Check logs
   docker logs school-redis
   
   # Check network
   docker network inspect nginx-net
   ```

2. **Authentication Failed**
   ```bash
   # Check password
   docker exec school-redis redis-cli -a your-redis-password ping
   
   # Check configuration
   docker exec school-redis cat /usr/local/etc/redis/redis.conf | grep requirepass
   ```

3. **Memory Issues**
   ```bash
   # Check memory usage
   docker exec school-redis redis-cli -a your-redis-password info memory
   
   # Check eviction policy
   docker exec school-redis redis-cli -a your-redis-password config get maxmemory-policy
   ```

### Performance Issues

1. **Slow Operations**
   ```bash
   # Check slow log
   docker exec school-redis redis-cli -a your-redis-password slowlog get 10
   
   # Check latency
   docker exec school-redis redis-cli -a your-redis-password latency latest
   ```

2. **High Memory Usage**
   ```bash
   # Check memory usage
   docker exec school-redis redis-cli -a your-redis-password info memory
   
   # Check key count
   docker exec school-redis redis-cli -a your-redis-password dbsize
   ```

## 🔒 Security

### Redis Security

1. **Strong Passwords**
   ```bash
   # Generate secure password
   openssl rand -base64 32
   ```

2. **Network Isolation**
   ```yaml
   # Only expose to nginx-net
   networks:
     - nginx-net
   ```

3. **Disable Dangerous Commands**
   ```conf
   # Add to redis.conf
   rename-command FLUSHDB ""
   rename-command FLUSHALL ""
   rename-command CONFIG ""
   rename-command EVAL ""
   ```

### Access Control

```conf
# redis.conf
# Disable dangerous commands
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG ""
rename-command EVAL ""

# Set password
requirepass your-secure-password

# Bind to specific interface
bind 127.0.0.1
```

## 📈 Scaling

### Redis Cluster

```yaml
# docker-compose.redis-cluster.yml
version: '3.8'

services:
  redis-node-1:
    image: redis:7-alpine
    container_name: redis-node-1
    command: redis-server --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000 --appendonly yes --requirepass ${REDIS_PASSWORD}
    networks:
      - nginx-net

  redis-node-2:
    image: redis:7-alpine
    container_name: redis-node-2
    command: redis-server --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000 --appendonly yes --requirepass ${REDIS_PASSWORD}
    networks:
      - nginx-net

  redis-node-3:
    image: redis:7-alpine
    container_name: redis-node-3
    command: redis-server --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000 --appendonly yes --requirepass ${REDIS_PASSWORD}
    networks:
      - nginx-net
```

## 🎯 Best Practices

1. **Cache Strategy**
   ```typescript
   // Cache frequently accessed data
   // Set appropriate TTL
   // Use cache invalidation
   // Monitor cache hit ratio
   ```

2. **Memory Management**
   ```bash
   # Set appropriate maxmemory
   # Use eviction policies
   # Monitor memory usage
   # Regular cleanup
   ```

3. **Security**
   ```bash
   # Use strong passwords
   # Disable dangerous commands
   # Network isolation
   # Regular updates
   ```

## 📞 Support

- **Redis Documentation**: https://redis.io/documentation
- **Redis Commander**: https://github.com/joeferner/redis-commander
- **Issues**: [GitHub Issues](https://github.com/sandikodev/v0-website-for-school/issues)

---

**Note**: Pastikan nginx-net network sudah dibuat sebelum menjalankan Redis services.
