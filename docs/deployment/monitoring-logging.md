# Monitoring & Logging Setup Guide

## 📊 Overview

Panduan lengkap untuk setup monitoring dan logging untuk aplikasi website sekolah dengan Docker.

## 📋 Prerequisites

- Docker dan Docker Compose terinstall
- nginx-proxy sudah berjalan
- nginx-net network sudah dibuat

## 🏗️ Monitoring Architecture

```
school-website → prometheus → grafana
        ↓
    nginx-net network
```

## 🐳 Monitoring Setup

### 1. Prometheus & Grafana Docker Compose

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: school-prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    networks:
      - nginx-net
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'

  grafana:
    image: grafana/grafana:latest
    container_name: school-grafana
    restart: unless-stopped
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_SERVER_ROOT_URL=https://grafana.${DOMAIN}
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/datasources:/etc/grafana/provisioning/datasources
    networks:
      - nginx-net
    ports:
      - "3001:3000"
    depends_on:
      - prometheus

  node-exporter:
    image: prom/node-exporter:latest
    container_name: school-node-exporter
    restart: unless-stopped
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    networks:
      - nginx-net
    ports:
      - "9100:9100"
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: school-cadvisor
    restart: unless-stopped
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker:/var/lib/docker:ro
      - /dev/disk/:/dev/disk:ro
    networks:
      - nginx-net
    ports:
      - "8080:8080"
    privileged: true
    devices:
      - /dev/kmsg

volumes:
  prometheus-data:
  grafana-data:

networks:
  nginx-net:
    external: true
```

### 2. Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']

  - job_name: 'school-website'
    static_configs:
      - targets: ['school-website:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 30s

  - job_name: 'nginx-proxy'
    static_configs:
      - targets: ['nginx-proxy:80']
    metrics_path: '/nginx_status'
    scrape_interval: 30s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

### 3. Grafana Data Sources

```yaml
# grafana/datasources/prometheus.yml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
```

### 4. Grafana Dashboards

```yaml
# grafana/dashboards/dashboard.yml
apiVersion: 1

providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /etc/grafana/provisioning/dashboards
```

## 🚀 Deployment Steps

### 1. Start Monitoring

```bash
# Start monitoring services
docker-compose -f docker-compose.monitoring.yml up -d

# Check status
docker-compose -f docker-compose.monitoring.yml ps
```

### 2. Verify Monitoring

```bash
# Check Prometheus
curl http://localhost:9090/api/v1/targets

# Check Grafana
curl http://localhost:3001/api/health

# Check Node Exporter
curl http://localhost:9100/metrics

# Check cAdvisor
curl http://localhost:8080/metrics
```

### 3. Access Monitoring

```bash
# Access Prometheus at http://your-vps-ip:9090
# Access Grafana at http://your-vps-ip:3001
# Login: admin / ${GRAFANA_PASSWORD}
```

## 🔧 Configuration

### Environment Variables

```bash
# Add to your .env file
GRAFANA_PASSWORD=your-grafana-password
DOMAIN=your-domain.com
```

### Application Metrics

```typescript
// lib/metrics.ts
import { register, Counter, Histogram, Gauge } from 'prom-client'

// Create metrics
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
})

const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
})

const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
})

// Export metrics
export { httpRequestDuration, httpRequestTotal, activeConnections }
```

### Metrics Endpoint

```typescript
// app/api/metrics/route.ts
import { register } from 'prom-client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const metrics = await register.metrics()
    return new NextResponse(metrics, {
      headers: {
        'Content-Type': register.contentType
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate metrics' },
      { status: 500 }
    )
  }
}
```

## 📊 Logging Setup

### 1. Logging Docker Compose

```yaml
# docker-compose.logging.yml
version: '3.8'

services:
  loki:
    image: grafana/loki:latest
    container_name: school-loki
    restart: unless-stopped
    volumes:
      - ./loki.yml:/etc/loki/local-config.yaml
      - loki-data:/loki
    networks:
      - nginx-net
    ports:
      - "3100:3100"

  promtail:
    image: grafana/promtail:latest
    container_name: school-promtail
    restart: unless-stopped
    volumes:
      - ./promtail.yml:/etc/promtail/config.yml
      - /var/log:/var/log:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
    networks:
      - nginx-net
    depends_on:
      - loki

volumes:
  loki-data:

networks:
  nginx-net:
    external: true
```

### 2. Loki Configuration

```yaml
# loki.yml
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
    final_sleep: 0s
  chunk_idle_period: 1h
  max_chunk_age: 1h
  chunk_target_size: 1048576
  chunk_retain_period: 30s
  max_transfer_retries: 0

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 168h

storage_config:
  boltdb:
    directory: /loki/index

  filesystem:
    directory: /loki/chunks

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h
  max_cache_freshness_per_query: 10m
  split_queries_by_interval: 15m
  max_query_parallelism: 32
  max_streams_per_user: 0
  max_line_size: 256000
```

### 3. Promtail Configuration

```yaml
# promtail.yml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: containers
    static_configs:
      - targets:
          - localhost
        labels:
          job: containerlogs
          __path__: /var/lib/docker/containers/*/*log

    pipeline_stages:
      - json:
          expressions:
            output: log
            stream: stream
            attrs:
      - json:
          expressions:
            tag:
          source: attrs
      - regex:
          expression: (?P<container_name>(?:[^|]*))\|
          source: tag
      - timestamp:
          format: RFC3339Nano
          source: time
      - labels:
          stream:
          container_name:
      - output:
          source: output

  - job_name: system
    static_configs:
      - targets:
          - localhost
        labels:
          job: varlogs
          __path__: /var/log/*log

    pipeline_stages:
      - timestamp:
          format: RFC3339Nano
          source: time
      - labels:
          level:
      - output:
          source: output
```

## 📊 Monitoring Dashboards

### 1. System Dashboard

```json
{
  "dashboard": {
    "id": null,
    "title": "System Overview",
    "tags": ["system"],
    "timezone": "browser",
    "panels": [
      {
        "title": "CPU Usage",
        "type": "stat",
        "targets": [
          {
            "expr": "100 - (avg by (instance) (irate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)",
            "legendFormat": "CPU Usage %"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "type": "stat",
        "targets": [
          {
            "expr": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100",
            "legendFormat": "Memory Usage %"
          }
        ]
      },
      {
        "title": "Disk Usage",
        "type": "stat",
        "targets": [
          {
            "expr": "100 - ((node_filesystem_avail_bytes * 100) / node_filesystem_size_bytes)",
            "legendFormat": "Disk Usage %"
          }
        ]
      }
    ]
  }
}
```

### 2. Application Dashboard

```json
{
  "dashboard": {
    "id": null,
    "title": "Application Metrics",
    "tags": ["application"],
    "panels": [
      {
        "title": "HTTP Requests",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      }
    ]
  }
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **Prometheus Not Scraping**
   ```bash
   # Check targets
   curl http://localhost:9090/api/v1/targets
   
   # Check configuration
   docker exec school-prometheus cat /etc/prometheus/prometheus.yml
   ```

2. **Grafana Not Loading**
   ```bash
   # Check logs
   docker logs school-grafana
   
   # Check data sources
   curl http://localhost:3001/api/datasources
   ```

3. **Metrics Not Available**
   ```bash
   # Check application metrics endpoint
   curl http://localhost:3000/api/metrics
   
   # Check Prometheus targets
   curl http://localhost:9090/api/v1/targets
   ```

### Performance Issues

1. **High Memory Usage**
   ```bash
   # Check Prometheus memory
   docker stats school-prometheus
   
   # Check Grafana memory
   docker stats school-grafana
   ```

2. **Slow Queries**
   ```bash
   # Check Prometheus query performance
   curl http://localhost:9090/api/v1/query?query=up
   ```

## 🔒 Security

### Access Control

```yaml
# grafana.ini
[security]
admin_user = admin
admin_password = ${GRAFANA_PASSWORD}

[auth.anonymous]
enabled = false

[auth.basic]
enabled = true
```

### Network Security

```yaml
# Only expose to nginx-net
networks:
  - nginx-net
```

## 📈 Scaling

### Horizontal Scaling

```yaml
# Scale Prometheus
services:
  prometheus:
    deploy:
      replicas: 2
```

### Load Balancing

```yaml
# Add load balancer
services:
  nginx-lb:
    image: nginx:alpine
    ports:
      - "9090:80"
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
```

## 🎯 Best Practices

1. **Monitoring Strategy**
   ```bash
   # Set up alerts
   # Monitor key metrics
   # Regular health checks
   # Performance monitoring
   ```

2. **Logging Strategy**
   ```bash
   # Centralized logging
   # Log rotation
   # Error tracking
   # Performance logging
   ```

3. **Security**
   ```bash
   # Access control
   # Network isolation
   # Regular updates
   # Backup monitoring data
   ```

## 📞 Support

- **Prometheus Documentation**: https://prometheus.io/docs/
- **Grafana Documentation**: https://grafana.com/docs/
- **Loki Documentation**: https://grafana.com/docs/loki/
- **Issues**: [GitHub Issues](https://github.com/sandikodev/v0-website-for-school/issues)

---

**Note**: Pastikan nginx-net network sudah dibuat sebelum menjalankan monitoring services.
