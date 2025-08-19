# Admin Theme System

Hệ thống theme admin đã được nâng cấp với các theme mới và tính năng nâng cao.

## Các Theme Admin Mới

### 1. Admin Pro (admin)
- **Mô tả**: Theme admin chuyên nghiệp với gradient tím
- **Đặc điểm**: 
  - Giao diện tối với gradient tím
  - Hiệu ứng glass morphism
  - Text colors được tối ưu cho khả năng đọc
  - Phù hợp cho admin panel chuyên nghiệp

### 2. Admin Light (adminLight)
- **Mô tả**: Theme admin sáng với accent tím
- **Đặc điểm**:
  - Giao diện sáng với accent tím
  - Phù hợp cho môi trường làm việc sáng
  - Text colors tối ưu cho khả năng đọc
  - Thiết kế clean và modern

### 3. Admin Gradient (adminGradient)
- **Mô tả**: Theme admin premium với gradient đẹp
- **Đặc điểm**:
  - Gradient backgrounds phức tạp
  - Hiệu ứng glass morphism nâng cao
  - Animations mượt mà
  - Phù hợp cho các ứng dụng premium

## Cách Sử Dụng

### 1. Sử dụng ThemeSelector Component

```tsx
import { ThemeSelector } from '@/components/admin/ThemeSelector';

export function AdminHeader() {
  return (
    <div className="flex items-center justify-between p-4">
      <h1>Admin Panel</h1>
      <ThemeSelector />
    </div>
  );
}
```

### 2. Sử dụng useAdminTheme Hook

```tsx
import { useAdminTheme } from '@/hooks/use-admin-theme';

export function ThemeSwitcher() {
  const { currentTheme, setTheme, isDark, toggleDarkMode } = useAdminTheme();

  return (
    <div>
      <button onClick={() => setTheme('adminGradient')}>
        Switch to Admin Gradient
      </button>
      <button onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
    </div>
  );
}
```

### 3. Sử dụng AdminThemeProvider

```tsx
import { AdminThemeProvider } from '@/components/providers/AdminThemeProvider';

export default function AdminLayout({ children }) {
  return (
    <AdminThemeProvider defaultTheme="adminGradient">
      {children}
    </AdminThemeProvider>
  );
}
```

## CSS Classes và Utilities

### Admin Text Classes
```css
.admin-text-primary    /* Text chính */
.admin-text-secondary  /* Text phụ */
.admin-text-muted      /* Text mờ */
.admin-text-subtle     /* Text tinh tế */
```

### Admin Component Classes
```css
.admin-card            /* Card với hiệu ứng glass */
.admin-button          /* Button với gradient */
.admin-sidebar         /* Sidebar với styling */
```

### Animation Classes
```css
.admin-fade-in         /* Fade in animation */
.admin-slide-up        /* Slide up animation */
.admin-scale-in        /* Scale in animation */
```

## Cấu Trúc Theme

### ThemeConfig Interface
```typescript
interface ThemeConfig {
  name: string;
  displayName: string;
  description: string;
  colors: ThemeColors;
}

interface ThemeColors {
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Text colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    subtle: string;
    inverse: string;
  };
  
  // Button colors
  button: {
    primary: string;
    primaryHover: string;
    primaryText: string;
    // ... other button variants
  };
  
  // Admin-specific colors
  admin?: {
    gradient: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    card: {
      background: string;
      border: string;
      shadow: string;
    };
    sidebar: {
      background: string;
      border: string;
      text: string;
    };
  };
}
```

## Tùy Chỉnh Theme

### 1. Thêm Theme Mới

```typescript
// lib/theme-config.ts
export const themePresets: Record<string, ThemeConfig> = {
  myCustomTheme: {
    name: 'myCustomTheme',
    displayName: 'My Custom Theme',
    description: 'A custom admin theme',
    colors: {
      // Define your colors here
      background: 'hsl(240 10% 3.9%)',
      // ... other color definitions
    },
  },
};
```

### 2. Tùy Chỉnh CSS Variables

```css
/* app/globals.css */
.admin-theme[data-theme="myCustomTheme"] {
  --admin-gradient-primary: linear-gradient(135deg, #your-colors);
  --admin-card-background: your-card-bg;
  --admin-text-primary: your-text-color;
}
```

## Responsive Design

Tất cả các theme admin đều hỗ trợ responsive design:

```css
@media (max-width: 768px) {
  .admin-theme .admin-card {
    margin: 8px;
    border-radius: 8px;
  }
  
  .admin-theme .admin-button {
    padding: 10px 20px;
    font-size: 14px;
  }
}
```

## Performance Optimization

- Sử dụng CSS custom properties để thay đổi theme nhanh chóng
- Lazy loading cho các theme không sử dụng
- Optimized animations với CSS transforms
- Minimal re-renders với React hooks

## Browser Support

- Chrome 88+
- Firefox 87+
- Safari 14+
- Edge 88+

## Troubleshooting

### Theme không áp dụng
1. Kiểm tra xem AdminThemeProvider đã được wrap đúng chưa
2. Kiểm tra console để xem có lỗi JavaScript không
3. Đảm bảo CSS đã được load đúng

### Text không đọc được
1. Kiểm tra CSS variables cho text colors
2. Đảm bảo contrast ratio đủ cao
3. Sử dụng admin-text classes thay vì Tailwind classes

### Animations không mượt
1. Kiểm tra hardware acceleration
2. Đảm bảo không có conflicting CSS
3. Sử dụng transform thay vì position properties

## Migration Guide

### Từ Theme Cũ
1. Thay thế `useTheme` bằng `useAdminTheme`
2. Cập nhật CSS classes từ `admin-*` cũ sang classes mới
3. Sử dụng AdminThemeProvider thay vì ThemeProvider cũ

### Breaking Changes
- `admin-bg-*` classes đã được thay thế bằng CSS variables
- `admin-text-*` classes vẫn giữ nguyên
- Theme switching logic đã được cải thiện

## Examples

Xem file `components/admin/AdminThemeDemo.tsx` để có ví dụ đầy đủ về cách sử dụng các theme admin mới. 