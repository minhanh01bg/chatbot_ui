# Hệ thống Login Mới

## Tổng quan

Hệ thống login mới đã được viết lại hoàn toàn với các tính năng bảo mật và UX tối ưu:

### Tính năng chính

1. **Form đơn giản**: Chỉ cần nhập `identifier` (email/username) và `password`
2. **API call**: Gọi `POST /api/auth/login` để lấy thông tin
3. **Memory storage**: Access token được lưu trong React state, không lưu localStorage
4. **HttpOnly cookies**: Refresh token được lưu trong HttpOnly cookie
5. **Context management**: User info và brand logos được lưu trong AuthContext
6. **Auto redirect**: Tự động chuyển hướng sau khi login thành công
7. **Error handling**: Hiển thị toast notifications cho lỗi
8. **Responsive UI**: Giao diện tối ưu, đẹp mắt, responsive

## Cấu trúc file

### 1. AuthContext (`contexts/AuthContext.tsx`)
- Quản lý authentication state
- Cung cấp các methods: `login`, `logout`
- Lưu trữ: `user`, `accessToken`, `role`, `brandLogos`

### 2. Login Page (`app/(auth)/login/page.tsx`)
- Giao diện login tối ưu
- Sử dụng AuthContext để xử lý login
- Responsive design với animations

### 3. API Route (`app/api/auth/login/route.ts`)
- Proxy đến backend API
- Xử lý cookies (HttpOnly cho refresh token)
- Trả về đúng format response

### 4. Dashboard (`app/dashboard/page.tsx`)
- Trang dashboard mẫu
- Hiển thị thông tin user và brand logos
- Protected route (redirect nếu chưa login)

## Cách sử dụng

### 1. Setup AuthProvider
```tsx
// app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Sử dụng trong component
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  const handleLogin = async () => {
    const success = await login('user@example.com', 'password');
    if (success) {
      // Redirect hoặc xử lý logic khác
    }
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### 3. Protected Routes
```tsx
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function ProtectedPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }
  
  return <div>Protected content</div>;
}
```

## API Response Format

Backend API cần trả về format sau:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "user",
  "user": {
    "id": "123",
    "identifier": "user@example.com",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "brand_logos": [
    "https://example.com/logo1.png",
    "https://example.com/logo2.png"
  ]
}
```

## Bảo mật

1. **Access Token**: Chỉ lưu trong memory (React state)
2. **Refresh Token**: Lưu trong HttpOnly cookie
3. **User Info**: Lưu trong context, không persist
4. **Auto Logout**: Khi refresh page, user sẽ cần login lại
5. **Protected Routes**: Tự động redirect nếu chưa authenticated

## Toast Notifications

Hệ thống sử dụng shadcn/ui toast:

```tsx
import { useToast } from '@/components/ui/use-toast';

const { toast } = useToast();

// Success
toast({
  title: "Thành công",
  description: "Đăng nhập thành công!",
});

// Error
toast({
  title: "Lỗi",
  description: "Đăng nhập thất bại",
  variant: "destructive",
});
```

## Styling

Giao diện sử dụng:
- Tailwind CSS
- Framer Motion cho animations
- Glass morphism effects
- Gradient backgrounds
- Responsive design

## Environment Variables

Cần cấu hình:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Troubleshooting

### Lỗi thường gặp:

1. **"Module 'react' has no exported member"**
   - Kiểm tra cấu hình TypeScript
   - Đảm bảo import đúng cách

2. **"Cannot read properties of undefined"**
   - Kiểm tra AuthProvider đã wrap đúng chưa
   - Đảm bảo useAuth được gọi trong AuthProvider

3. **API call failed**
   - Kiểm tra backend server có chạy không
   - Kiểm tra environment variables
   - Kiểm tra network connectivity

### Debug:

```tsx
// Thêm console.log để debug
const { user, accessToken, role } = useAuth();
console.log('Auth state:', { user, accessToken, role });
``` 