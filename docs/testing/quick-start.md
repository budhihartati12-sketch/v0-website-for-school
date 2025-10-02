# 🚀 Quick Start Guide - School Website Testing Suite

## ⚡ 5-Minute Setup

### Step 1: Start Testing Environment
```bash
# Start development testing (recommended for daily use)
./test.sh dev

# Or start full environment (dev + staging + prod)
./test.sh full
```

### Step 2: Verify Everything Works
```bash
# Quick smoke test
./test.sh smoke

# Check status
./test.sh status
```

### Step 3: Access Your Application
- **Development**: http://localhost:8080/websekolah-dev/
- **Staging**: http://localhost:8080/websekolah-staging/
- **Production**: http://localhost:8080/websekolah/

### Step 4: Cleanup When Done
```bash
./test.sh cleanup
```

## 🎯 Daily Workflow

### Morning Routine
```bash
# 1. Start development environment
./test.sh dev

# 2. Quick health check
./test.sh health

# 3. Test endpoints
./test.sh test
```

### During Development
```bash
# Quick smoke test
./test.sh smoke

# Check logs if issues
./test.sh logs

# Performance check
./test.sh perf
```

### End of Day
```bash
# Cleanup everything
./test.sh cleanup
```

## 🧪 Testing Commands

### Quick Tests
```bash
./test.sh smoke      # Quick smoke test
./test.sh test       # Test all endpoints
./test.sh health     # Health check
```

### Comprehensive Testing
```bash
./test.sh validate   # Full validation
./test.sh perf       # Performance testing
./test.sh load       # Load testing
./test.sh stress     # Stress testing
```

### Monitoring
```bash
./test.sh status     # Container status
./test.sh logs       # View logs
./test.sh urls       # Show all URLs
```

## 🔧 Environment Management

### Start Environments
```bash
./test.sh dev        # Development only
./test.sh full       # All environments
```

### Stop Environments
```bash
./test.sh stop       # Stop all
./test.sh restart    # Restart all
./test.sh cleanup    # Clean up everything
```

## 🚨 Troubleshooting

### Common Issues

#### "Port already in use"
```bash
# Check what's using the port
lsof -i :8080

# Stop conflicting services
./test.sh stop
```

#### "Container not starting"
```bash
# Check logs
./test.sh logs

# Restart
./test.sh restart
```

#### "Endpoint not responding"
```bash
# Health check
./test.sh health

# Test endpoints
./test.sh test
```

### Getting Help
```bash
./test.sh help       # Show all commands
./test.sh info       # Environment info
./test.sh urls       # All accessible URLs
```

## 📊 Performance Testing

### Quick Performance Check
```bash
./test.sh perf       # Performance comparison
```

### Load Testing
```bash
./test.sh load       # 10 concurrent requests
./test.sh stress     # 50 concurrent requests
```

### Performance Comparison
```bash
./test.sh compare    # Compare all environments
```

## 🎯 Team Roles

### 👨‍💻 Developers
- Use `./test.sh dev` for daily development
- Run `./test.sh smoke` before committing
- Use `./test.sh cleanup` when done

### 🧪 QA Engineers
- Use `./test.sh full` for comprehensive testing
- Run `./test.sh validate` for thorough validation
- Use `./test.sh perf` for performance testing

### 🔧 DevOps Engineers
- Monitor with `./test.sh status`
- Check logs with `./test.sh logs`
- Run load tests with `./test.sh load`

## 📈 Evaluation & Monitoring

### Daily Evaluation
- **Morning**: `./test.sh health`
- **During Development**: `./test.sh smoke`
- **Before Commit**: `./test.sh test`
- **Evening**: `./test.sh cleanup`

### Weekly Evaluation
- **Monday**: `./test.sh validate`
- **Wednesday**: `./test.sh perf`
- **Friday**: `./test.sh load`

### Monthly Review
- **Performance Analysis**: `./test.sh compare`
- **Comprehensive Testing**: `./test.sh validate`
- **Load Testing**: `./test.sh stress`

## 🔮 What's Next?

### Immediate Actions
1. **Start using**: `./test.sh dev`
2. **Test endpoints**: `./test.sh test`
3. **Check performance**: `./test.sh perf`

### Next Steps
1. **Integrate with CI/CD**
2. **Add monitoring dashboards**
3. **Implement automated testing**
4. **Create performance baselines**

### Future Enhancements
- **API Testing Suite**
- **Database Testing**
- **Security Testing**
- **Automated Reports**

## 📞 Support

- **Documentation**: `docs/testing/README.md`
- **Issues**: Create GitHub issue
- **Questions**: Ask in team chat
- **Emergency**: Contact DevOps team

---

**Ready to start?** Run `./test.sh dev` and begin testing! 🚀
