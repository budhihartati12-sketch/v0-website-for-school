# Backup & Disaster Recovery Guide

## 💾 Overview

Panduan lengkap untuk backup dan disaster recovery untuk aplikasi website sekolah dengan Docker.

## 📋 Prerequisites

- Docker dan Docker Compose terinstall
- nginx-proxy sudah berjalan
- nginx-net network sudah dibuat
- Database dan Redis sudah berjalan

## 🏗️ Backup Architecture

```
school-website → backup-scripts → external-storage
        ↓
    nginx-net network
```

## 🐳 Backup Setup

### 1. Backup Docker Compose

```yaml
# docker-compose.backup.yml
version: '3.8'

services:
  backup-manager:
    image: alpine:latest
    container_name: school-backup-manager
    restart: unless-stopped
    volumes:
      - ./backup-scripts:/scripts
      - ./backups:/backups
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - school-postgres-data:/var/lib/postgresql/data:ro
      - school-redis-data:/data:ro
      - school-grafana-data:/var/lib/grafana:ro
    networks:
      - nginx-net
    environment:
      - BACKUP_RETENTION_DAYS=30
      - BACKUP_SCHEDULE=0 2 * * *
      - S3_BUCKET=${S3_BUCKET}
      - S3_ACCESS_KEY=${S3_ACCESS_KEY}
      - S3_SECRET_KEY=${S3_SECRET_KEY}
    command: /scripts/backup-manager.sh

volumes:
  school-postgres-data:
    external: true
  school-redis-data:
    external: true
  school-grafana-data:
    external: true

networks:
  nginx-net:
    external: true
```

### 2. Backup Scripts

```bash
#!/bin/bash
# backup-scripts/backup-manager.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}

# Create backup directory
mkdir -p $BACKUP_DIR

echo -e "${BLUE}🔄 Starting backup process...${NC}"

# Function to create backup
create_backup() {
    local service=$1
    local backup_file="${service}_${DATE}.tar.gz"
    
    echo -e "${BLUE}📦 Creating backup for ${service}...${NC}"
    
    case $service in
        "postgres")
            # PostgreSQL backup
            docker exec school-postgres pg_dump -U school_user -d school_db > $BACKUP_DIR/postgres_${DATE}.sql
            gzip $BACKUP_DIR/postgres_${DATE}.sql
            ;;
        "redis")
            # Redis backup
            docker exec school-redis redis-cli -a ${REDIS_PASSWORD} BGSAVE
            sleep 5
            docker cp school-redis:/data/dump.rdb $BACKUP_DIR/redis_${DATE}.rdb
            gzip $BACKUP_DIR/redis_${DATE}.rdb
            ;;
        "grafana")
            # Grafana backup
            docker exec school-grafana tar -czf /tmp/grafana_${DATE}.tar.gz /var/lib/grafana
            docker cp school-grafana:/tmp/grafana_${DATE}.tar.gz $BACKUP_DIR/
            ;;
        "uploads")
            # Application uploads backup
            tar -czf $BACKUP_DIR/uploads_${DATE}.tar.gz /uploads
            ;;
        "configs")
            # Configuration files backup
            tar -czf $BACKUP_DIR/configs_${DATE}.tar.gz /configs
            ;;
    esac
    
    echo -e "${GREEN}✅ Backup created: ${backup_file}${NC}"
}

# Function to upload to S3
upload_to_s3() {
    local file=$1
    local s3_path="s3://${S3_BUCKET}/backups/${file}"
    
    if [ ! -z "$S3_BUCKET" ]; then
        echo -e "${BLUE}☁️  Uploading ${file} to S3...${NC}"
        aws s3 cp $BACKUP_DIR/$file $s3_path
        echo -e "${GREEN}✅ Uploaded to S3: ${s3_path}${NC}"
    fi
}

# Function to cleanup old backups
cleanup_old_backups() {
    echo -e "${BLUE}🧹 Cleaning up old backups...${NC}"
    find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
    find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
    find $BACKUP_DIR -name "*.rdb.gz" -mtime +$RETENTION_DAYS -delete
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Main backup process
main() {
    # Create backups
    create_backup "postgres"
    create_backup "redis"
    create_backup "grafana"
    create_backup "uploads"
    create_backup "configs"
    
    # Upload to S3
    for file in $(ls $BACKUP_DIR/*_${DATE}*); do
        upload_to_s3 $(basename $file)
    done
    
    # Cleanup old backups
    cleanup_old_backups
    
    echo -e "${GREEN}🎉 Backup process completed successfully!${NC}"
}

# Run main function
main
```

### 3. Restore Scripts

```bash
#!/bin/bash
# backup-scripts/restore-manager.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="/backups"
RESTORE_DATE=$1

if [ -z "$RESTORE_DATE" ]; then
    echo -e "${RED}❌ Please provide restore date (YYYYMMDD_HHMMSS)${NC}"
    echo "Usage: $0 20240101_020000"
    exit 1
fi

echo -e "${BLUE}🔄 Starting restore process for date: ${RESTORE_DATE}${NC}"

# Function to restore backup
restore_backup() {
    local service=$1
    local backup_file=""
    
    case $service in
        "postgres")
            backup_file="postgres_${RESTORE_DATE}.sql.gz"
            if [ -f "$BACKUP_DIR/$backup_file" ]; then
                echo -e "${BLUE}📦 Restoring PostgreSQL backup...${NC}"
                gunzip -c $BACKUP_DIR/$backup_file | docker exec -i school-postgres psql -U school_user -d school_db
                echo -e "${GREEN}✅ PostgreSQL restored${NC}"
            else
                echo -e "${YELLOW}⚠️  PostgreSQL backup not found: ${backup_file}${NC}"
            fi
            ;;
        "redis")
            backup_file="redis_${RESTORE_DATE}.rdb.gz"
            if [ -f "$BACKUP_DIR/$backup_file" ]; then
                echo -e "${BLUE}📦 Restoring Redis backup...${NC}"
                docker-compose -f docker-compose.redis.yml stop redis
                gunzip -c $BACKUP_DIR/$backup_file > /tmp/dump.rdb
                docker cp /tmp/dump.rdb school-redis:/data/dump.rdb
                docker-compose -f docker-compose.redis.yml start redis
                echo -e "${GREEN}✅ Redis restored${NC}"
            else
                echo -e "${YELLOW}⚠️  Redis backup not found: ${backup_file}${NC}"
            fi
            ;;
        "grafana")
            backup_file="grafana_${RESTORE_DATE}.tar.gz"
            if [ -f "$BACKUP_DIR/$backup_file" ]; then
                echo -e "${BLUE}📦 Restoring Grafana backup...${NC}"
                docker-compose -f docker-compose.monitoring.yml stop grafana
                docker cp $BACKUP_DIR/$backup_file school-grafana:/tmp/
                docker exec school-grafana tar -xzf /tmp/$(basename $backup_file) -C /
                docker-compose -f docker-compose.monitoring.yml start grafana
                echo -e "${GREEN}✅ Grafana restored${NC}"
            else
                echo -e "${YELLOW}⚠️  Grafana backup not found: ${backup_file}${NC}"
            fi
            ;;
        "uploads")
            backup_file="uploads_${RESTORE_DATE}.tar.gz"
            if [ -f "$BACKUP_DIR/$backup_file" ]; then
                echo -e "${BLUE}📦 Restoring uploads backup...${NC}"
                tar -xzf $BACKUP_DIR/$backup_file -C /
                echo -e "${GREEN}✅ Uploads restored${NC}"
            else
                echo -e "${YELLOW}⚠️  Uploads backup not found: ${backup_file}${NC}"
            fi
            ;;
        "configs")
            backup_file="configs_${RESTORE_DATE}.tar.gz"
            if [ -f "$BACKUP_DIR/$backup_file" ]; then
                echo -e "${BLUE}📦 Restoring configs backup...${NC}"
                tar -xzf $BACKUP_DIR/$backup_file -C /
                echo -e "${GREEN}✅ Configs restored${NC}"
            else
                echo -e "${YELLOW}⚠️  Configs backup not found: ${backup_file}${NC}"
            fi
            ;;
    esac
}

# Function to download from S3
download_from_s3() {
    local file=$1
    local s3_path="s3://${S3_BUCKET}/backups/${file}"
    
    if [ ! -z "$S3_BUCKET" ]; then
        echo -e "${BLUE}☁️  Downloading ${file} from S3...${NC}"
        aws s3 cp $s3_path $BACKUP_DIR/$file
        echo -e "${GREEN}✅ Downloaded from S3: ${file}${NC}"
    fi
}

# Main restore process
main() {
    # Download from S3 if needed
    for service in postgres redis grafana uploads configs; do
        case $service in
            "postgres")
                download_from_s3 "postgres_${RESTORE_DATE}.sql.gz"
                ;;
            "redis")
                download_from_s3 "redis_${RESTORE_DATE}.rdb.gz"
                ;;
            "grafana")
                download_from_s3 "grafana_${RESTORE_DATE}.tar.gz"
                ;;
            "uploads")
                download_from_s3 "uploads_${RESTORE_DATE}.tar.gz"
                ;;
            "configs")
                download_from_s3 "configs_${RESTORE_DATE}.tar.gz"
                ;;
        esac
    done
    
    # Restore backups
    restore_backup "postgres"
    restore_backup "redis"
    restore_backup "grafana"
    restore_backup "uploads"
    restore_backup "configs"
    
    echo -e "${GREEN}🎉 Restore process completed successfully!${NC}"
}

# Run main function
main
```

## 🚀 Deployment Steps

### 1. Setup Backup Environment

```bash
# Create backup directories
mkdir -p backup-scripts backups

# Copy backup scripts
cp backup-scripts/* ./

# Make scripts executable
chmod +x backup-scripts/*.sh
```

### 2. Configure Environment Variables

```bash
# Add to your .env file
S3_BUCKET=your-backup-bucket
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
REDIS_PASSWORD=your-redis-password
```

### 3. Start Backup Service

```bash
# Start backup service
docker-compose -f docker-compose.backup.yml up -d

# Check status
docker-compose -f docker-compose.backup.yml ps
```

### 4. Test Backup

```bash
# Run manual backup
docker exec school-backup-manager /scripts/backup-manager.sh

# Check backup files
ls -la backups/
```

## 🔧 Configuration

### Backup Schedule

```bash
# Crontab for automated backups
crontab -e

# Add: 0 2 * * * docker exec school-backup-manager /scripts/backup-manager.sh
```

### Retention Policy

| Backup Type | Retention | Description |
|-------------|-----------|-------------|
| Daily | 30 days | Recent backups |
| Weekly | 12 weeks | Monthly backups |
| Monthly | 12 months | Yearly backups |

### S3 Configuration

```bash
# AWS CLI configuration
aws configure

# Test S3 access
aws s3 ls s3://your-backup-bucket/
```

## 📊 Monitoring

### Backup Status

```bash
# Check backup logs
docker logs school-backup-manager

# Check backup files
ls -la backups/

# Check S3 uploads
aws s3 ls s3://your-backup-bucket/backups/
```

### Backup Verification

```bash
# Verify PostgreSQL backup
gunzip -c backups/postgres_20240101_020000.sql.gz | head -20

# Verify Redis backup
file backups/redis_20240101_020000.rdb.gz

# Verify Grafana backup
tar -tzf backups/grafana_20240101_020000.tar.gz | head -10
```

## 🛠️ Troubleshooting

### Common Issues

1. **Backup Failed**
   ```bash
   # Check logs
   docker logs school-backup-manager
   
   # Check disk space
   df -h
   
   # Check permissions
   ls -la backups/
   ```

2. **S3 Upload Failed**
   ```bash
   # Check AWS credentials
   aws sts get-caller-identity
   
   # Check S3 bucket
   aws s3 ls s3://your-backup-bucket/
   ```

3. **Restore Failed**
   ```bash
   # Check backup file integrity
   file backups/postgres_20240101_020000.sql.gz
   
   # Check container status
   docker ps | grep postgres
   ```

### Performance Issues

1. **Slow Backups**
   ```bash
   # Check disk I/O
   iostat -x 1
   
   # Check network speed
   speedtest-cli
   ```

2. **Large Backup Files**
   ```bash
   # Check file sizes
   du -sh backups/*
   
   # Compress old backups
   gzip backups/*.sql
   ```

## 🔒 Security

### Backup Security

1. **Encryption**
   ```bash
   # Encrypt backups
   gpg --symmetric --cipher-algo AES256 backup.sql
   ```

2. **Access Control**
   ```bash
   # Set proper permissions
   chmod 600 backups/*
   chown root:root backups/*
   ```

3. **S3 Security**
   ```bash
   # Enable S3 encryption
   aws s3api put-bucket-encryption --bucket your-backup-bucket --server-side-encryption-configuration '{
     "Rules": [{
       "ApplyServerSideEncryptionByDefault": {
         "SSEAlgorithm": "AES256"
       }
     }]
   }'
   ```

## 📈 Disaster Recovery

### Recovery Procedures

1. **Complete System Recovery**
   ```bash
   # Stop all services
   docker-compose down
   
   # Restore from latest backup
   ./restore-manager.sh 20240101_020000
   
   # Start services
   docker-compose up -d
   ```

2. **Partial Recovery**
   ```bash
   # Restore specific service
   restore_backup "postgres"
   restore_backup "redis"
   ```

3. **Data Migration**
   ```bash
   # Export data
   docker exec school-postgres pg_dump -U school_user -d school_db > export.sql
   
   # Import data
   docker exec -i school-postgres psql -U school_user -d school_db < export.sql
   ```

## 🎯 Best Practices

1. **Backup Strategy**
   ```bash
   # Regular automated backups
   # Test restore procedures
   # Monitor backup success
   # Store backups offsite
   ```

2. **Recovery Testing**
   ```bash
   # Test restore procedures
   # Verify data integrity
   # Document recovery steps
   # Train team members
   ```

3. **Security**
   ```bash
   # Encrypt sensitive data
   # Secure backup storage
   # Control access
   # Regular security audits
   ```

## 📞 Support

- **AWS S3 Documentation**: https://docs.aws.amazon.com/s3/
- **PostgreSQL Backup**: https://www.postgresql.org/docs/current/backup.html
- **Redis Backup**: https://redis.io/docs/management/persistence/
- **Issues**: [GitHub Issues](https://github.com/sandikodev/v0-website-for-school/issues)

---

**Note**: Pastikan nginx-net network sudah dibuat sebelum menjalankan backup services.
