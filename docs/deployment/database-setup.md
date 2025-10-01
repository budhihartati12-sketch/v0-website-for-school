# Database Setup Guide

## 🗄️ Overview

Panduan lengkap untuk setup database PostgreSQL untuk aplikasi website sekolah dengan Docker.

## 📋 Prerequisites

- Docker dan Docker Compose terinstall
- nginx-proxy sudah berjalan
- nginx-net network sudah dibuat

## 🏗️ Database Architecture

```
school-website → postgres-container
        ↓
    nginx-net network
```

## 🐳 PostgreSQL Setup

### 1. Database Docker Compose

```yaml
# docker-compose.db.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: school-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=school_db
      - POSTGRES_USER=school_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_INITDB_ARGS=--encoding=UTF-8 --lc-collate=C --lc-ctype=C
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    networks:
      - nginx-net
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U school_user -d school_db"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: school-pgadmin
    restart: unless-stopped
    environment:
      - PGADMIN_DEFAULT_EMAIL=${PGADMIN_EMAIL}
      - PGADMIN_DEFAULT_PASSWORD=${PGADMIN_PASSWORD}
      - PGADMIN_CONFIG_SERVER_MODE=False
    volumes:
      - pgadmin-data:/var/lib/pgadmin
    networks:
      - nginx-net
    ports:
      - "8080:80"
    depends_on:
      - postgres

volumes:
  postgres-data:
  pgadmin-data:

networks:
  nginx-net:
    external: true
```

### 2. Environment Variables

```bash
# Add to your .env file
DB_PASSWORD=your-secure-password
PGADMIN_EMAIL=admin@your-domain.com
PGADMIN_PASSWORD=your-pgadmin-password
```

### 3. Database Initialization Scripts

```sql
-- init-scripts/01-create-tables.sql
-- Create database tables for school website

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

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    birth_date DATE,
    class VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    recipient_id INTEGER REFERENCES users(id),
    subject VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admissions table
CREATE TABLE IF NOT EXISTS admissions (
    id SERIAL PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    birth_date DATE NOT NULL,
    address TEXT NOT NULL,
    parent_name VARCHAR(100) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    previous_school VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_admissions_registration_number ON admissions(registration_number);
```

### 4. Database Connection String

```bash
# Add to your .env file
DATABASE_URL=postgresql://school_user:your-secure-password@postgres:5432/school_db
```

## 🚀 Deployment Steps

### 1. Start Database

```bash
# Start database services
docker-compose -f docker-compose.db.yml up -d

# Check status
docker-compose -f docker-compose.db.yml ps
```

### 2. Verify Database

```bash
# Check database logs
docker logs school-postgres

# Test connection
docker exec school-postgres psql -U school_user -d school_db -c "SELECT version();"

# Check tables
docker exec school-postgres psql -U school_user -d school_db -c "\dt"
```

### 3. Access pgAdmin

```bash
# Access pgAdmin at http://your-vps-ip:8080
# Login with PGADMIN_EMAIL and PGADMIN_PASSWORD
# Add server connection:
#   Host: postgres
#   Port: 5432
#   Username: school_user
#   Password: your-secure-password
```

## 🔧 Configuration

### Database Settings

| Setting | Value | Description |
|---------|-------|-------------|
| Database | school_db | Main database name |
| Username | school_user | Database user |
| Password | ${DB_PASSWORD} | Secure password |
| Port | 5432 | PostgreSQL port |
| Encoding | UTF-8 | Character encoding |

### Connection Pooling

```yaml
# Add to docker-compose.yml
environment:
  - DATABASE_URL=postgresql://school_user:${DB_PASSWORD}@postgres:5432/school_db
  - DATABASE_POOL_MIN=2
  - DATABASE_POOL_MAX=10
```

## 📊 Monitoring

### Health Checks

```bash
# Check database health
docker exec school-postgres pg_isready -U school_user -d school_db

# Check container health
docker inspect school-postgres --format='{{.State.Health.Status}}'
```

### Performance Monitoring

```bash
# Check database size
docker exec school-postgres psql -U school_user -d school_db -c "SELECT pg_size_pretty(pg_database_size('school_db'));"

# Check active connections
docker exec school-postgres psql -U school_user -d school_db -c "SELECT count(*) FROM pg_stat_activity;"

# Check slow queries
docker exec school-postgres psql -U school_user -d school_db -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"
```

## 🔄 Backups

### Automated Backups

```bash
# Create backup script
cat > backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="school_db_${DATE}.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
docker exec school-postgres pg_dump -U school_user -d school_db > $BACKUP_DIR/$BACKUP_FILE

# Compress backup
gzip $BACKUP_DIR/$BACKUP_FILE

# Remove old backups (keep last 7 days)
find $BACKUP_DIR -name "school_db_*.sql.gz" -mtime +7 -delete

echo "Backup created: $BACKUP_DIR/$BACKUP_FILE.gz"
EOF

chmod +x backup-db.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /path/to/backup-db.sh
```

### Restore from Backup

```bash
# Restore database
docker exec -i school-postgres psql -U school_user -d school_db < backup.sql

# Or from compressed backup
gunzip -c backup.sql.gz | docker exec -i school-postgres psql -U school_user -d school_db
```

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Refused**
   ```bash
   # Check if container is running
   docker ps | grep postgres
   
   # Check logs
   docker logs school-postgres
   
   # Check network
   docker network inspect nginx-net
   ```

2. **Authentication Failed**
   ```bash
   # Check environment variables
   docker exec school-postgres env | grep POSTGRES
   
   # Reset password
   docker exec school-postgres psql -U postgres -c "ALTER USER school_user PASSWORD 'new-password';"
   ```

3. **Database Not Found**
   ```bash
   # Check if database exists
   docker exec school-postgres psql -U school_user -l
   
   # Create database
   docker exec school-postgres psql -U school_user -c "CREATE DATABASE school_db;"
   ```

### Performance Issues

1. **Slow Queries**
   ```bash
   # Enable query logging
   docker exec school-postgres psql -U school_user -d school_db -c "ALTER SYSTEM SET log_statement = 'all';"
   docker exec school-postgres psql -U school_user -d school_db -c "SELECT pg_reload_conf();"
   ```

2. **High Memory Usage**
   ```bash
   # Check memory settings
   docker exec school-postgres psql -U school_user -d school_db -c "SHOW shared_buffers;"
   docker exec school-postgres psql -U school_user -d school_db -c "SHOW work_mem;"
   ```

## 🔒 Security

### Database Security

1. **Strong Passwords**
   ```bash
   # Generate secure password
   openssl rand -base64 32
   ```

2. **Network Isolation**
   ```yaml
   # Only expose to nginx-net
   networks:
     - nginx-net
   ```

3. **Regular Updates**
   ```bash
   # Update PostgreSQL image
   docker-compose -f docker-compose.db.yml pull
   docker-compose -f docker-compose.db.yml up -d
   ```

### Access Control

```sql
-- Create read-only user
CREATE USER readonly_user WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE school_db TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
```

## 📈 Scaling

### Read Replicas

```yaml
# Add read replica
services:
  postgres-replica:
    image: postgres:15-alpine
    container_name: school-postgres-replica
    restart: unless-stopped
    environment:
      - POSTGRES_DB=school_db
      - POSTGRES_USER=school_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - PGUSER=school_user
      - POSTGRES_MASTER_SERVICE=postgres
    volumes:
      - postgres-replica-data:/var/lib/postgresql/data
    networks:
      - nginx-net
    depends_on:
      - postgres
```

## 🎯 Best Practices

1. **Regular Backups**
   ```bash
   # Daily automated backups
   # Test restore procedures
   # Store backups offsite
   ```

2. **Monitor Performance**
   ```bash
   # Use pgAdmin for monitoring
   # Set up alerts for slow queries
   # Monitor disk space
   ```

3. **Security Updates**
   ```bash
   # Keep PostgreSQL updated
   # Use strong passwords
   # Limit network access
   ```

## 📞 Support

- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **pgAdmin Documentation**: https://www.pgadmin.org/docs/
- **Issues**: [GitHub Issues](https://github.com/sandikodev/v0-website-for-school/issues)

---

**Note**: Pastikan nginx-net network sudah dibuat sebelum menjalankan database services.
