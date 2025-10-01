# Deployment Documentation

## 🚀 Overview

Dokumentasi lengkap untuk deployment aplikasi website sekolah dengan Docker di VPS.

## 📋 Prerequisites

- VPS dengan Docker dan Docker Compose terinstall
- Domain yang sudah diarahkan ke VPS
- Basic understanding of Docker dan nginx-proxy

## 🏗️ Architecture

```
Internet → nginx-proxy → school-website-container
                ↓
        nginx-net network
```

## 📚 Documentation

### 1. Deployment Strategy
- [Deployment Strategy Guide](./deployment-strategy.md) - **NEW** Comprehensive deployment strategy with multiple environments

### 2. Environment-Specific Deployment
- [Development Deployment](./development-deployment.md) - **NEW** Local development deployment guide
- [Staging Deployment](./staging-deployment.md) - **NEW** Staging deployment for testing
- [Production Deployment](./production-deployment.md) - Production deployment guide

### 3. Self-Hosted Docker
- [Self-Hosted Docker Guide](./self-hosted-docker.md) - Panduan lengkap untuk menjalankan aplikasi secara self-hosted dengan nginx-proxy

### 4. Infrastructure Components
- [nginx-proxy Setup Guide](./nginx-proxy-setup.md) - Setup nginx-proxy dengan Let's Encrypt SSL certificates
- [Database Setup](./database-setup.md) - Setup PostgreSQL database dengan Docker
- [Redis Caching](./redis-setup.md) - Setup Redis sebagai caching layer

### 5. Monitoring & Logging
- [Monitoring & Logging Guide](./monitoring-logging.md) - Setup Prometheus, Grafana, dan Loki untuk monitoring

### 6. Backup & Disaster Recovery
- [Backup & Disaster Recovery Guide](./backup-disaster-recovery.md) - Setup backup dan disaster recovery procedures

### 7. Security & Hardening
- [Security & Hardening Guide](./security-hardening.md) - Setup Fail2Ban, CrowdSec, dan security hardening

### 8. Performance Optimization
- [Performance Optimization Guide](./performance-optimization.md) - Setup caching, compression, dan performance optimization

### 9. Maintenance & Updates
- [Maintenance & Updates Guide](./maintenance-updates.md) - Setup maintenance dan update procedures

### 10. Production Deployment
- [Production Deployment Guide](./production-deployment.md) - Panduan lengkap untuk production deployment

## 🚀 Quick Start

### 1. Setup nginx-proxy

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

### 2. Deploy Application

```bash
# Clone repository
git clone https://github.com/sandikodev/v0-website-for-school.git
cd v0-website-for-school

# Copy environment file
cp docker.env.example .env

# Edit environment variables
nano .env

# Build and start application
docker-compose build
docker-compose up -d

# Check status
docker-compose ps
```

### 3. Verify Deployment

```bash
# Check application health
curl -f http://localhost:3000/api/health

# Check SSL certificate
curl -I https://your-domain.com

# Check nginx-proxy configuration
docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf
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