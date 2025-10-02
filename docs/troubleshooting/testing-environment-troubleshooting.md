# Testing Environment Troubleshooting Guide

## 🔍 **Overview**

Panduan troubleshooting khusus untuk masalah yang sering terjadi saat menjalankan testing environment website sekolah.

## 🚨 **Masalah yang Baru Diperbaiki**

### **1. Container Entrypoint Script Not Found**

#### **Gejala:**
- Error: `Cannot find module '/app/entrypoint-dev.sh'`
- Container terus restart
- Error: `sh: can't open '/app/entrypoint-dev.sh': No such file or directory`

#### **Penyebab:**
- File entrypoint script tidak ditemukan dalam container
- Build context tidak mencakup file yang diperlukan
- Masalah dengan COPY command dalam Dockerfile

#### **Solusi:**

**Opsi 1: Gunakan Development Testing Environment (Recommended)**
```bash
cd docker/test
docker compose -f docker-compose.dev-test.yml down
docker compose -f docker-compose.dev-test.yml build --no-cache
docker compose -f docker-compose.dev-test.yml up -d
```

**Opsi 2: Modifikasi Dockerfile.dev**
```dockerfile
# Ganti CMD ini:
CMD ["/app/entrypoint-dev.sh"]

# Dengan ini:
CMD ["sh", "-c", "if [ -f yarn.lock ]; then yarn dev; elif [ -f package-lock.json ]; then npm run dev; elif [ -f pnpm-lock.yaml ]; then pnpm run dev; else echo 'No package manager found!'; exit 1; fi"]
```

**Opsi 3: Perbaiki Build Context**
```bash
# Pastikan berada di direktori root project
cd /home/dev/web/koneksi/v0-website-for-school

# Build dengan context yang benar
docker build --no-cache -f docker/dev/Dockerfile.dev .
```

### **2. Build Context Issues**

#### **Gejala:**
- Failed to compute cache key
- "/app/public": not found
- Build fails during COPY operations
- Error: `failed to calculate checksum of ref`

#### **Penyebab:**
- Build context tidak mencakup semua file yang diperlukan
- File atau direktori tidak ada di lokasi yang diharapkan
- Masalah dengan .dockerignore

#### **Solusi:**

**Periksa Struktur File:**
```bash
# Pastikan file ada
ls -la docker/dev/
ls -la public/
ls -la package.json

# Periksa .dockerignore
cat .dockerignore
```

**Clean Build:**
```bash
# Build tanpa cache
docker compose -f docker-compose.dev-test.yml build --no-cache

# Atau build manual
docker build --no-cache -f docker/dev/Dockerfile.dev .
```

**Periksa Build Context:**
```bash
# Test build context
docker build --no-cache -f docker/dev/Dockerfile.dev . --progress=plain
```

### **3. Container Restart Loop**

#### **Gejala:**
- Container status: "Restarting (1)"
- Container tidak pernah mencapai status "Up"
- Logs menunjukkan error berulang

#### **Penyebab:**
- Entrypoint script gagal
- Environment variables tidak benar
- Port conflicts
- Resource constraints

#### **Solusi:**

**Periksa Logs:**
```bash
# Lihat logs container
docker logs school-website-dev-test --tail 20

# Follow logs real-time
docker logs school-website-dev-test -f
```

**Periksa Status:**
```bash
# Periksa status container
docker ps -a | grep school-website-dev-test

# Periksa resource usage
docker stats school-website-dev-test
```

**Restart dengan Clean Build:**
```bash
cd docker/test
docker compose -f docker-compose.dev-test.yml down
docker compose -f docker-compose.dev-test.yml build --no-cache
docker compose -f docker-compose.dev-test.yml up -d
```

## 🛠️ **Troubleshooting Commands**

### **Diagnostic Commands**
```bash
# Periksa semua container
docker ps -a

# Periksa images
docker images | grep school-website

# Periksa networks
docker network ls

# Periksa volumes
docker volume ls
```

### **Log Analysis**
```bash
# Logs container aplikasi
docker logs school-website-dev-test --tail 50

# Logs nginx
docker logs nginx-test-dev --tail 50

# Logs dengan timestamp
docker logs school-website-dev-test --timestamps --tail 20
```

### **Container Inspection**
```bash
# Inspect container
docker inspect school-website-dev-test

# Periksa environment variables
docker exec school-website-dev-test env

# Periksa file system
docker exec school-website-dev-test ls -la /app
```

### **Network Testing**
```bash
# Test konektivitas internal
docker exec school-website-dev-test ping nginx-test-dev

# Test port
docker exec school-website-dev-test netstat -tulpn

# Test endpoint
curl -f http://localhost:3001/
curl -f http://localhost:8080/websekolah-dev/
```

## 🔧 **Quick Fixes**

### **Reset Everything**
```bash
# Stop semua container testing
cd docker/test
docker compose -f docker-compose.dev-test.yml down
docker compose -f docker-compose.test.yml down

# Hapus images yang bermasalah
docker rmi test-school-website-dev-test
docker rmi test-school-website-staging-test
docker rmi test-school-website-prod-test

# Clean build dan start
docker compose -f docker-compose.dev-test.yml build --no-cache
docker compose -f docker-compose.dev-test.yml up -d
```

### **Port Conflicts**
```bash
# Periksa port yang digunakan
sudo netstat -tulpn | grep -E ":(8080|3001|3002|3003)"

# Kill process yang menggunakan port
sudo kill -9 $(lsof -t -i:8080)
sudo kill -9 $(lsof -t -i:3001)
```

### **Permission Issues**
```bash
# Perbaiki permission file
chmod +x docker/dev/entrypoint-dev.sh

# Perbaiki permission direktori
sudo chown -R $USER:$USER docker/
```

## 📊 **Monitoring**

### **Health Checks**
```bash
# Test endpoint
curl -f http://localhost:8080/websekolah-dev/ || echo "Endpoint failed"

# Test direct container
curl -f http://localhost:3001/ || echo "Direct container failed"

# Test nginx
curl -f http://localhost:8080/ || echo "Nginx failed"
```

### **Resource Monitoring**
```bash
# Monitor resource usage
docker stats school-website-dev-test nginx-test-dev

# Monitor system resources
htop
free -h
df -h
```

## 🎯 **Best Practices**

### **Prevention**
1. **Selalu gunakan development testing environment** untuk testing lokal
2. **Clean build** jika ada perubahan pada Dockerfile
3. **Periksa logs** sebelum troubleshooting lebih lanjut
4. **Gunakan port yang berbeda** untuk menghindari konflik

### **Response**
1. **Dokumentasikan masalah** yang ditemukan
2. **Test solusi** di environment yang terisolasi
3. **Update dokumentasi** jika menemukan solusi baru
4. **Share knowledge** dengan tim

### **Recovery**
1. **Selalu ada backup plan** (development testing environment)
2. **Test recovery procedures** secara berkala
3. **Dokumentasikan recovery steps**
4. **Latihan tim** untuk prosedur recovery

## 📞 **Support**

- **Docker Documentation**: https://docs.docker.com/
- **Docker Compose Documentation**: https://docs.docker.com/compose/
- **Next.js Documentation**: https://nextjs.org/docs
- **Nginx Documentation**: https://nginx.org/en/docs/
- **GitHub Issues**: [Project Issues](https://github.com/sandikodev/v0-website-for-school/issues)

---

**Catatan**: Jika masalah masih berlanjut setelah mengikuti panduan ini, silakan buat issue di GitHub dengan detail lengkap tentang error yang terjadi dan langkah-langkah yang sudah dicoba.
