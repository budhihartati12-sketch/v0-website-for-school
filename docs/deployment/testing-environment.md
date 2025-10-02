# Testing Environment Documentation

## 🧪 **Testing Environment Overview**

### **Purpose**
Testing environment yang terpisah untuk menguji konfigurasi websekolah tanpa mengganggu layanan production yang ada.

### **Architecture**
```
Testing Environment:
├── nginx-test (port 8080)           # Reverse proxy untuk testing
├── school-website-dev-test (port 3001)   # Development environment
├── school-website-staging-test (port 3002) # Staging environment
└── school-website-prod-test (port 3003)   # Production environment
```

## 🚀 **Quick Start**

### **Development Testing Environment (Recommended)**
```bash
# Navigate to test directory
cd docker/test

# Build and start development testing environment
docker compose -f docker-compose.dev-test.yml up -d

# Check status
docker compose -f docker-compose.dev-test.yml ps
```

### **Full Testing Environment (All Environments)**
```bash
# Run setup script
./scripts/test/setup-test-env.sh
```

### **Manual Setup**
```bash
# Navigate to test directory
cd docker/test

# Build and start containers
docker compose -f docker-compose.test.yml up -d

# Check status
docker compose -f docker-compose.test.yml ps
```

## 🌐 **Access URLs**

### **Testing Endpoints**
- **Development**: `http://localhost:8080/websekolah-dev`
- **Staging**: `http://localhost:8080/websekolah-staging`
- **Production**: `http://localhost:8080/websekolah`

### **Direct Container Access**
- **Development**: `http://localhost:3001`
- **Staging**: `http://localhost:3002`
- **Production**: `http://localhost:3003`

## 🔧 **Configuration**

### **Nginx Test Configuration**
```nginx
# Testing Environment for School Website
server {
    listen 8080;
    server_name localhost;
    
    # Development environment
    location /websekolah-dev {
        proxy_pass http://localhost:3001;
    }
    
    # Staging environment
    location /websekolah-staging {
        proxy_pass http://localhost:3002;
    }
    
    # Production environment
    location /websekolah {
        proxy_pass http://localhost:3003;
    }
}
```

### **Docker Compose Test**
```yaml
services:
  nginx-test:
    image: nginx:stable-alpine
    ports:
      - "8080:8080"
    volumes:
      - ./nginx-test.conf:/etc/nginx/conf.d/default.conf:ro
    
  school-website-dev-test:
    build:
      context: ../../
      dockerfile: docker/dev/Dockerfile.dev
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - PORT=3001
```

## 🧪 **Testing Procedures**

### **1. Basic Connectivity Test**
```bash
# Test all endpoints
curl -f http://localhost:8080/websekolah-dev/
curl -f http://localhost:8080/websekolah-staging/
curl -f http://localhost:8080/websekolah/
```

### **2. Health Check Test**
```bash
# Test health endpoints
curl -f http://localhost:3001/api/health
curl -f http://localhost:3002/api/health
curl -f http://localhost:3003/api/health
```

### **3. Load Test**
```bash
# Simple load test
for i in {1..10}; do
  curl -f http://localhost:8080/websekolah/ &
done
wait
```

## 📊 **Monitoring & Debugging**

### **View Logs**
```bash
# All services
docker compose -f docker-compose.test.yml logs -f

# Specific service
docker compose -f docker-compose.test.yml logs -f nginx-test
docker compose -f docker-compose.test.yml logs -f school-website-dev-test
```

### **Container Status**
```bash
# Check running containers
docker compose -f docker-compose.test.yml ps

# Check resource usage
docker stats
```

### **Debugging**
```bash
# Access nginx container
docker exec -it nginx-test sh

# Access application container
docker exec -it school-website-dev-test sh

# Check nginx configuration
docker exec nginx-test nginx -t
```

## 🛠️ **Management Commands**

### **Start Testing Environment**
```bash
cd docker/test
docker compose -f docker-compose.test.yml up -d
```

### **Stop Testing Environment**
```bash
cd docker/test
docker compose -f docker-compose.test.yml down
```

### **Restart Services**
```bash
cd docker/test
docker compose -f docker-compose.test.yml restart
```

### **Rebuild Containers**
```bash
cd docker/test
docker compose -f docker-compose.test.yml build --no-cache
docker compose -f docker-compose.test.yml up -d
```

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Container Entrypoint Script Not Found**
**Symptoms:**
- Error: `Cannot find module '/app/entrypoint-dev.sh'`
- Container keeps restarting
- sh: can't open '/app/entrypoint-dev.sh': No such file or directory

**Solutions:**
```bash
# Use development testing environment instead
cd docker/test
docker compose -f docker-compose.dev-test.yml down
docker compose -f docker-compose.dev-test.yml build --no-cache
docker compose -f docker-compose.dev-test.yml up -d

# Or modify Dockerfile.dev to use direct command
# Replace CMD ["/app/entrypoint-dev.sh"] with:
# CMD ["sh", "-c", "if [ -f yarn.lock ]; then yarn dev; elif [ -f package-lock.json ]; then npm run dev; elif [ -f pnpm-lock.yaml ]; then pnpm run dev; else echo 'No package manager found!'; exit 1; fi"]
```

#### **Build Context Issues**
**Symptoms:**
- Failed to compute cache key
- "/app/public": not found
- Build fails during COPY operations

**Solutions:**
```bash
# Clean build with no cache
docker compose -f docker-compose.dev-test.yml build --no-cache

# Check build context
docker build --no-cache -f docker/dev/Dockerfile.dev .

# Verify file structure
ls -la docker/dev/
ls -la public/
```

#### **Port Already in Use**
```bash
# Check what's using the port
sudo netstat -tulpn | grep :8080

# Kill process if needed
sudo kill -9 <PID>
```

#### **Container Won't Start**
```bash
# Check logs
docker compose -f docker-compose.dev-test.yml logs

# Check container status
docker compose -f docker-compose.dev-test.yml ps
```

#### **Nginx Configuration Error**
```bash
# Test nginx configuration
docker exec nginx-test-dev nginx -t

# Reload nginx
docker exec nginx-test-dev nginx -s reload
```

### **Development Testing Environment Commands**
```bash
# Start development testing
cd docker/test
docker compose -f docker-compose.dev-test.yml up -d

# Stop development testing
docker compose -f docker-compose.dev-test.yml down

# Restart development testing
docker compose -f docker-compose.dev-test.yml restart

# Rebuild development testing
docker compose -f docker-compose.dev-test.yml build --no-cache
docker compose -f docker-compose.dev-test.yml up -d

# View logs
docker compose -f docker-compose.dev-test.yml logs -f

# Check status
docker compose -f docker-compose.dev-test.yml ps
```

### **Reset Testing Environment**
```bash
# Complete reset (full environment)
cd docker/test
docker compose -f docker-compose.test.yml down -v
docker compose -f docker-compose.test.yml build --no-cache
docker compose -f docker-compose.test.yml up -d

# Reset development environment only
cd docker/test
docker compose -f docker-compose.dev-test.yml down -v
docker compose -f docker-compose.dev-test.yml build --no-cache
docker compose -f docker-compose.dev-test.yml up -d
```

## 📈 **Performance Testing**

### **Load Testing with Apache Bench**
```bash
# Install apache2-utils if not available
sudo apt-get install apache2-utils

# Run load test
ab -n 1000 -c 10 http://localhost:8080/websekolah/
```

### **Memory Usage Monitoring**
```bash
# Monitor memory usage
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

## ✅ **Validation Checklist**

### **Pre-Production Testing**
- [ ] All endpoints respond correctly
- [ ] Health checks pass
- [ ] No error logs in containers
- [ ] Performance is acceptable
- [ ] Configuration matches production requirements
- [ ] SSL/TLS works (if applicable)
- [ ] Database connections work
- [ ] Static files serve correctly

### **Production Readiness**
- [ ] All tests pass
- [ ] Performance benchmarks met
- [ ] Security headers configured
- [ ] Monitoring in place
- [ ] Backup procedures tested
- [ ] Rollback plan verified

## 🎯 **Next Steps**

### **After Testing Success**
1. **Document** any configuration changes needed
2. **Prepare** production deployment plan
3. **Schedule** maintenance window
4. **Notify** stakeholders
5. **Execute** production deployment

### **If Issues Found**
1. **Fix** issues in testing environment
2. **Re-test** until all issues resolved
3. **Update** documentation
4. **Repeat** testing cycle

## 📝 **Notes**

- Testing environment uses different ports to avoid conflicts
- All containers are isolated in `test-network`
- Configuration files are read-only mounted
- Logs are available for debugging
- Environment can be easily reset and rebuilt
