# Security & Hardening Guide

## 🔒 Overview

Panduan lengkap untuk security dan hardening untuk aplikasi website sekolah dengan Docker.

## 📋 Prerequisites

- Docker dan Docker Compose terinstall
- nginx-proxy sudah berjalan
- nginx-net network sudah dibuat
- Basic understanding of security concepts

## 🏗️ Security Architecture

```
Internet → nginx-proxy → school-website-container
                ↓
        nginx-net network (isolated)
```

## 🐳 Security Setup

### 1. Security Docker Compose

```yaml
# docker-compose.security.yml
version: '3.8'

services:
  fail2ban:
    image: lscr.io/linuxserver/fail2ban:latest
    container_name: school-fail2ban
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Jakarta
      - VERBOSITY=-vv
    volumes:
      - ./fail2ban:/config
      - /var/log:/var/log:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - nginx-net
    ports:
      - "8082:8080"

  crowdsec:
    image: crowdsecurity/crowdsec:latest
    container_name: school-crowdsec
    restart: unless-stopped
    environment:
      - COLLECTIONS=crowdsecurity/nginx
      - DISABLE_AGENT=true
      - DISABLE_LOCAL_API=true
    volumes:
      - ./crowdsec:/etc/crowdsec
      - /var/log:/var/log:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - nginx-net

  crowdsec-firewall:
    image: crowdsecurity/cs-firewall-bouncer:latest
    container_name: school-crowdsec-firewall
    restart: unless-stopped
    environment:
      - CROWDSEC_BOUNCER_KEY=${CROWDSEC_BOUNCER_KEY}
      - CROWDSEC_AGENT_HOST=crowdsec
      - CROWDSEC_AGENT_PORT=8080
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - nginx-net
    depends_on:
      - crowdsec

volumes:
  fail2ban-data:
  crowdsec-data:

networks:
  nginx-net:
    external: true
```

### 2. Fail2Ban Configuration

```ini
# fail2ban/jail.local
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
backend = systemd

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 3

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 10

[nginx-badbots]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-noscript]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 6

[nginx-noproxy]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-nohome]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-nophp]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-nosql]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-noxmlrpc]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-nowp]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-nowpadmin]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-nowpcontent]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-nowpfeed]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-nowpcomment]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-nowpsearch]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-nowpadmin]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-nowpcontent]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-nowpfeed]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-nowpcomment]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-nowpsearch]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
```

### 3. CrowdSec Configuration

```yaml
# crowdsec/config.yaml
api:
  server:
    listen_uri: 127.0.0.1:8080
    profiles_path: /etc/crowdsec/profiles/
  client:
    insecure_skip_verify: true

common:
  log_level: info
  log_media: stdout
  log_dir: /var/log/crowdsec
  working_dir: /etc/crowdsec/data

db_config:
  type: sqlite
  db_path: /etc/crowdsec/data/crowdsec.db

dispatcher:
  name: crowdsec
  profiles_path: /etc/crowdsec/profiles/

prometheus:
  enabled: true
  listen_addr: 127.0.0.1:6060

plugin_config:
  user: root
  group: root
```

## 🚀 Deployment Steps

### 1. Setup Security Environment

```bash
# Create security directories
mkdir -p fail2ban crowdsec

# Copy configuration files
cp fail2ban/* ./
cp crowdsec/* ./
```

### 2. Configure Environment Variables

```bash
# Add to your .env file
CROWDSEC_BOUNCER_KEY=your-crowdsec-bouncer-key
```

### 3. Start Security Services

```bash
# Start security services
docker-compose -f docker-compose.security.yml up -d

# Check status
docker-compose -f docker-compose.security.yml ps
```

### 4. Verify Security

```bash
# Check Fail2Ban status
docker exec school-fail2ban fail2ban-client status

# Check CrowdSec status
docker exec school-crowdsec cscli metrics
```

## 🔧 Configuration

### Security Headers

```nginx
# nginx.conf
server {
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
}
```

### Rate Limiting

```nginx
# nginx.conf
http {
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general:10m rate=1r/s;
    
    server {
        # Login rate limiting
        location /signin {
            limit_req zone=login burst=3 nodelay;
            proxy_pass http://school-website:3000;
        }
        
        # API rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://school-website:3000;
        }
        
        # General rate limiting
        location / {
            limit_req zone=general burst=10 nodelay;
            proxy_pass http://school-website:3000;
        }
    }
}
```

### SSL/TLS Configuration

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    
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
}
```

## 📊 Monitoring

### Security Monitoring

```bash
# Check Fail2Ban logs
docker logs school-fail2ban

# Check CrowdSec logs
docker logs school-crowdsec

# Check banned IPs
docker exec school-fail2ban fail2ban-client status nginx-http-auth
```

### Security Metrics

```bash
# Check security metrics
docker exec school-crowdsec cscli metrics

# Check firewall rules
docker exec school-crowdsec-firewall iptables -L
```

## 🛠️ Troubleshooting

### Common Issues

1. **Fail2Ban Not Working**
   ```bash
   # Check logs
   docker logs school-fail2ban
   
   # Check configuration
   docker exec school-fail2ban fail2ban-client -t
   ```

2. **CrowdSec Not Detecting Threats**
   ```bash
   # Check logs
   docker logs school-crowdsec
   
   # Check collections
   docker exec school-crowdsec cscli collections list
   ```

3. **Rate Limiting Too Strict**
   ```bash
   # Check nginx logs
   docker logs nginx-proxy
   
   # Adjust rate limits
   # Edit nginx.conf
   ```

### Performance Issues

1. **High CPU Usage**
   ```bash
   # Check resource usage
   docker stats school-fail2ban
   docker stats school-crowdsec
   ```

2. **Memory Issues**
   ```bash
   # Check memory usage
   docker stats school-fail2ban
   docker stats school-crowdsec
   ```

## 🔒 Security Best Practices

### Container Security

1. **Non-root User**
   ```dockerfile
   # Dockerfile
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   USER nextjs
   ```

2. **Read-only Filesystem**
   ```yaml
   # docker-compose.yml
   security_opt:
     - no-new-privileges:true
   read_only: true
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

### Network Security

1. **Network Isolation**
   ```yaml
   # docker-compose.yml
   networks:
     - nginx-net
   ```

2. **No External Ports**
   ```yaml
   # docker-compose.yml
   # Remove ports section for internal services
   ```

### Application Security

1. **Input Validation**
   ```typescript
   // lib/validation.ts
   import { z } from 'zod'
   
   export const userSchema = z.object({
     username: z.string().min(3).max(50),
     email: z.string().email(),
     password: z.string().min(8)
   })
   ```

2. **SQL Injection Prevention**
   ```typescript
   // lib/database.ts
   import { sql } from '@vercel/postgres'
   
   export async function getUser(id: string) {
     return await sql`
       SELECT * FROM users 
       WHERE id = ${id}
     `
   }
   ```

3. **XSS Prevention**
   ```typescript
   // lib/sanitize.ts
   import DOMPurify from 'isomorphic-dompurify'
   
   export function sanitizeHtml(html: string) {
     return DOMPurify.sanitize(html)
   }
   ```

## 📈 Security Monitoring

### Security Dashboard

```json
{
  "dashboard": {
    "id": null,
    "title": "Security Overview",
    "tags": ["security"],
    "panels": [
      {
        "title": "Failed Login Attempts",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(failed_login_attempts_total[5m])",
            "legendFormat": "Failed Logins"
          }
        ]
      },
      {
        "title": "Banned IPs",
        "type": "stat",
        "targets": [
          {
            "expr": "banned_ips_total",
            "legendFormat": "Banned IPs"
          }
        ]
      }
    ]
  }
}
```

### Security Alerts

```yaml
# alert_rules.yml
groups:
  - name: security
    rules:
      - alert: HighFailedLogins
        expr: rate(failed_login_attempts_total[5m]) > 10
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "High number of failed login attempts"
          
      - alert: SuspiciousActivity
        expr: rate(suspicious_requests_total[5m]) > 5
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Suspicious activity detected"
```

## 🎯 Security Checklist

### Pre-deployment

- [ ] SSL certificates configured
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Fail2Ban configured
- [ ] CrowdSec configured
- [ ] Firewall rules set
- [ ] Container security hardened
- [ ] Network isolation configured

### Post-deployment

- [ ] Security monitoring enabled
- [ ] Logs being collected
- [ ] Alerts configured
- [ ] Backup procedures tested
- [ ] Incident response plan ready
- [ ] Security updates scheduled
- [ ] Access controls verified
- [ ] Penetration testing completed

## 📞 Support

- **Fail2Ban Documentation**: https://www.fail2ban.org/
- **CrowdSec Documentation**: https://docs.crowdsec.net/
- **Nginx Security**: https://nginx.org/en/docs/
- **Issues**: [GitHub Issues](https://github.com/sandikodev/v0-website-for-school/issues)

---

**Note**: Pastikan nginx-net network sudah dibuat sebelum menjalankan security services.
