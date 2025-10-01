# Docker Configuration Structure

## 📁 Folder Structure

```
docker/
├── README.md                    # This file
├── docker-compose.yml           # Base Docker Compose (legacy)
├── dev/                         # Development Environment
│   └── docker-compose.dev.yml   # Development Docker Compose
├── staging/                     # Staging Environment
│   └── docker-compose.staging.yml # Staging Docker Compose
└── prod/                        # Production Environment
    └── docker-compose.prod.yml  # Production Docker Compose
```

## 🚀 Usage

### Development
```bash
cd docker/dev
docker-compose -f docker-compose.dev.yml up -d
```

### Staging
```bash
cd docker/staging
docker-compose -f docker-compose.staging.yml up -d
```

### Production
```bash
cd docker/prod
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Configuration Files

Each environment has its own configuration:
- **Development**: Local development with hot reload
- **Staging**: Testing environment with monitoring
- **Production**: Live environment with high availability

## 📋 Environment Variables

Environment variables are stored in `config/` folder:
- `config/env.dev.example` - Development environment
- `config/env.staging.example` - Staging environment
- `config/env.prod.example` - Production environment

## 🛠️ Deployment Scripts

Deployment scripts are stored in `scripts/` folder:
- `scripts/dev/deploy-dev.sh` - Development deployment
- `scripts/staging/deploy-staging.sh` - Staging deployment
- `scripts/prod/deploy-production.sh` - Production deployment

## 📚 Documentation

For detailed documentation, see:
- [Development Deployment](../../docs/deployment/development-deployment.md)
- [Staging Deployment](../../docs/deployment/staging-deployment.md)
- [Production Deployment](../../docs/deployment/production-deployment.md)
- [Deployment Strategy](../../docs/deployment/deployment-strategy.md)
