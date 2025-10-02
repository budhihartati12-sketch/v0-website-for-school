# Docker Entrypoint Strategy

## 🎯 **Mengapa Menggunakan Entrypoint File Terpisah?**

### **Masalah dengan Hardcoded Script**
```dockerfile
# ❌ BAD: Hardcoded dalam Dockerfile
RUN echo '#!/bin/sh\n\
if [ -f yarn.lock ]; then\n\
  yarn dev\n\
elif [ -f package-lock.json ]; then\n\
  npm run dev\n\
# ... more hardcoded logic
```

**Masalah:**
- ❌ Sulit dibaca dan di-maintain
- ❌ Tidak bisa di-version control dengan baik
- ❌ Sulit untuk debugging
- ❌ Tidak reusable
- ❌ Syntax error prone

### **Solusi dengan Entrypoint File**
```dockerfile
# ✅ GOOD: File terpisah
COPY docker/dev/entrypoint-dev.sh /app/entrypoint-dev.sh
RUN chmod +x /app/entrypoint-dev.sh
CMD ["/app/entrypoint-dev.sh"]
```

**Keuntungan:**
- ✅ Mudah dibaca dan di-maintain
- ✅ Bisa di-version control dengan proper syntax highlighting
- ✅ Mudah untuk debugging dan testing
- ✅ Reusable across different Dockerfiles
- ✅ Proper shell script syntax

## 📁 **Struktur Entrypoint Files**

```
docker/
├── entrypoint-prod.sh          # Production entrypoint
└── dev/
    └── entrypoint-dev.sh       # Development entrypoint
```

## 🔧 **Entrypoint Scripts**

### **Development Entrypoint** (`docker/dev/entrypoint-dev.sh`)
```bash
#!/bin/sh
set -e

echo "🚀 Starting School Website Development Server..."

if [ -f yarn.lock ]; then
    echo "📦 Detected Yarn - Starting with yarn dev"
    exec yarn dev
elif [ -f package-lock.json ]; then
    echo "📦 Detected npm - Starting with npm run dev"
    exec npm run dev
elif [ -f pnpm-lock.yaml ]; then
    echo "📦 Detected pnpm - Starting with pnpm run dev"
    exec pnpm run dev
else
    echo "❌ Error: No package manager lockfile found!"
    exit 1
fi
```

### **Production Entrypoint** (`docker/entrypoint-prod.sh`)
```bash
#!/bin/sh
set -e

echo "🚀 Starting School Website Production Server..."

if [ -f yarn.lock ]; then
    echo "📦 Detected Yarn - Starting with yarn start"
    exec yarn start
elif [ -f package-lock.json ]; then
    echo "📦 Detected npm - Starting with npm start"
    exec npm start
elif [ -f pnpm-lock.yaml ]; then
    echo "📦 Detected pnpm - Starting with pnpm start"
    exec pnpm start
else
    echo "❌ Error: No package manager lockfile found!"
    exit 1
fi
```

## 🚀 **Best Practices**

### **1. Error Handling**
```bash
set -e  # Exit on any error
```

### **2. Proper Process Management**
```bash
exec command  # Replace shell process (proper signal handling)
```

### **3. Informative Logging**
```bash
echo "🚀 Starting School Website Development Server..."
echo "📦 Detected pnpm - Starting with pnpm run dev"
```

### **4. Clear Error Messages**
```bash
echo "❌ Error: No package manager lockfile found!"
echo "Expected one of: yarn.lock, package-lock.json, or pnpm-lock.yaml"
```

## 🔍 **Testing Entrypoint Scripts**

### **Local Testing**
```bash
# Test development entrypoint
cd docker/dev
chmod +x entrypoint-dev.sh
./entrypoint-dev.sh

# Test production entrypoint
cd docker
chmod +x entrypoint-prod.sh
./entrypoint-prod.sh
```

### **Docker Testing**
```bash
# Test development container
docker build -f docker/dev/Dockerfile.dev -t school-dev .
docker run --rm school-dev

# Test production container
docker build -f docker/Dockerfile -t school-prod .
docker run --rm school-prod
```

## 📊 **Comparison**

| Aspect | Hardcoded Script | Entrypoint File |
|--------|------------------|-----------------|
| **Readability** | ❌ Poor | ✅ Excellent |
| **Maintainability** | ❌ Difficult | ✅ Easy |
| **Version Control** | ❌ Poor | ✅ Excellent |
| **Debugging** | ❌ Hard | ✅ Easy |
| **Reusability** | ❌ None | ✅ High |
| **Syntax Highlighting** | ❌ None | ✅ Full |
| **Testing** | ❌ Difficult | ✅ Easy |

## 🎉 **Benefits**

1. **Professional Structure** - Industry standard approach
2. **Better Developer Experience** - Easy to read and modify
3. **Easier Debugging** - Can test scripts independently
4. **Version Control Friendly** - Proper file tracking
5. **Reusable** - Can be shared across different Dockerfiles
6. **Maintainable** - Clear separation of concerns

## 🔧 **Usage in Dockerfiles**

### **Development Dockerfile**
```dockerfile
COPY docker/dev/entrypoint-dev.sh /app/entrypoint-dev.sh
RUN chmod +x /app/entrypoint-dev.sh
CMD ["/app/entrypoint-dev.sh"]
```

### **Production Dockerfile**
```dockerfile
COPY docker/entrypoint-prod.sh /app/entrypoint-prod.sh
RUN chmod +x /app/entrypoint-prod.sh
CMD ["/app/entrypoint-prod.sh"]
```

This approach follows Docker best practices and makes the project more maintainable and professional.
