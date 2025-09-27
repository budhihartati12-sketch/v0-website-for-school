# 🌐 Domain Setup Guide

## 📋 Overview

This guide covers the complete domain configuration for SMP IT Masjid Syuhada website, including DNS setup, SSL certificates, and domain structure.

## 🏗️ Domain Structure

### Production Domains
- **Public Website**: `www.smpitmasjidsyuhada.sch.id`
- **CMS Admin**: `cms.smpitmasjidsyuhada.sch.id`
- **Root Domain**: `smpitmasjidsyuhada.sch.id` (redirects to www)

### Domain Purpose
- **www subdomain**: Public-facing website (Next.js)
- **cms subdomain**: Content management system (WordPress)
- **Root domain**: Redirects to www for SEO consistency

## 🔧 DNS Configuration

### A Records
```bash
# Main website (Next.js)
www.smpitmasjidsyuhada.sch.id    A    [Your Next.js Server IP]

# CMS admin (WordPress)
cms.smpitmasjidsyuhada.sch.id    A    [Your WordPress Server IP]
```

### CNAME Records (if using CDN)
```bash
# CDN configuration
www.smpitmasjidsyuhada.sch.id    CNAME    [CDN Domain]
cms.smpitmasjidsyuhada.sch.id    CNAME    [CDN Domain]
```

### Redirect Configuration
```bash
# Root domain redirect
smpitmasjidsyuhada.sch.id    →    www.smpitmasjidsyuhada.sch.id (301 redirect)
```

## 🔒 SSL Certificate Setup

### Wildcard Certificate (Recommended)
```bash
# Wildcard certificate for all subdomains
*.smpitmasjidsyuhada.sch.id
```

### Separate Certificates (Alternative)
```bash
# Individual certificates
www.smpitmasjidsyuhada.sch.id
cms.smpitmasjidsyuhada.sch.id
```

### SSL Configuration
- **TLS Version**: 1.2 or higher
- **Cipher Suites**: Modern, secure ciphers
- **HSTS**: HTTP Strict Transport Security
- **Certificate Pinning**: Optional for enhanced security

## 🚀 Deployment Strategy

### Next.js Frontend (www subdomain)
- **Purpose**: Public-facing website
- **Content**: School information, admissions, contact
- **Users**: General public, prospective students/parents
- **SEO**: Fully optimized with sitemap.xml

### WordPress CMS (cms subdomain)
- **Purpose**: Content management system
- **Content**: Admin panel, media management, content editing
- **Users**: School administrators, content managers
- **Access**: Restricted, password protected

## 📊 Benefits of This Structure

### SEO & Performance
- **Clean separation** of public and admin content
- **Better SEO** for public pages
- **Faster loading** for public website
- **No admin bloat** affecting public site

### Security
- **Admin panel isolated** from public site
- **Reduced attack surface** for public website
- **Better access control** for CMS
- **Separate security configurations**

### Maintenance
- **Independent updates** for frontend and CMS
- **Easier backup strategies**
- **Better scalability**
- **Clear separation of concerns**

## 🛠️ Implementation Steps

### Step 1: DNS Configuration
1. **Access DNS Management**
   - Login to domain registrar
   - Navigate to DNS settings

2. **Add A Records**
   ```bash
   www.smpitmasjidsyuhada.sch.id    A    [Next.js Server IP]
   cms.smpitmasjidsyuhada.sch.id    A    [WordPress Server IP]
   ```

3. **Configure Redirects**
   - Set up 301 redirect from root to www
   - Test redirect functionality

### Step 2: SSL Certificate Installation
1. **Obtain SSL Certificate**
   - Purchase wildcard certificate
   - Or use Let's Encrypt for free certificates

2. **Install Certificate**
   - Install on web server
   - Configure automatic renewal

3. **Test SSL**
   - Verify certificate installation
   - Test HTTPS functionality

### Step 3: Server Configuration
1. **Web Server Setup**
   - Configure Nginx or Apache
   - Set up virtual hosts

2. **Application Deployment**
   - Deploy Next.js to www subdomain
   - Deploy WordPress to cms subdomain

3. **Testing**
   - Test all domains
   - Verify functionality

## 🔍 Verification Checklist

### DNS Configuration
- [ ] A records configured correctly
- [ ] CNAME records set (if using CDN)
- [ ] Redirects working properly
- [ ] DNS propagation complete

### SSL Certificate
- [ ] Certificate installed correctly
- [ ] HTTPS working on all domains
- [ ] Certificate valid and not expired
- [ ] Automatic renewal configured

### Application Deployment
- [ ] Next.js deployed to www subdomain
- [ ] WordPress deployed to cms subdomain
- [ ] All pages loading correctly
- [ ] Forms working properly

### SEO Configuration
- [ ] Sitemap.xml accessible
- [ ] Robots.txt configured
- [ ] Meta tags present
- [ ] Performance optimized

## 🚨 Troubleshooting

### Common Issues
1. **DNS Not Propagating**
   - Wait for DNS propagation (up to 48 hours)
   - Check DNS settings
   - Use DNS checker tools

2. **SSL Certificate Issues**
   - Verify certificate installation
   - Check certificate validity
   - Ensure proper chain of trust

3. **Redirect Not Working**
   - Check redirect configuration
   - Verify server settings
   - Test redirect functionality

### Debugging Tools
- **DNS Checker**: Verify DNS propagation
- **SSL Labs**: Test SSL configuration
- **GTmetrix**: Performance testing
- **Google PageSpeed**: Performance analysis

## 📞 Support

### Getting Help
- **DNS Issues**: Contact domain registrar
- **SSL Issues**: Contact certificate provider
- **Server Issues**: Contact hosting provider
- **Application Issues**: Check application logs

### Resources
- **DNS Documentation**: Domain registrar docs
- **SSL Documentation**: Certificate provider docs
- **Server Documentation**: Hosting provider docs
- **Application Documentation**: Check docs folder

---

## 📋 Quick Reference

### DNS Records
```bash
# A Records
www.smpitmasjidsyuhada.sch.id    A    [Next.js Server IP]
cms.smpitmasjidsyuhada.sch.id    A    [WordPress Server IP]

# Redirect
smpitmasjidsyuhada.sch.id    →    www.smpitmasjidsyuhada.sch.id
```

### SSL Configuration
```bash
# Wildcard Certificate
*.smpitmasjidsyuhada.sch.id

# TLS Version
TLS 1.2+
```

### Testing URLs
```bash
# Test domains
https://www.smpitmasjidsyuhada.sch.id
https://cms.smpitmasjidsyuhada.sch.id
https://smpitmasjidsyuhada.sch.id (should redirect)
```

---

**Domain setup completed successfully! 🎉**
