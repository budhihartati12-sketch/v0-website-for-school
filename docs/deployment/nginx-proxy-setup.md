# nginx-proxy Setup Guide

## 🐳 Overview

Panduan lengkap untuk setup nginx-proxy dengan Let's Encrypt SSL certificates untuk reverse proxy ke container aplikasi.

## 📋 Prerequisites

- VPS dengan Docker dan Docker Compose terinstall
- Domain yang sudah diarahkan ke VPS
- Port 80 dan 443 terbuka di firewall

## 🏗️ nginx-proxy Architecture

```
Internet → nginx-proxy → school-website-container
                ↓
        nginx-net network
```

## 🚀 Setup nginx-proxy

### 1. Create nginx-proxy Network

```bash
# Create external network
docker network create nginx-net
```

### 2. Setup nginx-proxy with Let's Encrypt

```bash
# Create nginx-proxy directory
mkdir nginx-proxy
cd nginx-proxy

# Create docker-compose.yml for nginx-proxy
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

### 3. Verify nginx-proxy Setup

```bash
# Check containers
docker ps | grep nginx

# Check network
docker network ls | grep nginx-net

# Check logs
docker logs nginx-proxy
docker logs nginx-letsencrypt
```

## 🔧 Configuration

### Environment Variables for Applications

Set these environment variables in your application's docker-compose.yml:

```yaml
environment:
  - VIRTUAL_HOST=your-domain.com
  - VIRTUAL_PORT=3000
  - LETSENCRYPT_HOST=your-domain.com
  - LETSENCRYPT_EMAIL=admin@your-domain.com
```

### Labels for Let's Encrypt

Add these labels to your application container:

```yaml
labels:
  - "com.github.jrcs.letsencrypt_nginx_proxy_companion.nginx_proxy=true"
```

## 📊 Monitoring

### Check SSL Certificates

```bash
# List certificates
docker exec nginx-proxy ls -la /etc/nginx/certs/

# Check certificate details
docker exec nginx-proxy openssl x509 -in /etc/nginx/certs/your-domain.com.crt -text -noout
```

### Check nginx Configuration

```bash
# View generated configuration
docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf

# Test nginx configuration
docker exec nginx-proxy nginx -t
```

### View Logs

```bash
# nginx-proxy logs
docker logs nginx-proxy

# Let's Encrypt logs
docker logs nginx-letsencrypt

# Follow logs
docker logs -f nginx-proxy
```

## 🛠️ Troubleshooting

### Common Issues

1. **SSL Certificate Not Generated**
   ```bash
   # Check Let's Encrypt logs
   docker logs nginx-letsencrypt
   
   # Verify domain DNS
   nslookup your-domain.com
   
   # Check if port 80 is accessible
   curl -I http://your-domain.com
   ```

2. **Container Not Found by nginx-proxy**
   ```bash
   # Check if container is in nginx-net network
   docker inspect your-container | grep nginx-net
   
   # Check environment variables
   docker inspect your-container | grep -A 10 "Env"
   ```

3. **502 Bad Gateway**
   ```bash
   # Check if application is running
   docker ps | grep your-container
   
   # Check application logs
   docker logs your-container
   
   # Test internal connectivity
   docker exec nginx-proxy curl http://your-container:port
   ```

### Performance Optimization

1. **Enable HTTP/2**
   ```bash
   # HTTP/2 is enabled by default in nginx-proxy
   # Check if it's working
   curl -I --http2 https://your-domain.com
   ```

2. **Enable Gzip Compression**
   ```bash
   # Gzip is enabled by default
   # Check compression
   curl -H "Accept-Encoding: gzip" -I https://your-domain.com
   ```

3. **Cache Static Files**
   ```bash
   # Add cache headers to your application
   # nginx-proxy will respect these headers
   ```

## 🔒 Security

### SSL/TLS Configuration

nginx-proxy automatically configures:
- TLS 1.2 and 1.3
- Strong cipher suites
- HSTS headers
- OCSP stapling

### Security Headers

Add custom headers in your application:

```yaml
environment:
  - VIRTUAL_HOST=your-domain.com
  - VIRTUAL_PORT=3000
  - LETSENCRYPT_HOST=your-domain.com
  - LETSENCRYPT_EMAIL=admin@your-domain.com
  - VIRTUAL_PROTO=https
  - VIRTUAL_DEST=/
  - VIRTUAL_NETWORK=nginx-net
```

## 📈 Scaling

### Multiple Applications

nginx-proxy can handle multiple applications:

```yaml
# Application 1
environment:
  - VIRTUAL_HOST=app1.your-domain.com
  - VIRTUAL_PORT=3000
  - LETSENCRYPT_HOST=app1.your-domain.com

# Application 2
environment:
  - VIRTUAL_HOST=app2.your-domain.com
  - VIRTUAL_PORT=3000
  - LETSENCRYPT_HOST=app2.your-domain.com
```

### Load Balancing

nginx-proxy automatically load balances multiple containers with the same VIRTUAL_HOST:

```yaml
# Multiple replicas
deploy:
  replicas: 3
```

## 🎯 Best Practices

1. **Use External Network**
   ```bash
   # Always use external network
   networks:
     - nginx-net
   ```

2. **Health Checks**
   ```yaml
   healthcheck:
     test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
     interval: 30s
     timeout: 10s
     retries: 3
   ```

3. **Resource Limits**
   ```yaml
   deploy:
     resources:
       limits:
         memory: 512M
       reservations:
         memory: 256M
   ```

4. **Regular Updates**
   ```bash
   # Update nginx-proxy regularly
   docker-compose pull
   docker-compose up -d
   ```

## 📞 Support

- **nginx-proxy Documentation**: https://github.com/nginx-proxy/nginx-proxy
- **Let's Encrypt Companion**: https://github.com/nginx-proxy/acme-companion
- **Issues**: [GitHub Issues](https://github.com/sandikodev/v0-website-for-school/issues)

---

**Note**: Pastikan domain sudah diarahkan ke VPS sebelum menjalankan nginx-proxy.
