# Deployment Scripts

## 📁 Folder Structure

```
scripts/
├── README.md                    # This file
├── deploy.sh                    # Base deployment script (legacy)
├── dev/                         # Development Scripts
│   └── deploy-dev.sh            # Development deployment script
├── staging/                     # Staging Scripts
│   └── deploy-staging.sh        # Staging deployment script
└── prod/                        # Production Scripts
    └── deploy-production.sh     # Production deployment script
```

## 🚀 Usage

### Development
```bash
cd scripts/dev
./deploy-dev.sh
```

### Staging
```bash
cd scripts/staging
./deploy-staging.sh
```

### Production
```bash
cd scripts/prod
./deploy-production.sh
```

## 🔧 Script Features

Each script includes:
- ✅ Environment validation
- ✅ Docker health checks
- ✅ SSL certificate verification
- ✅ Deployment status reporting
- ✅ Error handling and rollback

## 📋 Prerequisites

Before running scripts:
1. Ensure Docker is running
2. Copy environment files from `config/` folder
3. Edit environment variables as needed
4. For staging/production: ensure nginx-proxy is running

## 🛠️ Script Configuration

Scripts automatically:
- Check Docker status
- Validate environment variables
- Create necessary directories
- Build and start containers
- Verify deployment health
- Display deployment information

## 📚 Documentation

For detailed documentation, see:
- [Development Deployment](../../docs/deployment/development-deployment.md)
- [Staging Deployment](../../docs/deployment/staging-deployment.md)
- [Production Deployment](../../docs/deployment/production-deployment.md)
- [Deployment Strategy](../../docs/deployment/deployment-strategy.md)
