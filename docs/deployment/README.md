# 🚀 Deployment Guide

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 18.0 or higher
- **pnpm**: Package manager
- **Git**: Version control
- **Domain**: Configured domain with DNS access

### Environment Setup
- **Production Server**: VPS, dedicated server, or cloud platform
- **SSL Certificate**: Valid SSL certificate for domain
- **Domain Configuration**: DNS records configured

## 🌐 Domain Configuration

### DNS Records Setup
```bash
# A Records
www.smpitmasjidsyuhada.sch.id    A    [Your Server IP]
cms.smpitmasjidsyuhada.sch.id    A    [WordPress Server IP]

# CNAME Records (if using CDN)
www.smpitmasjidsyuhada.sch.id    CNAME    [CDN Domain]
cms.smpitmasjidsyuhada.sch.id    CNAME    [CDN Domain]

# Redirect Configuration
smpitmasjidsyuhada.sch.id    →    www.smpitmasjidsyuhada.sch.id (301 redirect)
```

### SSL Certificate
- **Wildcard Certificate**: `*.smpitmasjidsyuhada.sch.id`
- **Or Separate Certificates**: For each subdomain
- **Auto-renewal**: Configure automatic renewal

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

#### Setup Steps
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy project
   vercel
   ```

2. **Configure Domain**
   ```bash
   # Add custom domain
   vercel domains add www.smpitmasjidsyuhada.sch.id
   
   # Configure redirects
   vercel redirects add smpitmasjidsyuhada.sch.id www.smpitmasjidsyuhada.sch.id 301
   ```

3. **Environment Variables**
   ```bash
   # Set production environment variables
   vercel env add NEXT_PUBLIC_SITE_URL production
   vercel env add NEXT_PUBLIC_CMS_URL production
   ```

#### Vercel Configuration
```json
{
  "domains": ["www.smpitmasjidsyuhada.sch.id"],
  "redirects": [
    {
      "source": "https://smpitmasjidsyuhada.sch.id",
      "destination": "https://www.smpitmasjidsyuhada.sch.id",
      "permanent": true
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Option 2: Netlify

#### Setup Steps
1. **Connect Repository**
   ```bash
   # Install Netlify CLI
   npm i -g netlify-cli
   
   # Login to Netlify
   netlify login
   
   # Deploy project
   netlify deploy --prod
   ```

2. **Configure Domain**
   ```bash
   # Add custom domain
   netlify domains:add www.smpitmasjidsyuhada.sch.id
   
   # Configure redirects
   netlify redirects:add smpitmasjidsyuhada.sch.id www.smpitmasjidsyuhada.sch.id 301
   ```

#### Netlify Configuration
```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = ".next"

[[redirects]]
  from = "https://smpitmasjidsyuhada.sch.id"
  to = "https://www.smpitmasjidsyuhada.sch.id"
  status = 301

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Option 3: Custom Server (VPS/Dedicated)

#### Server Setup
1. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install pnpm
   npm install -g pnpm
   
   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/your-repo/v0-website-for-school.git
   cd v0-website-for-school
   
   # Install dependencies
   pnpm install
   
   # Build application
   pnpm build
   
   # Start application
   pnpm start
   ```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/www.smpitmasjidsyuhada.sch.id
server {
    listen 80;
    server_name smpitmasjidsyuhada.sch.id;
    return 301 https://www.smpitmasjidsyuhada.sch.id$request_uri;
}

server {
    listen 443 ssl;
    server_name www.smpitmasjidsyuhada.sch.id;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🔧 Environment Configuration

### Production Environment Variables
```bash
# .env.production
NEXT_PUBLIC_SITE_URL=https://www.smpitmasjidsyuhada.sch.id
NEXT_PUBLIC_CMS_URL=https://cms.smpitmasjidsyuhada.sch.id
NEXT_PUBLIC_SITE_NAME="SMP IT Masjid Syuhada"
NEXT_PUBLIC_SITE_DESCRIPTION="Sekolah Menengah Pertama Islam Terpadu - Mencetak Generasi Qurani"

# API Configuration (if needed)
API_BASE_URL=https://cms.smpitmasjidsyuhada.sch.id/wp-json/wp/v2
```

### Development Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CMS_URL=http://localhost:8080
NEXT_PUBLIC_SITE_NAME="SMP IT Masjid Syuhada (Dev)"
NEXT_PUBLIC_SITE_DESCRIPTION="Development Environment"
```

## 📊 Performance Optimization

### Build Optimization
```bash
# Production build
pnpm build

# Analyze bundle size
pnpm analyze

# Check for unused dependencies
pnpm audit
```

### Caching Strategy
- **Static Assets**: CDN caching for images and fonts
- **API Responses**: Client-side caching with localStorage
- **Page Caching**: Next.js automatic page caching

### Monitoring Setup
- **Uptime Monitoring**: Service uptime tracking
- **Performance Monitoring**: Core Web Vitals tracking
- **Error Tracking**: Error logging and monitoring

## 🔒 Security Configuration

### Security Headers
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

### SSL Configuration
- **TLS 1.2+**: Minimum TLS version
- **HSTS**: HTTP Strict Transport Security
- **Certificate Pinning**: Certificate validation

## 🧪 Testing Deployment

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Build successful
- [ ] Environment variables configured
- [ ] Domain DNS configured
- [ ] SSL certificate installed
- [ ] Security headers configured

### Post-deployment Testing
- [ ] Website loads correctly
- [ ] All pages accessible
- [ ] Forms working properly
- [ ] Mobile responsiveness
- [ ] SEO meta tags present
- [ ] Sitemap accessible
- [ ] Robots.txt accessible

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install pnpm
      run: npm install -g pnpm
      
    - name: Install dependencies
      run: pnpm install
      
    - name: Run tests
      run: pnpm test
      
    - name: Build application
      run: pnpm build
      
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Support & Troubleshooting

### Common Issues
1. **Build Failures**: Check Node.js version and dependencies
2. **Domain Issues**: Verify DNS configuration
3. **SSL Issues**: Check certificate installation
4. **Performance Issues**: Analyze bundle size and caching

### Getting Help
- Check the [Troubleshooting Guide](./troubleshooting.md)
- Review [Known Issues](./known-issues.md)
- Contact development team for support
