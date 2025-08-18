# 🎨 Professional Theme System Guide

## 📋 Tổng quan

Hệ thống theme mới được thiết kế để cung cấp một cách tiếp cận chuyên nghiệp, dễ mở rộng và dễ bảo trì cho việc quản lý màu sắc trong ứng dụng.

## 🏗️ Cấu trúc hệ thống

### 1. **Theme Configuration** (`lib/theme-config.ts`)
- Định nghĩa các interface và type cho theme
- Chứa các preset theme (default, ocean, forest, sunset)
- Cung cấp các utility function để áp dụng theme

### 2. **Theme Provider** (`components/theme-provider.tsx`)
- Quản lý state của theme (light/dark/system)
- Quản lý color theme (default, ocean, forest, sunset)
- Áp dụng theme vào CSS custom properties

### 3. **Theme Components**
- `ThemeButton` - Button với các variant khác nhau
- `ThemeCard` - Card với các variant khác nhau
- `ThemeSwitcher` - Dropdown để chuyển đổi theme

## 🎯 Các tính năng chính

### ✅ **Background Colors**
```typescript
background: 'var(--background)'           // Background chính
background-secondary: 'var(--backgroundSecondary)'  // Background phụ
background-tertiary: 'var(--backgroundTertiary)'    // Background bậc 3
background-overlay: 'var(--backgroundOverlay)'      // Background overlay
```

### ✅ **Content Colors**
```typescript
foreground: 'var(--content)'              // Text chính
content-secondary: 'var(--contentSecondary)'  // Text phụ
content-muted: 'var(--contentMuted)'      // Text mờ
```

### ✅ **Button Colors**
```typescript
button-primary: 'var(--button-primary)'   // Button chính
button-secondary: 'var(--button-secondary)'  // Button phụ
button-outline: 'var(--button-outline)'   // Button outline
button-ghost: 'var(--button-ghost)'       // Button ghost
button-destructive: 'var(--button-destructive)'  // Button hủy
```

### ✅ **Border Colors**
```typescript
border: 'var(--border)'                   // Border chính
border-secondary: 'var(--borderSecondary)'  // Border phụ
border-accent: 'var(--borderAccent)'      // Border accent
```

### ✅ **Accent Colors**
```typescript
accent: 'var(--accent)'                   // Accent chính
accent-secondary: 'var(--accentSecondary)'  // Accent phụ
accent-muted: 'var(--accentMuted)'        // Accent mờ
```

### ✅ **Status Colors**
```typescript
success: 'var(--success)'                 // Màu thành công
warning: 'var(--warning)'                 // Màu cảnh báo
error: 'var(--error)'                     // Màu lỗi
info: 'var(--info)'                       // Màu thông tin
```

### ✅ **Glass Effects**
```typescript
glass-bg: 'var(--glass-background)'       // Background glass
glass-border: 'var(--glass-border)'       // Border glass
glass-shadow: 'var(--glass-shadow)'       // Shadow glass
```

## 🚀 Cách sử dụng

### 1. **Sử dụng Theme Provider**
```tsx
import { ThemeProvider } from '@/components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="system" defaultColorTheme="ocean">
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. **Sử dụng Theme Hook**
```tsx
import { useTheme } from '@/components/theme-provider';

function MyComponent() {
  const { theme, setTheme, colorTheme, setColorTheme } = useTheme();
  
  return (
    <div>
      <p>Current mode: {theme}</p>
      <p>Current color theme: {colorTheme}</p>
    </div>
  );
}
```

### 3. **Sử dụng Theme Components**
```tsx
import { ThemeButton } from '@/components/ui/theme-button';
import { ThemeCard } from '@/components/ui/theme-card';

function MyComponent() {
  return (
    <ThemeCard variant="glass">
      <h2>Glass Card</h2>
      <ThemeButton variant="primary">Primary Button</ThemeButton>
      <ThemeButton variant="secondary">Secondary Button</ThemeButton>
    </ThemeCard>
  );
}
```

### 4. **Sử dụng CSS Classes**
```tsx
// Background
<div className="bg-background">Main background</div>
<div className="bg-background-secondary">Secondary background</div>

// Text
<p className="text-foreground">Primary text</p>
<p className="text-content-secondary">Secondary text</p>
<p className="text-content-muted">Muted text</p>

// Buttons
<button className="bg-button-primary text-button-primary-text">
  Primary Button
</button>
```

## 🎨 Thêm theme mới

### 1. **Thêm preset trong `theme-config.ts`**
```typescript
export const themePresets: Record<string, ThemeConfig> = {
  // ... existing themes
  midnight: {
    name: 'midnight',
    displayName: 'Midnight',
    description: 'Deep midnight blue theme',
    colors: {
      background: 'hsl(220 50% 8%)',
      backgroundSecondary: 'hsl(220 50% 12%)',
      // ... define all colors
    },
  },
}
```

### 2. **Thêm dark variant**
```typescript
export const darkThemePresets: Record<string, ThemeConfig> = {
  // ... existing dark themes
  midnight: {
    name: 'midnight-dark',
    displayName: 'Midnight Dark',
    description: 'Deep midnight dark theme',
    colors: {
      background: 'hsl(220 50% 4%)',
      backgroundSecondary: 'hsl(220 50% 8%)',
      // ... define all dark colors
    },
  },
}
```

## 🔧 Tùy chỉnh nâng cao

### 1. **Tạo component mới với theme**
```tsx
import { cn } from '@/lib/utils';

interface CustomComponentProps {
  variant?: 'default' | 'accent';
  className?: string;
}

export function CustomComponent({ variant = 'default', className }: CustomComponentProps) {
  const variantClasses = {
    default: 'bg-background border-border',
    accent: 'bg-accent border-accent',
  };

  return (
    <div className={cn('rounded-lg border p-4', variantClasses[variant], className)}>
      Content
    </div>
  );
}
```

### 2. **Sử dụng CSS custom properties trực tiếp**
```css
.my-custom-component {
  background-color: var(--background);
  color: var(--content);
  border: 1px solid var(--border);
}
```

## 📱 Responsive Design

Hệ thống theme hỗ trợ responsive design thông qua Tailwind CSS:

```tsx
<div className="bg-background md:bg-background-secondary lg:bg-background-tertiary">
  Responsive background
</div>
```

## 🌙 Dark Mode Support

Hệ thống tự động hỗ trợ dark mode:

- **System**: Tự động theo cài đặt hệ thống
- **Light**: Luôn sáng
- **Dark**: Luôn tối

## 🎯 Best Practices

### ✅ **Do's**
- Sử dụng các class có sẵn thay vì hardcode màu
- Tạo component mới với theme support
- Test trên cả light và dark mode
- Sử dụng semantic color names

### ❌ **Don'ts**
- Không hardcode màu sắc
- Không sử dụng inline styles cho màu
- Không tạo quá nhiều variant không cần thiết

## 🔍 Debugging

### 1. **Kiểm tra theme hiện tại**
```tsx
const { theme, colorTheme } = useTheme();
console.log('Current theme:', { theme, colorTheme });
```

### 2. **Kiểm tra CSS variables**
```javascript
// Trong browser console
getComputedStyle(document.documentElement).getPropertyValue('--background');
```

### 3. **Theme Demo**
Truy cập `/theme-demo` để xem demo đầy đủ của hệ thống theme.

## 📚 Ví dụ thực tế

Xem file `components/theme-demo.tsx` để có ví dụ đầy đủ về cách sử dụng hệ thống theme.

---

**🎉 Hệ thống theme này cung cấp một foundation vững chắc cho việc xây dựng UI chuyên nghiệp và dễ bảo trì!**
