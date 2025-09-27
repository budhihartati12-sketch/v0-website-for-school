# 🛠️ Development Guide

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18.0 or higher
- **pnpm**: Package manager (recommended)
- **Git**: Version control
- **VS Code**: Code editor (recommended)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-repo/v0-website-for-school.git
cd v0-website-for-school

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Development Server
- **URL**: http://localhost:3000
- **Hot Reload**: Automatic reload on file changes
- **TypeScript**: Real-time type checking
- **ESLint**: Code linting

## 📁 Project Structure

### App Directory (Next.js App Router)
```
app/
├── (auth)/                   # Authentication pages
├── dashboard/                # Admin dashboard
│   ├── overview/            # Dashboard overview
│   ├── school/              # School management
│   ├── contact/             # Contact management
│   ├── admissions/          # Admissions management
│   ├── messages/            # Messages management
│   └── layout.tsx           # Dashboard layout
├── profile/                 # School profile pages
├── academic/                # Academic programs
├── facilities/              # School facilities
├── staff/                   # Staff & teachers
├── contact/                 # Contact information
├── admissions/              # Student admissions
├── school/                  # School hub
├── registrar/               # Registrar
├── login/                   # Login page
├── register/                # Registration form
├── sitemap.xml/             # SEO sitemap
├── robots.txt/              # Search engine rules
└── layout.tsx               # Root layout
```

### Components Directory
```
components/
├── ui/                      # UI components (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── site/                    # Site-specific components
│   ├── navigation.tsx
│   ├── footer.tsx
│   └── hero-section.tsx
├── admin/                   # Admin-specific components
│   └── messages-panel.tsx
└── navigation.tsx           # Main navigation
```

### Lib Directory
```
lib/
├── auth.ts                  # Authentication utilities
├── form-schema.ts           # Form validation schemas
└── utils.ts                 # General utilities
```

## 🎨 Code Style Guide

### TypeScript Standards
```typescript
// Use explicit types
interface User {
  id: string
  name: string
  email: string
}

// Use type assertions carefully
const user = data as User

// Prefer interfaces over types for objects
interface ApiResponse {
  data: User[]
  status: 'success' | 'error'
}

// Use enums for constants
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}
```

### React Component Standards
```typescript
// Use functional components with TypeScript
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false 
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  )
}
```

### CSS/Tailwind Standards
```typescript
// Use Tailwind classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// Use CSS variables for custom values
<div className="w-[var(--sidebar-width)]">

// Use responsive classes
<div className="w-full md:w-1/2 lg:w-1/3">

// Use semantic class names
<div className="hero-section">
  <div className="hero-content">
    <h1 className="hero-title">Title</h1>
  </div>
</div>
```

## 🔧 Development Tools

### Package Manager
```bash
# Use pnpm for better performance
pnpm install          # Install dependencies
pnpm dev             # Start development server
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Run ESLint
pnpm type-check      # Run TypeScript check
pnpm format          # Format code with Prettier
```

### Code Quality Tools
```bash
# ESLint configuration
pnpm lint

# TypeScript checking
pnpm type-check

# Code formatting
pnpm format

# Pre-commit hooks
pnpm prepare
```

### VS Code Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 🧪 Testing Strategy

### Testing Setup
```bash
# Install testing dependencies
pnpm add -D jest @testing-library/react @testing-library/jest-dom

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Component Testing
```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Page Testing
```typescript
// page.test.tsx
import { render, screen } from '@testing-library/react'
import HomePage from './page'

describe('HomePage', () => {
  it('renders homepage content', () => {
    render(<HomePage />)
    
    expect(screen.getByText('SMP IT Masjid Syuhada')).toBeInTheDocument()
    expect(screen.getByText('Mencetak Generasi Qurani')).toBeInTheDocument()
  })
})
```

## 🔄 Git Workflow

### Branch Strategy
```bash
# Main branches
main                    # Production branch
develop                 # Development branch

# Feature branches
feature/user-auth       # New features
feature/seo-optimization
feature/mobile-responsive

# Bug fix branches
bugfix/navigation-issue
bugfix/form-validation

# Hotfix branches
hotfix/security-patch
hotfix/critical-bug
```

### Commit Message Format
```bash
# Format: type(scope): description
feat(auth): add user authentication system
fix(navigation): resolve mobile navigation issue
docs(readme): update installation instructions
style(components): improve button styling
refactor(utils): optimize utility functions
test(auth): add authentication tests
chore(deps): update dependencies
```

### Pull Request Process
1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push Branch**
   ```bash
   git push origin feature/new-feature
   ```

4. **Create Pull Request**
   - Fill out PR template
   - Add reviewers
   - Link related issues

5. **Code Review**
   - Address feedback
   - Make necessary changes
   - Ensure tests pass

6. **Merge**
   - Squash and merge
   - Delete feature branch
   - Update changelog

## 🚀 Deployment Process

### Development Deployment
```bash
# Build for development
pnpm build

# Start development server
pnpm start
```

### Production Deployment
```bash
# Build for production
pnpm build

# Deploy to Vercel
vercel --prod

# Or deploy to custom server
pnpm start
```

### Environment Variables
```bash
# Development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CMS_URL=http://localhost:8080

# Production
NEXT_PUBLIC_SITE_URL=https://www.smpitmasjidsyuhada.sch.id
NEXT_PUBLIC_CMS_URL=https://cms.smpitmasjidsyuhada.sch.id
```

## 🐛 Debugging Guide

### Common Issues
1. **Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   pnpm build
   ```

2. **TypeScript Errors**
   ```bash
   # Check TypeScript configuration
   pnpm type-check
   ```

3. **Dependency Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules
   pnpm install
   ```

### Debugging Tools
- **VS Code Debugger**: Built-in debugging
- **React DevTools**: Component inspection
- **Next.js DevTools**: Performance analysis
- **Browser DevTools**: Network and performance

### Performance Debugging
```bash
# Analyze bundle size
pnpm analyze

# Check for unused dependencies
pnpm audit

# Monitor performance
pnpm dev --turbo
```

## 📚 Learning Resources

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)

### React Resources
- [React Documentation](https://react.dev)
- [React Patterns](https://reactpatterns.com)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)

### TypeScript Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [TypeScript React](https://react-typescript-cheatsheet.netlify.app)

### Tailwind CSS Resources
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com)
- [Tailwind Play](https://play.tailwindcss.com)

## 🤝 Contributing

### How to Contribute
1. **Fork the Repository**
2. **Create Feature Branch**
3. **Make Changes**
4. **Add Tests**
5. **Submit Pull Request**

### Code Review Process
1. **Automated Checks**
   - ESLint passes
   - TypeScript compiles
   - Tests pass
   - Build succeeds

2. **Manual Review**
   - Code quality
   - Performance impact
   - Security considerations
   - Documentation updates

3. **Approval**
   - At least one approval required
   - All checks must pass
   - Documentation updated

### Issue Reporting
- **Bug Reports**: Use bug report template
- **Feature Requests**: Use feature request template
- **Questions**: Use discussion forum

## 📞 Support

### Getting Help
- **Documentation**: Check relevant docs
- **Issues**: Search existing issues
- **Discussions**: Use GitHub discussions
- **Community**: Join community forums

### Contact Information
- **Email**: support@smpitmasjidsyuhada.sch.id
- **GitHub**: Create issue or discussion
- **Documentation**: Check docs folder
