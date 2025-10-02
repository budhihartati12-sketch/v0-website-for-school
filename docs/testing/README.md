# 🧪 School Website Testing Suite Documentation

## 📋 Overview

The School Website Testing Suite adalah toolkit komprehensif untuk testing semua environment (development, staging, production) dengan mudah dan efisien. Toolkit ini dirancang untuk memudahkan tim development dalam melakukan testing, monitoring, dan validasi aplikasi.

## 🚀 Quick Start

### Prerequisites
- Docker dan Docker Compose terinstall
- Port 8080, 3001, 3002, 3003 tersedia
- Akses ke direktori project

### Getting Started
```bash
# 1. Start development testing environment
./test.sh dev

# 2. Test all endpoints
./test.sh test

# 3. Check status
./test.sh status

# 4. Cleanup when done
./test.sh cleanup
```

## 📁 Script Structure

```
scripts/
├── test/
│   └── setup-test-env.sh          # Main environment setup script
├── testing/
│   ├── quick-test.sh              # Quick testing commands
│   └── perf-test.sh               # Performance testing suite
└── test.sh                        # Main testing script (entry point)
```

## 🎯 Available Commands

### 🚀 Environment Management
- `./test.sh dev` - Start development testing environment
- `./test.sh full` - Start full testing environment (dev + staging + prod)
- `./test.sh stop` - Stop all testing environments
- `./test.sh restart` - Restart all testing environments
- `./test.sh cleanup` - Clean up all testing containers

### 📊 Status & Monitoring
- `./test.sh status` - Check container status
- `./test.sh logs` - Show logs for all containers
- `./test.sh health` - Health check for all services

### 🧪 Testing & Validation
- `./test.sh test` - Test all endpoints
- `./test.sh validate` - Comprehensive validation test
- `./test.sh smoke` - Quick smoke test

### ⚡ Performance Testing
- `./test.sh perf` - Performance testing suite
- `./test.sh load` - Load testing
- `./test.sh stress` - Stress testing
- `./test.sh compare` - Compare environment performance

### 🔧 Utilities
- `./test.sh info` - Show environment information
- `./test.sh urls` - Show all accessible URLs
- `./test.sh help` - Show help message

## 🌐 Access URLs

### Through Nginx Proxy (Port 8080)
- **Development**: http://localhost:8080/websekolah-dev/
- **Staging**: http://localhost:8080/websekolah-staging/
- **Production**: http://localhost:8080/websekolah/

### Direct Container Access
- **Development**: http://localhost:3001/
- **Staging**: http://localhost:3002/
- **Production**: http://localhost:3003/

## 🔧 Configuration Files

### Docker Compose Files
- `docker/test/docker-compose.dev-test.yml` - Development testing environment
- `docker/test/docker-compose.test.yml` - Full testing environment

### Nginx Configuration
- `docker/test/nginx-dev-test.conf` - Development nginx config
- `docker/test/nginx-test.conf` - Full environment nginx config

## 📊 Performance Benchmarks

### Current Performance (Latest Test)
- **Development**: ~0.044s (49.8KB)
- **Staging**: ~0.020s (49.8KB)
- **Production**: ~0.018s (49.8KB)
- **Direct Access**: ~0.022-0.024s

### Load Testing Results
- **10 Concurrent Requests**: All environments handle well
- **50 Concurrent Requests**: Stable performance maintained
- **No Errors**: All requests successful

## 🛠️ Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :8080
lsof -i :3001
lsof -i :3002
lsof -i :3003

# Stop conflicting services or change ports
```

#### 2. Container Build Failures
```bash
# Clean Docker cache
docker system prune -a

# Rebuild with no cache
./test.sh cleanup
./test.sh full
```

#### 3. Nginx Routing Issues
```bash
# Check nginx logs
./test.sh logs

# Test nginx configuration
docker exec nginx-test nginx -t
```

#### 4. Application Not Starting
```bash
# Check application logs
docker logs school-website-dev-test
docker logs school-website-staging-test
docker logs school-website-prod-test

# Restart containers
./test.sh restart
```

## 📈 Monitoring & Evaluation

### Daily Testing Workflow
1. **Morning Setup**: `./test.sh dev`
2. **Quick Check**: `./test.sh smoke`
3. **Full Testing**: `./test.sh validate`
4. **Performance Check**: `./test.sh perf`
5. **Evening Cleanup**: `./test.sh cleanup`

### Weekly Evaluation
1. **Load Testing**: `./test.sh load`
2. **Stress Testing**: `./test.sh stress`
3. **Performance Comparison**: `./test.sh compare`
4. **Health Check**: `./test.sh health`

### Monthly Review
1. **Comprehensive Validation**: `./test.sh validate`
2. **Performance Analysis**: `./test.sh perf`
3. **Environment Comparison**: `./test.sh compare`
4. **Documentation Update**: Review and update docs

## 🎯 Team Guidelines

### For Developers
- Use `./test.sh dev` for daily development
- Run `./test.sh test` before committing
- Use `./test.sh smoke` for quick checks
- Clean up with `./test.sh cleanup` when done

### For QA Engineers
- Use `./test.sh full` for comprehensive testing
- Run `./test.sh validate` for thorough validation
- Use `./test.sh perf` for performance testing
- Monitor with `./test.sh health`

### For DevOps Engineers
- Monitor with `./test.sh status`
- Check logs with `./test.sh logs`
- Run load tests with `./test.sh load`
- Use `./test.sh stress` for capacity planning

## 🔮 Future Roadmap

### Phase 1: Enhanced Monitoring (Next Sprint)
- [ ] Add Prometheus metrics collection
- [ ] Implement Grafana dashboards
- [ ] Add alerting for performance degradation
- [ ] Create automated health checks

### Phase 2: Advanced Testing (Next Month)
- [ ] Add API testing suite
- [ ] Implement database testing
- [ ] Add security testing
- [ ] Create automated test reports

### Phase 3: CI/CD Integration (Next Quarter)
- [ ] Integrate with GitHub Actions
- [ ] Add automated testing pipeline
- [ ] Implement deployment testing
- [ ] Create rollback testing

### Phase 4: Advanced Analytics (Future)
- [ ] Add performance analytics
- [ ] Implement user behavior testing
- [ ] Add A/B testing capabilities
- [ ] Create predictive performance modeling

## 📚 Additional Resources

- [Testing Environment Quick Start](testing-environment-quick-start.md)
- [Troubleshooting Guide](testing-environment-troubleshooting.md)
- [Performance Testing Guide](performance-testing-guide.md)
- [Team Workflow Guide](team-workflow-guide.md)

## 🤝 Contributing

### Adding New Tests
1. Create test script in `scripts/testing/`
2. Add command to main `test.sh`
3. Update documentation
4. Test thoroughly
5. Submit PR

### Reporting Issues
1. Check troubleshooting guide
2. Run `./test.sh info` for environment details
3. Collect logs with `./test.sh logs`
4. Create issue with full details

## 📞 Support

- **Documentation**: Check this guide first
- **Issues**: Create GitHub issue
- **Questions**: Ask in team chat
- **Emergency**: Contact DevOps team

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team
