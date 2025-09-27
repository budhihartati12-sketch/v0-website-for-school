# Environment Configuration

## Production Environment Variables
```bash
# .env.production
NEXT_PUBLIC_SITE_URL=https://www.smpitmasjidsyuhada.sch.id
NEXT_PUBLIC_CMS_URL=https://cms.smpitmasjidsyuhada.sch.id
NEXT_PUBLIC_SITE_NAME="SMP IT Masjid Syuhada"
NEXT_PUBLIC_SITE_DESCRIPTION="Sekolah Menengah Pertama Islam Terpadu - Mencetak Generasi Qurani"

# API Configuration (if needed)
API_BASE_URL=https://cms.smpitmasjidsyuhada.sch.id/wp-json/wp/v2
```

## Development Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CMS_URL=http://localhost:8080
NEXT_PUBLIC_SITE_NAME="SMP IT Masjid Syuhada (Dev)"
NEXT_PUBLIC_SITE_DESCRIPTION="Development Environment"
```

## Deployment Configuration

### Vercel (Recommended)
```json
{
  "domains": ["www.smpitmasjidsyuhada.sch.id"],
  "redirects": [
    {
      "source": "https://smpitmasjidsyuhada.sch.id",
      "destination": "https://www.smpitmasjidsyuhada.sch.id",
      "permanent": true
    }
  ]
}
```

### Netlify
```toml
# netlify.toml
[build]
  command = "npm run build"
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

### Custom Server (VPS/Dedicated)
```nginx
# nginx.conf
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
}
```
