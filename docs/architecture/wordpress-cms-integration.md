# 🔗 WordPress CMS Integration Guide

## 🎯 Overview

School Website Builder uses a **hybrid architecture** that combines the best of both worlds:
- **Frontend**: Lightning-fast Next.js website for public visitors
- **Backend**: WordPress as dedicated CMS for content management
- **Separation**: Complete separation of concerns for optimal performance

## 🏗️ Architecture Benefits

### 🚀 **Performance Optimization**
- **Public Website**: Next.js delivers optimal performance for visitors
- **CMS Backend**: WordPress handles content management separately
- **Server Load Distribution**: Content management doesn't affect public browsing
- **CDN Ready**: Frontend optimized for global content delivery

### 👥 **Role-Based Workflow**
- **Content Managers**: Use familiar WordPress interface
- **School Administrators**: Focus on school management without technical complexity
- **Media Team**: Efficient content workflow with proven CMS
- **Developers**: Modern frontend development with Next.js

### 🔒 **Security & Reliability**
- **Isolated CMS**: WordPress CMS runs separately from public website
- **Reduced Attack Surface**: Public website has minimal attack vectors
- **Content Security**: CMS access restricted to authorized personnel
- **Regular Updates**: Both systems receive security updates

## 🔧 Implementation Strategy

### Phase 1: Headless WordPress Setup (Q2 2025)

#### WordPress Configuration
```php
// wp-config.php additions
define('WP_HEADLESS', true);
define('WP_API_CORS', true);
define('WP_REST_API_CORS', true);

// Enable CORS for API access
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
});
```

#### Custom Post Types for Schools
```php
// Register custom post types for school content
function register_school_post_types() {
    // School News
    register_post_type('school_news', [
        'public' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
        'labels' => [
            'name' => 'School News',
            'singular_name' => 'News Article'
        ]
    ]);
    
    // Academic Programs
    register_post_type('academic_program', [
        'public' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'thumbnail'],
        'labels' => [
            'name' => 'Academic Programs',
            'singular_name' => 'Program'
        ]
    ]);
    
    // School Events
    register_post_type('school_event', [
        'public' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'thumbnail'],
        'labels' => [
            'name' => 'School Events',
            'singular_name' => 'Event'
        ]
    ]);
}
add_action('init', 'register_school_post_types');
```

### Phase 2: API Integration (Q3 2025)

#### Next.js API Client
```typescript
// lib/wordpress-api.ts
interface WordPressPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  date: string;
  slug: string;
}

interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    sizes: {
      [key: string]: {
        source_url: string;
        width: number;
        height: number;
      };
    };
  };
}

class WordPressAPI {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async getPosts(postType: string = 'posts', params: Record<string, any> = {}) {
    const queryParams = new URLSearchParams({
      per_page: '10',
      ...params
    });
    
    const response = await fetch(
      `${this.baseUrl}/wp-json/wp/v2/${postType}?${queryParams}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${postType}`);
    }
    
    return response.json() as WordPressPost[];
  }
  
  async getMedia(mediaId: number) {
    const response = await fetch(
      `${this.baseUrl}/wp-json/wp/v2/media/${mediaId}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch media ${mediaId}`);
    }
    
    return response.json() as WordPressMedia;
  }
  
  async getSchoolNews(params: Record<string, any> = {}) {
    return this.getPosts('school_news', params);
  }
  
  async getAcademicPrograms(params: Record<string, any> = {}) {
    return this.getPosts('academic_program', params);
  }
  
  async getSchoolEvents(params: Record<string, any> = {}) {
    return this.getPosts('school_event', params);
  }
}

export const wpAPI = new WordPressAPI(process.env.WORDPRESS_API_URL!);
```

#### Next.js Components Integration
```typescript
// components/school-news.tsx
import { wpAPI } from '@/lib/wordpress-api';
import { WordPressPost } from '@/types/wordpress';

interface SchoolNewsProps {
  limit?: number;
}

export async function SchoolNews({ limit = 5 }: SchoolNewsProps) {
  const news = await wpAPI.getSchoolNews({ per_page: limit });
  
  return (
    <div className="school-news">
      <h2>Latest School News</h2>
      <div className="news-grid">
        {news.map((article) => (
          <article key={article.id} className="news-item">
            <h3>{article.title.rendered}</h3>
            <div 
              dangerouslySetInnerHTML={{ 
                __html: article.excerpt.rendered 
              }} 
            />
            <time>{new Date(article.date).toLocaleDateString()}</time>
          </article>
        ))}
      </div>
    </div>
  );
}
```

### Phase 3: Real-time Content Sync (Q4 2025)

#### Webhook Integration
```php
// WordPress webhook for content updates
function notify_frontend_of_content_update($post_id) {
    $post = get_post($post_id);
    
    if (!$post || $post->post_status !== 'publish') {
        return;
    }
    
    $webhook_url = get_option('frontend_webhook_url');
    if (!$webhook_url) {
        return;
    }
    
    $payload = [
        'action' => 'content_updated',
        'post_id' => $post_id,
        'post_type' => $post->post_type,
        'post_title' => $post->post_title,
        'post_slug' => $post->post_name,
        'timestamp' => current_time('timestamp')
    ];
    
    wp_remote_post($webhook_url, [
        'body' => json_encode($payload),
        'headers' => [
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . get_option('frontend_api_token')
        ]
    ]);
}

add_action('save_post', 'notify_frontend_of_content_update');
add_action('publish_post', 'notify_frontend_of_content_update');
```

#### Next.js Webhook Handler
```typescript
// app/api/webhook/wordpress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Verify webhook signature
    const signature = request.headers.get('authorization');
    if (!verifyWebhookSignature(signature, payload)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Handle different content types
    switch (payload.post_type) {
      case 'school_news':
        revalidatePath('/news');
        revalidatePath('/');
        break;
      case 'academic_program':
        revalidatePath('/academic');
        break;
      case 'school_event':
        revalidatePath('/events');
        break;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function verifyWebhookSignature(signature: string | null, payload: any): boolean {
  // Implement webhook signature verification
  const expectedSignature = process.env.WORDPRESS_WEBHOOK_SECRET;
  return signature === `Bearer ${expectedSignature}`;
}
```

## 🎨 Content Management Workflow

### 👥 **Content Manager Role**
- **WordPress Dashboard**: Familiar interface for content creation
- **Media Library**: Easy image and file management
- **User Roles**: Proper permission management
- **Content Scheduling**: Schedule posts for future publication
- **Draft System**: Save drafts and preview before publishing

### 🏫 **School Administrator Role**
- **School Settings**: Manage school information and settings
- **User Management**: Add/remove content managers and contributors
- **Content Approval**: Review and approve content before publication
- **Analytics**: View content performance and engagement
- **Backup Management**: Regular content backups

### 📱 **Media Team Role**
- **Content Creation**: Create news articles, events, and announcements
- **Image Management**: Upload and manage school photos
- **Social Media**: Integrate with social media platforms
- **Content Templates**: Use pre-built templates for consistency
- **Mobile Editing**: Edit content on mobile devices

## 🔧 Development Workflow

### 🎨 **Designer Workflow**
1. **Design Components**: Create UI components in Next.js
2. **WordPress Integration**: Design WordPress admin interface
3. **Content Templates**: Create content templates for consistency
4. **Responsive Design**: Ensure mobile-first design
5. **Brand Consistency**: Maintain school branding across platforms

### 👨‍💻 **Developer Workflow**
1. **API Development**: Build WordPress REST API endpoints
2. **Frontend Integration**: Connect Next.js with WordPress API
3. **Performance Optimization**: Optimize API calls and caching
4. **Testing**: Test both WordPress and Next.js components
5. **Deployment**: Deploy both systems independently

### 🔄 **Content Workflow**
1. **Content Creation**: Create content in WordPress CMS
2. **Review Process**: School administrator reviews content
3. **Publication**: Content published to WordPress
4. **API Sync**: WordPress API updates Next.js frontend
5. **Cache Invalidation**: Frontend cache updated automatically

## 📊 Performance Optimization

### 🚀 **Frontend Optimization**
- **Static Generation**: Pre-generate pages with WordPress content
- **API Caching**: Cache WordPress API responses
- **Image Optimization**: Optimize images from WordPress media library
- **CDN Integration**: Use CDN for static assets
- **Code Splitting**: Load only necessary JavaScript

### 🔧 **WordPress Optimization**
- **Database Optimization**: Optimize WordPress database
- **Plugin Management**: Use only necessary plugins
- **Caching**: Implement WordPress caching
- **Security**: Regular security updates and monitoring
- **Backup**: Automated backups and recovery

## 🌟 Future Enhancements

### 🤖 **AI Integration**
- **Content Suggestions**: AI-powered content recommendations
- **SEO Optimization**: Automatic SEO improvements
- **Image Generation**: AI-generated school images
- **Content Translation**: Multi-language support
- **Accessibility**: Automatic accessibility improvements

### 📱 **Mobile Optimization**
- **Mobile CMS**: Mobile-optimized WordPress admin
- **Progressive Web App**: PWA features for mobile users
- **Offline Support**: Offline content reading
- **Push Notifications**: Real-time content notifications
- **Mobile Analytics**: Mobile-specific analytics

### 🔗 **Advanced Integration**
- **Multi-Site Support**: Multiple school management
- **API Versioning**: Versioned API for compatibility
- **Webhook System**: Real-time content synchronization
- **Third-Party Integration**: Connect with school management systems
- **Analytics Integration**: Advanced analytics and reporting

## 📚 Resources

### 📖 **Documentation**
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Headless WordPress](https://headlesswp.org/)
- [WordPress Webhooks](https://developer.wordpress.org/rest-api/extending-the-rest-api/)

### 🛠️ **Tools**
- [WordPress CLI](https://wp-cli.org/)
- [GraphQL for WordPress](https://www.wpgraphql.com/)
- [WordPress Headless](https://wordpress.org/plugins/headless/)
- [Next.js WordPress Starter](https://github.com/colbyfayock/next-wordpress-starter)

---

**This hybrid approach provides the best of both worlds: modern performance with familiar content management! 🚀**
