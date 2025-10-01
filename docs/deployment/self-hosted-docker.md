# Self-Hosted Docker Deployment Guide

## 🐳 Overview

Panduan lengkap untuk menjalankan aplikasi website sekolah secara self-hosted menggunakan Docker dengan nginx-proxy sebagai reverse proxy.

## 📋 Prerequisites

- VPS dengan Docker dan Docker Compose terinstall
- Domain yang sudah diarahkan ke VPS
- nginx-proxy container yang sudah berjalan
- Container network `nginx-net` sudah dibuat

## 🏗️ Architecture

```
Internet → nginx-proxy → school-website-container
                ↓
        nginx-net network
```

## 📁 Project Structure

```
school-website/
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── .env.example
└── docs/deployment/
    └── self-hosted-docker.md
```

## 🐳 Docker Configuration

### 1. Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  school-website:
    build: .
    container_name: school-website
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

networks:
  nginx-net:
    external: true
```

### 3. nginx.conf

```nginx
# nginx.conf
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
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    
    # Proxy to Next.js app
    location / {
        proxy_pass http://school-website:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Static files caching
    location /_next/static/ {
        proxy_pass http://school-website:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Uploads
    location /uploads/ {
        proxy_pass http://school-website:3000;
        proxy_cache_valid 200 1d;
        add_header Cache-Control "public";
    }
}
```

### 4. .env.example

```bash
# .env.example
# Copy to .env and fill in your values

# Domain Configuration
DOMAIN=your-school-domain.com
EMAIL=admin@your-school-domain.com

# Database
DATABASE_URL=postgresql://username:password@db-host:5432/school_db

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-school-domain.com

# Optional: External Services
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
GOOGLE_MAPS_API_KEY=your-google-maps-key
```

## 🚀 Deployment Steps

### 1. Prepare Environment

```bash
# Clone repository
git clone https://github.com/sandikodev/v0-website-for-school.git
cd v0-website-for-school

# Copy environment file
cp .env.example .env
# Edit .env with your values
nano .env
```

### 2. Build and Deploy

```bash
# Build the application
docker-compose build

# Start the application
docker-compose up -d

# Check logs
docker-compose logs -f school-website
```

### 3. Verify Deployment

```bash
# Check container status
docker-compose ps

# Check nginx-proxy configuration
docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf

# Test health endpoint
curl -f http://localhost:3000/api/health
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DOMAIN` | Your domain name | ✅ |
| `EMAIL` | Email for Let's Encrypt | ✅ |
| `DATABASE_URL` | Database connection string | ✅ |
| `NEXTAUTH_SECRET` | Secret for authentication | ✅ |
| `NEXTAUTH_URL` | Full URL of your application | ✅ |

### nginx-proxy Labels

The application uses these labels for nginx-proxy:

- `VIRTUAL_HOST`: Domain name
- `VIRTUAL_PORT`: Port the app runs on (3000)
- `LETSENCRYPT_HOST`: Domain for SSL certificate
- `LETSENCRYPT_EMAIL`: Email for Let's Encrypt

## 📊 Monitoring

### Health Checks

The application includes health checks:

```bash
# Check application health
curl -f http://localhost:3000/api/health

# Check container health
docker inspect school-website --format='{{.State.Health.Status}}'
```

### Logs

```bash
# Application logs
docker-compose logs -f school-website

# nginx-proxy logs
docker logs nginx-proxy

# System logs
journalctl -u docker -f
```

## 🔄 Updates

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Update Dependencies

```bash
# Update package.json
npm update

# Rebuild with new dependencies
docker-compose build --no-cache
docker-compose up -d
```

## 🛠️ Troubleshooting

### Common Issues

1. **Container won't start**
   ```bash
   # Check logs
   docker-compose logs school-website
   
   # Check environment variables
   docker-compose config
   ```

2. **SSL certificate issues**
   ```bash
   # Check nginx-proxy logs
   docker logs nginx-proxy
   
   # Verify domain DNS
   nslookup your-domain.com
   ```

3. **Database connection issues**
   ```bash
   # Check database container
   docker ps | grep db
   
   # Test connection
   docker exec school-website ping db-container
   ```

### Performance Optimization

1. **Enable caching**
   ```bash
   # Add Redis for caching
   docker-compose up -d redis
   ```

2. **Optimize images**
   ```bash
   # Use multi-stage build
   docker-compose build --no-cache
   ```

3. **Monitor resources**
   ```bash
   # Check resource usage
   docker stats school-website
   ```

## 🔒 Security

### SSL/TLS

- Automatic SSL certificates via Let's Encrypt
- HTTP to HTTPS redirect
- Security headers configured

### Container Security

- Non-root user in container
- Read-only filesystem where possible
- Resource limits configured

### Network Security

- Isolated container network
- No direct external access to app container
- nginx-proxy handles all external traffic

## 📈 Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  school-website:
    # ... existing config
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### Load Balancing

nginx-proxy automatically handles load balancing when multiple replicas are running.

## 🎯 Best Practices

1. **Regular Backups**
   ```bash
   # Backup database
   docker exec db-container pg_dump -U username database > backup.sql
   
   # Backup uploads
   tar -czf uploads-backup.tar.gz uploads/
   ```

2. **Monitor Resources**
   ```bash
   # Set up monitoring
   docker-compose up -d prometheus grafana
   ```

3. **Update Regularly**
   ```bash
   # Schedule updates
   crontab -e
   # Add: 0 2 * * 0 cd /path/to/app && docker-compose pull && docker-compose up -d
   ```

## 📞 Support

- **Documentation**: [docs/README.md](../README.md)
- **Issues**: [GitHub Issues](https://github.com/sandikodev/v0-website-for-school/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sandikodev/v0-website-for-school/discussions)

---

**Note**: Pastikan nginx-proxy dan nginx-net sudah berjalan sebelum menjalankan aplikasi ini.
