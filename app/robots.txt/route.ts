import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/profile',
          '/profile/history',
          '/profile/vision-mission',
          '/academic',
          '/facilities',
          '/staff',
          '/contact',
          '/school',
          '/admissions',
          '/register',
          '/registrar',
        ],
        disallow: [
          '/dashboard/',
          '/admin/',
          '/login',
          '/api/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/profile',
          '/profile/history',
          '/profile/vision-mission',
          '/academic',
          '/facilities',
          '/staff',
          '/contact',
          '/school',
          '/admissions',
          '/register',
          '/registrar',
        ],
        disallow: [
          '/dashboard/',
          '/admin/',
          '/login',
          '/api/',
          '/_next/',
          '/private/',
        ],
      },
    ],
    sitemap: 'https://www.smpitmasjidsyuhada.sch.id/sitemap.xml',
    host: 'https://www.smpitmasjidsyuhada.sch.id',
  }
}
