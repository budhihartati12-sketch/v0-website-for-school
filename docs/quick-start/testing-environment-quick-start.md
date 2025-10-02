# 🧪 Testing Environment Quick Start Guide

## 🚀 **Quick Start (5 Menit)**

### **1. Persiapan**
```bash
# Pastikan Docker sudah berjalan
docker --version
docker compose --version

# Navigate ke direktori project
cd /path/to/v0-website-for-school
```

### **2. Start Testing Environment**
```bash
# Masuk ke direktori testing
cd docker/test

# Start development testing environment
docker compose -f docker-compose.dev-test.yml up -d

# Tunggu beberapa detik untuk container start
sleep 10
```

### **3. Verifikasi**
```bash
# Periksa status container
docker compose -f docker-compose.dev-test.yml ps

# Test endpoint
curl -f http://localhost:8080/websekolah-dev/ || echo "Testing endpoint"
curl -f http://localhost:3001/ || echo "Direct container endpoint"
```

### **4. Akses Aplikasi**
- **Melalui Nginx Proxy**: http://localhost:8080/websekolah-dev/
- **Direct Container**: http://localhost:3001/
- **Root Path**: http://localhost:8080/

## 🔧 **Management Commands**

### **Start/Stop**
```bash
# Start
docker compose -f docker-compose.dev-test.yml up -d

# Stop
docker compose -f docker-compose.dev-test.yml down

# Restart
docker compose -f docker-compose.dev-test.yml restart
```

### **Rebuild**
```bash
# Rebuild dengan no cache
docker compose -f docker-compose.dev-test.yml build --no-cache
docker compose -f docker-compose.dev-test.yml up -d
```

### **Logs**
```bash
# View logs
docker compose -f docker-compose.dev-test.yml logs -f

# Logs aplikasi saja
docker logs school-website-dev-test -f

# Logs nginx saja
docker logs nginx-test-dev -f
```

## 🚨 **Troubleshooting Cepat**

### **Container Tidak Start**
```bash
# Periksa logs
docker logs school-website-dev-test --tail 20

# Rebuild
docker compose -f docker-compose.dev-test.yml build --no-cache
docker compose -f docker-compose.dev-test.yml up -d
```

### **Port Sudah Digunakan**
```bash
# Periksa port
sudo netstat -tulpn | grep -E ":(8080|3001)"

# Kill process jika perlu
sudo kill -9 $(lsof -t -i:8080)
```

### **Endpoint Tidak Bisa Diakses**
```bash
# Test konektivitas
curl -I http://localhost:8080/websekolah-dev/
curl -I http://localhost:3001/

# Periksa nginx config
docker exec nginx-test-dev nginx -t
```

## 📊 **Monitoring**

### **Status Container**
```bash
# Status semua container testing
docker compose -f docker-compose.dev-test.yml ps

# Resource usage
docker stats school-website-dev-test nginx-test-dev
```

### **Health Check**
```bash
# Test endpoint
curl -f http://localhost:8080/websekolah-dev/ && echo "✅ OK" || echo "❌ Failed"

# Test direct container
curl -f http://localhost:3001/ && echo "✅ OK" || echo "❌ Failed"
```

## 🎯 **Use Cases**

### **Development Testing**
- Test fitur baru tanpa mengganggu aplikasi utama
- Debug masalah dalam environment terisolasi
- Test konfigurasi nginx baru

### **Demo & Presentasi**
- Demo aplikasi tanpa mengganggu production
- Test performa dengan load testing
- Validasi sebelum deployment

### **Learning & Experimentation**
- Belajar Docker dan containerization
- Experiment dengan konfigurasi baru
- Test deployment procedures

## 📝 **Best Practices**

### **Sebelum Testing**
1. ✅ Pastikan Docker sudah berjalan
2. ✅ Check port availability (8080, 3001)
3. ✅ Pastikan ada space disk cukup
4. ✅ Backup data penting jika ada

### **Selama Testing**
1. 📊 Monitor resource usage
2. 📝 Document issues yang ditemukan
3. 🔄 Test berbagai scenario
4. 📈 Measure performance

### **Setelah Testing**
1. 🧹 Clean up containers jika tidak digunakan
2. 📋 Document hasil testing
3. 🔄 Share findings dengan tim
4. 📚 Update dokumentasi jika perlu

## 🆘 **Emergency Commands**

### **Reset Everything**
```bash
# Stop semua container testing
cd docker/test
docker compose -f docker-compose.dev-test.yml down
docker compose -f docker-compose.test.yml down

# Remove images
docker rmi test-school-website-dev-test

# Clean start
docker compose -f docker-compose.dev-test.yml build --no-cache
docker compose -f docker-compose.dev-test.yml up -d
```

### **Quick Debug**
```bash
# Masuk ke container aplikasi
docker exec -it school-website-dev-test sh

# Masuk ke container nginx
docker exec -it nginx-test-dev sh

# Periksa network
docker network inspect test_test-network
```

## 📚 **Resources**

- **Full Documentation**: [Testing Environment Guide](docs/deployment/testing-environment.md)
- **Troubleshooting**: [Testing Troubleshooting](docs/troubleshooting/testing-environment-troubleshooting.md)
- **Docker Documentation**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/

---

**💡 Tip**: Simpan command yang sering digunakan dalam alias atau script untuk efisiensi!
