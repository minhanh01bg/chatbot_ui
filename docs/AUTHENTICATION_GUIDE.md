# Authentication Guide

Hướng dẫn sử dụng các component authentication và authorization trong ứng dụng.

## Components

### 1. AuthGuard

Component để kiểm tra trạng thái đăng nhập và redirect user một cách hợp lý.

```tsx
import { AuthGuard } from '@/components/auth-guard';

// Redirect user đã đăng nhập từ landing page
<AuthGuard redirectTo="/admin" redirectIfAuthenticated={true}>
  <LandingPage />
</AuthGuard>

// Yêu cầu đăng nhập để truy cập
<AuthGuard requireAuth={true}>
  <ProtectedPage />
</AuthGuard>
```

**Props:**
- `redirectTo`: URL để redirect khi user đã đăng nhập
- `redirectIfAuthenticated`: Có redirect user đã đăng nhập không
- `requireAuth`: Yêu cầu đăng nhập để truy cập
- `loadingComponent`: Component loading tùy chỉnh
- `authRequiredMessage`: Thông báo khi cần đăng nhập

### 2. PermissionGuard

Component để kiểm tra quyền truy cập dựa trên role.

```tsx
import { PermissionGuard } from '@/components/permission-guard';

// Yêu cầu role cụ thể
<PermissionGuard requiredRole="admin">
  <AdminPage />
</PermissionGuard>

// Yêu cầu một trong các role
<PermissionGuard requiredRoles={["admin", "moderator"]}>
  <ModeratorPage />
</PermissionGuard>
```

**Props:**
- `requiredRole`: Role cụ thể cần thiết
- `requiredRoles`: Mảng các role được phép
- `allowSuperAdmin`: Superadmin có quyền truy cập tất cả không
- `accessDeniedMessage`: Thông báo khi không có quyền
- `authRequiredMessage`: Thông báo khi cần đăng nhập

### 3. LoadingSpinner

Component loading đẹp với animation.

```tsx
import { LoadingSpinner } from '@/components/loading-spinner';

<LoadingSpinner size="lg" text="Loading..." />
```

### 4. RedirectNotice

Component hiển thị thông báo khi user đã đăng nhập và sẽ được redirect.

```tsx
import { RedirectNotice } from '@/components/redirect-notice';

<RedirectNotice redirectTo="/admin" delay={3000} />
```

### 5. WelcomeBanner

Component hiển thị thông báo chào mừng khi user đã đăng nhập.

```tsx
import { WelcomeBanner } from '@/components/welcome-banner';

<WelcomeBanner userName="John Doe" userEmail="john@example.com" />
```

### 6. AuthRequiredNotice

Component hiển thị thông báo khi user chưa đăng nhập.

```tsx
import { AuthRequiredNotice } from '@/components/auth-required-notice';

<AuthRequiredNotice 
  title="Login Required"
  message="Please log in to access this feature."
  showRegister={true}
/>
```

### 7. AccessDenied

Component hiển thị thông báo khi user không có quyền truy cập.

```tsx
import { AccessDenied } from '@/components/access-denied';

<AccessDenied 
  title="Access Denied"
  message="You don't have permission to access this page."
  requiredRole="admin"
  userRole="user"
/>
```

## Hooks

### 1. useCurrentUser

Hook để lấy thông tin user hiện tại.

```tsx
import { useCurrentUser } from '@/hooks/use-current-user';

const { user, isLoading, isAuthenticated, isSuperAdmin } = useCurrentUser();
```

### 2. useAuthRedirect

Hook để xử lý redirect khi user đã đăng nhập.

```tsx
import { useAuthRedirect } from '@/hooks/use-auth-redirect';

const { user, isLoading, showRedirectNotice } = useAuthRedirect({
  redirectTo: '/admin',
  redirectIfAuthenticated: true
});
```

### 3. useAuthPermission

Hook để kiểm tra quyền truy cập.

```tsx
import { useAuthPermission } from '@/hooks/use-auth-permission';

const { hasPermission, userRole, missingPermission } = useAuthPermission({
  requiredRole: 'admin',
  allowSuperAdmin: true
});
```

## Cách sử dụng

### 1. Landing Page (Đã đăng nhập → Redirect)

```tsx
// app/page.tsx
export default function Home() {
  return (
    <AuthGuard redirectTo="/admin" redirectIfAuthenticated={true}>
      <LandingPageContent />
    </AuthGuard>
  );
}
```

### 2. Login/Register Page (Đã đăng nhập → Redirect)

```tsx
// app/(auth)/login/page.tsx
export default function LoginPage() {
  return (
    <AuthGuard redirectTo="/admin" redirectIfAuthenticated={true}>
      <LoginForm />
    </AuthGuard>
  );
}
```

### 3. Protected Page (Chưa đăng nhập → Login)

```tsx
// app/admin/page.tsx
export default function AdminPage() {
  return (
    <PermissionGuard requiredRole="admin">
      <AdminDashboard />
    </PermissionGuard>
  );
}
```

### 4. Welcome Banner

```tsx
// Trong component đã được bảo vệ
export default function Dashboard() {
  const { user } = useCurrentUser();
  
  return (
    <>
      {user && (
        <WelcomeBanner 
          userName={user.name} 
          userEmail={user.email} 
        />
      )}
      <DashboardContent />
    </>
  );
}
```

## Flow hoạt động

1. **User chưa đăng nhập** → Hiển thị AuthRequiredNotice
2. **User đã đăng nhập nhưng không có quyền** → Hiển thị AccessDenied
3. **User đã đăng nhập và có quyền** → Hiển thị WelcomeBanner + Content
4. **User đã đăng nhập ở trang public** → Hiển thị RedirectNotice → Redirect

## Customization

Bạn có thể tùy chỉnh các component bằng cách:

1. Thay đổi styling trong các component
2. Tạo loading component tùy chỉnh
3. Thay đổi thông báo và text
4. Thêm animation và transition

## Best Practices

1. Luôn sử dụng AuthGuard cho các trang public
2. Sử dụng PermissionGuard cho các trang cần quyền
3. Hiển thị WelcomeBanner cho user experience tốt hơn
4. Sử dụng LoadingSpinner để tránh flash content
5. Test các trường hợp authentication khác nhau 