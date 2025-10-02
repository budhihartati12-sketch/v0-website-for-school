# Showcase Domain Implementation

## 🎯 **Current Implementation: Path-based Routing**

### **Domain Structure**
```
showcase.konxc.space/websekolah          # Production
showcase.konxc.space/websekolah-dev      # Development  
showcase.konxc.space/websekolah-staging  # Staging
```

## 🔧 **Technical Configuration**

### **Nginx Configuration**
All environments now use `showcase.konxc.space` with path-based routing:

#### **Production** (`/websekolah`)
```nginx
server {
    listen 80;
    server_name showcase.konxc.space;
    
    location /websekolah {
        proxy_pass http://school-website-prod:3000;
    }
    
    location /websekolah/ {
        proxy_pass http://school-website-prod:3000/;
    }
}
```

#### **Development** (`/websekolah-dev`)
```nginx
server {
    listen 80;
    server_name showcase.konxc.space;
    
    location /websekolah-dev {
        proxy_pass http://school-website-dev:3000;
    }
    
    location /websekolah-dev/ {
        proxy_pass http://school-website-dev:3000/;
    }
}
```

#### **Staging** (`/websekolah-staging`)
```nginx
server {
    listen 80;
    server_name showcase.konxc.space;
    
    location /websekolah-staging {
        proxy_pass http://school-website-staging:3000;
    }
    
    location /websekolah-staging/ {
        proxy_pass http://school-website-staging:3000/;
    }
}
```

### **Docker Compose Updates**

#### **Production Environment**
```yaml
environment:
  - VIRTUAL_HOST=showcase.konxc.space
  - VIRTUAL_PATH=/websekolah
  - LETSENCRYPT_HOST=showcase.konxc.space
```

#### **Staging Environment**
```yaml
environment:
  - VIRTUAL_HOST=showcase.konxc.space
  - VIRTUAL_PATH=/websekolah-staging
  - LETSENCRYPT_HOST=showcase.konxc.space
```

## 🚀 **Deployment URLs**

### **Access Points**
- **Production**: `https://showcase.konxc.space/websekolah`
- **Development**: `https://showcase.konxc.space/websekolah-dev`
- **Staging**: `https://showcase.konxc.space/websekolah-staging`

### **Deployment Commands**
```bash
# Development
cd docker/dev
docker-compose -f docker-compose.dev.yml up -d

# Staging
cd docker/staging
docker-compose -f docker-compose.staging.yml up -d

# Production
cd docker/prod
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 **Benefits Achieved**

### **Brand Consistency**
- ✅ All PT Koneksi Jaringan Indonesia products under one domain
- ✅ Professional showcase structure
- ✅ Centralized SSL certificate management

### **Cost Optimization**
- ✅ Single domain registration
- ✅ Single SSL certificate
- ✅ Unified DNS management

### **Scalability**
- ✅ Easy to add new products: `/sistemakademik`, `/smmpanel`
- ✅ Consistent URL structure
- ✅ Unified monitoring and analytics

## 🔍 **Monitoring & Health Checks**

### **Health Check Endpoints**
- **Production**: `https://showcase.konxc.space/websekolah/api/health`
- **Development**: `https://showcase.konxc.space/websekolah-dev/api/health`
- **Staging**: `https://showcase.konxc.space/websekolah-staging/api/health`

### **Container Status**
```bash
# Check all school website containers
docker ps --filter "name=school-website"

# Check nginx proxy status
docker logs nginx-proxy
```

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Path Not Found (404)**
```bash
# Check nginx configuration
docker exec nginx-proxy nginx -t

# Reload nginx configuration
docker exec nginx-proxy nginx -s reload
```

#### **SSL Certificate Issues**
```bash
# Check Let's Encrypt logs
docker logs nginx-proxy | grep -i cert

# Force certificate renewal
docker exec nginx-proxy certbot renew --force-renewal
```

#### **Container Connectivity**
```bash
# Test internal connectivity
docker exec school-website-prod curl http://localhost:3000/api/health

# Check network connectivity
docker network inspect nginx-net
```

## 📈 **Future Roadmap**

### **Phase 2: Hybrid Approach** (Documented in `future-domain-strategy.md`)
```
showcase.konxc.space/websekolah          # Production (unchanged)
websekolah-dev.konxc.space               # Development (new subdomain)
```

### **Additional Products**
```
showcase.konxc.space/sistemakademik      # Academic System
showcase.konxc.space/smmpanel            # SMM Panel
showcase.konxc.space/portfolio           # Company Portfolio
```

## ✅ **Implementation Status**

- ✅ **Nginx Configuration**: Updated for showcase domain
- ✅ **Docker Compose**: Updated environment variables
- ✅ **SSL Integration**: Let's Encrypt ready
- ✅ **Health Checks**: API endpoints configured
- ✅ **Documentation**: Complete implementation guide
- ✅ **Future Planning**: Hybrid approach documented

## 🎉 **Ready for Production**

The showcase domain implementation is now complete and ready for deployment. All environments are properly configured with:

- **Professional URLs** for client presentations
- **Unified SSL** certificate management
- **Scalable architecture** for future products
- **Comprehensive monitoring** and health checks
- **Clear documentation** for team reference

**Next Steps**: Deploy to production and begin showcasing PT Koneksi Jaringan Indonesia's portfolio!
