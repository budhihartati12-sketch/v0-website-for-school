# Nginx Reverse Proxy Integration

## 🔧 **Setup yang Sudah Ada**

### **Nginx Proxy Container**
- **Container Name**: `nginx-proxy`
- **Image**: `nginx:stable-alpine`
- **Ports**: `80:80`, `443:443`
- **Network**: `nginx-net` (external)
- **Status**: ✅ Running (Up 3 hours)

### **Network Configuration**
```bash
# Network yang sudah ada
nginx-net (bridge) - External network untuk reverse proxy
```

## 📁 **Konfigurasi Nginx**

### **Lokasi Konfigurasi**
```
../../reverse-proxy/
├── docker-compose.yml          # Nginx proxy container
├── nginx/
│   ├── nginx.conf              # Main nginx config
│   └── conf.d/                 # Virtual host configurations
│       ├── school-website-dev.conf      # Development
│       ├── school-website-staging.conf # Staging  
│       └── school-website-prod.conf     # Production
```

### **Domain Configuration**
- **Production**: `showcase.konxc.space/websekolah`
- **Development**: `showcase.konxc.space/websekolah-dev`
- **Staging**: `showcase.konxc.space/websekolah-staging`

## 🐳 **Docker Compose Integration**

### **Development Environment**
```yaml
services:
  school-website:
    container_name: school-website-dev
    networks:
      - dev-network      # Internal services
      - nginx-net        # External nginx proxy
```

### **Staging Environment**
```yaml
services:
  school-website:
    container_name: school-website-staging
    environment:
      - VIRTUAL_HOST=${DOMAIN}
      - VIRTUAL_PORT=3000
    networks:
      - nginx-net
```

### **Production Environment**
```yaml
services:
  school-website:
    container_name: school-website-prod
    environment:
      - VIRTUAL_HOST=${DOMAIN}
      - VIRTUAL_PORT=3000
      - LETSENCRYPT_HOST=${DOMAIN}
      - LETSENCRYPT_EMAIL=${EMAIL}
    networks:
      - nginx-net
```

## 🔒 **SSL/TLS Configuration**

### **Let's Encrypt Integration**
- **Challenge Path**: `/.well-known/acme-challenge/`
- **Certificate Storage**: `/etc/letsencrypt`
- **Automatic Renewal**: Built-in dengan nginx-proxy

### **Security Headers (Production)**
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

## 🚀 **Deployment Process**

### **1. Development**
```bash
cd docker/dev
docker-compose -f docker-compose.dev.yml up -d
```
- **Access**: `https://showcase.konxc.space/websekolah-dev`
- **Features**: Hot reload, debugging enabled

### **2. Staging**
```bash
cd docker/staging
docker-compose -f docker-compose.staging.yml up -d
```
- **Access**: `https://showcase.konxc.space/websekolah-staging`
- **Features**: Production build, SSL enabled

### **3. Production**
```bash
cd docker/prod
docker-compose -f docker-compose.prod.yml up -d
```
- **Access**: `https://showcase.konxc.space/websekolah`
- **Features**: Production build, SSL, security headers, monitoring

## 🔍 **Monitoring & Health Checks**

### **Health Check Endpoint**
```bash
curl -f http://localhost:3000/api/health
```

### **Container Health Status**
```bash
docker ps --filter "name=school-website"
```

## 📊 **Performance Optimization**

### **Static Files Caching**
```nginx
location ~ ^/_next/static/ {
    proxy_cache_valid 200 1y;
    add_header Cache-Control "public, immutable";
}
```

### **API Routes Optimization**
```nginx
location ~ ^/api/ {
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}
```

## 🛠️ **Troubleshooting**

### **Check Nginx Proxy Status**
```bash
docker logs nginx-proxy
```

### **Test Domain Resolution**
```bash
curl -H "Host: school-dev.smauiiyk.sch.id" http://localhost
```

### **Check Network Connectivity**
```bash
docker network inspect nginx-net
```

## 📝 **Environment Variables**

### **Required for Staging/Production**
```bash
DOMAIN=school.smauiiyk.sch.id
EMAIL=admin@smauiiyk.sch.id
DATABASE_URL=postgresql://user:pass@postgres:5432/db
REDIS_URL=redis://redis:6379
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://school.smauiiyk.sch.id
```

## ✅ **Integration Status**

- ✅ **Nginx Proxy**: Running and configured
- ✅ **Network**: nginx-net external network available
- ✅ **SSL**: Let's Encrypt integration ready
- ✅ **Domains**: Three environments configured
- ✅ **Health Checks**: API endpoint implemented
- ✅ **Security**: Headers and hardening configured
- ✅ **Performance**: Caching and optimization enabled
