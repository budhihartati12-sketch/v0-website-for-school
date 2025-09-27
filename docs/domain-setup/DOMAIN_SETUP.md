# Domain Configuration for SMP IT Masjid Syuhada

## Domain Structure
- **Main Website (Next.js Frontend)**: `www.smpitmasjidsyuhada.sch.id`
- **CMS Admin (WordPress)**: `cms.smpitmasjidsyuhada.sch.id`
- **Root Domain**: `smpitmasjidsyuhada.sch.id` (redirects to www)

## DNS Configuration Required

### A Records
```
www.smpitmasjidsyuhada.sch.id    A    [Your Next.js Server IP]
cms.smpitmasjidsyuhada.sch.id    A    [Your WordPress Server IP]
```

### CNAME Records (if using CDN)
```
www.smpitmasjidsyuhada.sch.id    CNAME    [CDN Domain]
cms.smpitmasjidsyuhada.sch.id    CNAME    [CDN Domain]
```

### Redirect Configuration
```
smpitmasjidsyuhada.sch.id    →    www.smpitmasjidsyuhada.sch.id (301 redirect)
```

## Deployment Strategy

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

## Benefits of This Structure

### SEO & Performance
- Clean separation of public and admin content
- Better SEO for public pages
- Faster loading for public website
- No admin bloat affecting public site

### Security
- Admin panel isolated from public site
- Reduced attack surface
- Better access control
- Separate security configurations

### Maintenance
- Independent updates for frontend and CMS
- Easier backup strategies
- Better scalability
- Clear separation of concerns

## Next Steps
1. Configure DNS records
2. Set up SSL certificates for both subdomains
3. Deploy Next.js to www subdomain
4. Migrate WordPress to cms subdomain
5. Set up redirects from root domain
6. Update all internal links and references
