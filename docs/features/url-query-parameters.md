# 🔗 URL Query Parameters

## Overview

URL query parameters telah diimplementasikan di seluruh halaman yang menggunakan tab navigation untuk memberikan pengalaman navigasi yang lebih baik, URL yang dapat di-bookmark, dan SEO yang lebih optimal.

## Implementasi

### Pages dengan URL Query Parameters

#### 1. Public Pages

##### `/admissions` - Halaman SPMB Public
```
Base URL: http://localhost:3000/admissions

Available Tabs:
- ?tab=gelombang    - Gelombang Pendaftaran
- ?tab=jalur        - Jalur Pendaftaran (Reguler & Prestasi)
- ?tab=biaya        - Rincian Biaya
- ?tab=syarat       - Syarat Pendaftaran & Wawancara
- ?tab=faq          - Frequently Asked Questions
```

**Use Cases:**
- Marketing: Share direct link ke gelombang pendaftaran
- Customer Service: Direct link ke FAQ
- Social Media: Specific tab untuk promosi

---

#### 2. Dashboard Pages

##### `/dashboard/school` - Manajemen Informasi Sekolah
```
Base URL: http://localhost:3000/dashboard/school

Available Tabs:
- ?tab=profil       - Profil Sekolah
- ?tab=tentang      - Tentang Sekolah
- ?tab=struktur     - Struktur Organisasi
- ?tab=fasilitas    - Fasilitas Sekolah
```

##### `/dashboard/contact` - Manajemen Kontak
```
Base URL: http://localhost:3000/dashboard/contact

Available Tabs:
- ?tab=contact      - Informasi Kontak
- ?tab=hours        - Jam Operasional
```

##### `/dashboard/admissions` - Manajemen SPMB
```
Base URL: http://localhost:3000/dashboard/admissions

Available Tabs:
- ?tab=forms        - Formulir Pendaftaran
- ?tab=applicants   - Data Pendaftar
- ?tab=settings     - Pengaturan SPMB
- ?tab=reports      - Laporan SPMB
```

##### `/dashboard/messages` - Manajemen Pesan
```
Base URL: http://localhost:3000/dashboard/messages

Available Tabs:
- ?tab=inbox        - Kotak Masuk
- ?tab=sent         - Pesan Terkirim
- ?tab=drafts       - Draf Pesan
- ... (dan lainnya)
```

---

## Technical Implementation

### Custom Hook: `useTabParam`

Setiap halaman menggunakan custom hook yang konsisten:

```tsx
function useTabParam() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams?.get("tab") || "default"

  const setTab = React.useCallback((tab: string) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set("tab", tab)
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  return { current, setTab }
}
```

### Key Features

1. **Next.js Built-in Hooks**
   - `useSearchParams`: Read URL query parameters
   - `useRouter`: Navigate without page reload

2. **Performance Optimization**
   - `useCallback`: Memoize setTab function
   - `scroll: false`: Prevent page jump on tab change
   - No unnecessary re-renders

3. **User Experience**
   - Shareable URLs for specific tabs
   - Browser back/forward button support
   - Bookmarkable specific sections
   - Smooth transitions

---

## Benefits

### 1. User Experience
- ✅ **Bookmarkable**: User dapat bookmark tab tertentu
- ✅ **Shareable**: URL dapat di-share dengan tab spesifik
- ✅ **Browser Navigation**: Back/forward button bekerja sempurna
- ✅ **No Page Jump**: Smooth transition tanpa scroll jump

### 2. SEO Benefits
- ✅ **Indexable**: Search engine dapat index setiap tab
- ✅ **Descriptive URLs**: URL yang readable dan meaningful
- ✅ **Better Analytics**: Track setiap tab secara terpisah
- ✅ **Social Media**: Better preview untuk shared links

### 3. Developer Experience
- ✅ **Consistent Pattern**: Same implementation across all pages
- ✅ **Type Safe**: TypeScript support
- ✅ **Easy to Maintain**: Centralized logic in custom hook
- ✅ **Testable**: Easy to test tab navigation

### 4. Marketing Benefits
- ✅ **Direct Links**: Share specific information sections
- ✅ **Campaign Tracking**: Track which tabs are most visited
- ✅ **Better Conversion**: Reduce friction in user journey
- ✅ **Professional**: Modern web application standard

---

## Migration from Old Implementation

### Before (Old Approach)
```tsx
// ❌ Using useState and useEffect - Less optimal
function useTabParam() {
  const [searchParams, setSearchParams] = React.useState<URLSearchParams>()
  const [current, setCurrent] = React.useState("default")

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSearchParams(params)
    const tab = params.get("tab") || "default"
    setCurrent(tab)
  }, [])

  const setTab = React.useCallback((tab: string) => {
    setCurrent(tab)
    if (searchParams) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set("tab", tab)
      window.history.replaceState({}, "", `?${newParams.toString()}`)
    }
  }, [searchParams])

  return { current, setTab }
}
```

### After (New Approach)
```tsx
// ✅ Using Next.js built-in hooks - More optimal
function useTabParam() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams?.get("tab") || "default"

  const setTab = React.useCallback((tab: string) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set("tab", tab)
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  return { current, setTab }
}
```

### Improvements
1. ✅ Eliminates `useState` - Less state to manage
2. ✅ Removes `useEffect` - No side effects needed
3. ✅ Uses Next.js router - Better integration
4. ✅ Adds `scroll: false` - Better UX
5. ✅ Simpler code - Easier to understand

---

## Usage Examples

### Basic Usage
```tsx
export default function MyPage() {
  const { current, setTab } = useTabParam()

  return (
    <Tabs value={current} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
    </Tabs>
  )
}
```

### With Custom Navigation
```tsx
export default function MyPage() {
  const { current, setTab } = useTabParam()

  return (
    <>
      <nav>
        <button onClick={() => setTab("tab1")}>Tab 1</button>
        <button onClick={() => setTab("tab2")}>Tab 2</button>
      </nav>
      <Tabs value={current} onValueChange={setTab}>
        {/* ... */}
      </Tabs>
    </>
  )
}
```

---

## Best Practices

### 1. Default Tab Value
Always provide a sensible default:
```tsx
const current = searchParams?.get("tab") || "most-important-tab"
```

### 2. Scroll Behavior
Use `scroll: false` to prevent page jump:
```tsx
router.replace(`?${params.toString()}`, { scroll: false })
```

### 3. Type Safety
Define tab types for better TypeScript support:
```tsx
type TabValue = "tab1" | "tab2" | "tab3"
const current = (searchParams?.get("tab") as TabValue) || "tab1"
```

### 4. Analytics Tracking
Track tab changes for analytics:
```tsx
const setTab = React.useCallback((tab: string) => {
  // Track analytics
  analytics.track("Tab Changed", { tab })
  
  // Update URL
  const params = new URLSearchParams(searchParams?.toString())
  params.set("tab", tab)
  router.replace(`?${params.toString()}`, { scroll: false })
}, [router, searchParams])
```

---

## Testing

### Manual Testing Checklist
- [ ] URL updates when tab changes
- [ ] Tab persists on page reload
- [ ] Browser back/forward works correctly
- [ ] No page scroll on tab change
- [ ] Shared URLs open correct tab
- [ ] Default tab shows when no param
- [ ] Mobile navigation works

### Automated Testing
```tsx
import { render, screen } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'

jest.mock('next/navigation')

test('changes tab and updates URL', () => {
  const mockReplace = jest.fn()
  (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace })
  (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())

  const { getByText } = render(<MyPage />)
  
  fireEvent.click(getByText('Tab 2'))
  
  expect(mockReplace).toHaveBeenCalledWith(
    '?tab=tab2',
    { scroll: false }
  )
})
```

---

## Troubleshooting

### Issue: Tab doesn't persist on reload
**Solution**: Check if `searchParams?.get("tab")` is properly reading the URL

### Issue: Page scrolls on tab change
**Solution**: Ensure `{ scroll: false }` is passed to `router.replace()`

### Issue: Browser back doesn't work
**Solution**: Use `router.replace()` instead of `window.history.replaceState()`

### Issue: Multiple query parameters conflict
**Solution**: Preserve existing params when updating:
```tsx
const params = new URLSearchParams(searchParams?.toString())
params.set("tab", tab) // Only update tab param
router.replace(`?${params.toString()}`, { scroll: false })
```

---

## Future Enhancements

### Planned Improvements
1. **Multiple Query Params**: Support for nested tabs
2. **Query Param Validation**: Validate tab values
3. **Deep Linking**: Support for complex navigation states
4. **History Management**: Advanced browser history control
5. **Analytics Integration**: Built-in analytics tracking

### Example: Nested Tabs
```tsx
// Future implementation
const current = searchParams?.get("tab") || "main"
const subTab = searchParams?.get("subtab") || "default"

// URL: /page?tab=main&subtab=settings
```

---

## References

- [Next.js useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
- [Next.js useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router)
- [Web.dev: URL Parameters](https://web.dev/url-parameters/)
- [MDN: URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

---

## Contributing

Saat menambahkan halaman baru dengan tabs:

1. Import required hooks:
```tsx
import { useSearchParams, useRouter } from "next/navigation"
```

2. Add custom hook:
```tsx
function useTabParam() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams?.get("tab") || "default"

  const setTab = React.useCallback((tab: string) => {
    const params = new URLSearchParams(searchParams?.toString())
    params.set("tab", tab)
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  return { current, setTab }
}
```

3. Use in component:
```tsx
const { current, setTab } = useTabParam()
```

4. Update this documentation!

---

**Last Updated**: 2025-01-27
**Author**: sandikodev
**Status**: ✅ Production Ready

