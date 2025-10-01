# Development Deployment Guide

## 🚀 Overview

Panduan lengkap untuk deployment development aplikasi website sekolah dengan Docker untuk development lokal.

## 📋 Prerequisites

- Docker dan Docker Compose terinstall
- Basic understanding of Docker concepts
- Local development environment

## 🏗️ Development Architecture

```
Local Machine → Docker Containers
        ↓
    dev-network
```

## 🐳 Development Setup

### 1. Development Docker Compose

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  school-website:
    build: .
    container_name: school-website-dev
    restart: unless-stopped
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://school_user:dev_password@postgres:5432/school_db_dev
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_SECRET=dev-secret-key
      - NEXTAUTH_URL=http://localhost:3000
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - dev-network
    depends_on:
      - postgres
      - redis
    command: npm run dev

  postgres:
    image: postgres:15-alpine
    container_name: school-postgres-dev
    restart: unless-stopped
    environment:
      - POSTGRES_DB=school_db_dev
      - POSTGRES_USER=school_user
      - POSTGRES_PASSWORD=dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres-dev-data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    networks:
      - dev-network

  redis:
    image: redis:7-alpine
    container_name: school-redis-dev
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-dev-data:/data
    networks:
      - dev-network

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: school-pgadmin-dev
    restart: unless-stopped
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@localhost
      - PGADMIN_DEFAULT_PASSWORD=admin
    ports:
      - "8080:80"
    volumes:
      - pgadmin-dev-data:/var/lib/pgadmin
    networks:
      - dev-network
    depends_on:
      - postgres

volumes:
  postgres-dev-data:
  redis-dev-data:
  pgadmin-dev-data:

networks:
  dev-network:
    driver: bridge
```

### 2. Development Environment Variables

```bash
# .env.dev
# Development Environment Variables

# Application
NODE_ENV=development
NEXTAUTH_SECRET=dev-secret-key
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://school_user:dev_password@postgres:5432/school_db_dev
DB_NAME=school_db_dev
DB_USER=school_user
DB_PASSWORD=dev_password

# Redis
REDIS_URL=redis://redis:6379
REDIS_PASSWORD=

# Development Tools
PGADMIN_EMAIL=admin@localhost
PGADMIN_PASSWORD=admin

# Optional: External Services
GOOGLE_ANALYTICS_ID=
GOOGLE_MAPS_API_KEY=
```

### 3. Development Dockerfile

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=development

# Start development server
CMD ["npm", "run", "dev"]
```

## 🚀 Deployment Steps

### 1. Setup Development Environment

```bash
# Clone repository
git clone https://github.com/sandikodev/v0-website-for-school.git
cd v0-website-for-school

# Copy development environment
cp .env.dev .env

# Edit environment variables if needed
nano .env
```

### 2. Start Development Services

```bash
# Start development services
docker-compose -f docker-compose.dev.yml up -d

# Check status
docker-compose -f docker-compose.dev.yml ps
```

### 3. Verify Development Setup

```bash
# Check application
curl http://localhost:3000

# Check database
docker exec school-postgres-dev psql -U school_user -d school_db_dev -c "SELECT version();"

# Check Redis
docker exec school-redis-dev redis-cli ping

# Check pgAdmin
curl http://localhost:8080
```

## 🔧 Development Configuration

### Hot Reload Setup

```yaml
# docker-compose.dev.yml
services:
  school-website:
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
```

### Database Development

```sql
-- init-scripts/01-dev-tables.sql
-- Development database tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert development data
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@localhost', '$2a$10$example_hash', 'admin'),
('user', 'user@localhost', '$2a$10$example_hash', 'user')
ON CONFLICT (username) DO NOTHING;
```

### Development Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:docker": "docker-compose -f docker-compose.dev.yml up -d",
    "dev:stop": "docker-compose -f docker-compose.dev.yml down",
    "dev:logs": "docker-compose -f docker-compose.dev.yml logs -f",
    "dev:restart": "docker-compose -f docker-compose.dev.yml restart",
    "dev:build": "docker-compose -f docker-compose.dev.yml build",
    "dev:clean": "docker-compose -f docker-compose.dev.yml down -v"
  }
}
```

## 📊 Development Monitoring

### Basic Logging

```bash
# Application logs
docker-compose -f docker-compose.dev.yml logs -f school-website

# Database logs
docker-compose -f docker-compose.dev.yml logs -f postgres

# Redis logs
docker-compose -f docker-compose.dev.yml logs -f redis
```

### Development Tools

```bash
# Access pgAdmin
# URL: http://localhost:8080
# Email: admin@localhost
# Password: admin

# Access database directly
docker exec -it school-postgres-dev psql -U school_user -d school_db_dev

# Access Redis
docker exec -it school-redis-dev redis-cli
```

## 🛠️ Development Troubleshooting

### Common Issues

1. **Hot Reload Not Working**
   ```bash
   # Check volume mounts
   docker exec school-website-dev ls -la /app
   
   # Restart container
   docker-compose -f docker-compose.dev.yml restart school-website
   ```

2. **Database Connection Issues**
   ```bash
   # Check database status
   docker ps | grep postgres
   
   # Check database logs
   docker logs school-postgres-dev
   
   # Test connection
   docker exec school-postgres-dev psql -U school_user -d school_db_dev -c "SELECT 1;"
   ```

3. **Port Conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep -E ":(3000|5432|6379|8080)"
   
   # Kill conflicting processes
   sudo kill -9 $(lsof -t -i:3000)
   ```

### Development Commands

```bash
# Start development
npm run dev:docker

# Stop development
npm run dev:stop

# View logs
npm run dev:logs

# Restart services
npm run dev:restart

# Rebuild containers
npm run dev:build

# Clean everything
npm run dev:clean
```

## 🔒 Development Security

### Basic Security

```yaml
# docker-compose.dev.yml
services:
  postgres:
    environment:
      - POSTGRES_PASSWORD=dev_password
    ports:
      - "5432:5432"  # Only for development
```

### Development Best Practices

1. **Use Development Passwords**
   - Simple passwords for development
   - Never use production passwords

2. **Local Network Access**
   - Expose ports for local access
   - Use localhost for connections

3. **Development Data**
   - Use sample data
   - Reset data frequently

## 📈 Development Performance

### Resource Limits

```yaml
# docker-compose.dev.yml
services:
  school-website:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### Development Optimization

```bash
# Use development build
npm run dev

# Enable source maps
NODE_ENV=development

# Use development database
DATABASE_URL=postgresql://school_user:dev_password@postgres:5432/school_db_dev
```

## 🎯 Development Best Practices

### Code Development

1. **Use Hot Reload**
   - Enable file watching
   - Use volume mounts

2. **Database Development**
   - Use development database
   - Reset data frequently

3. **Testing**
   - Write unit tests
   - Test locally first

### Environment Management

1. **Environment Variables**
   - Use .env.dev file
   - Keep secrets simple

2. **Container Management**
   - Use development containers
   - Clean up regularly

## 📞 Support

- **Documentation**: [docs/README.md](../README.md)
- **Issues**: [GitHub Issues](https://github.com/sandikodev/v0-website-for-school/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sandikodev/v0-website-for-school/discussions)

---

**Note**: Development deployment hanya untuk development lokal. Jangan gunakan untuk production.
