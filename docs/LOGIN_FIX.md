# Login System Fix Documentation

## Vấn đề gốc

Lỗi `cookies() was called outside a request scope` xảy ra vì:

1. File `app/(auth)/actions.ts` có `'use client'` directive, nghĩa là nó chạy ở client-side
2. Nhưng code lại cố gắng sử dụng `cookies()` từ `next/headers` - đây là server-side API
3. Next.js không cho phép sử dụng server-side APIs ở client-side

## Giải pháp

### 1. Thay thế server-side cookies() bằng client-side storage

**Trước (gây lỗi):**
```typescript
// ❌ SAI - Sử dụng server-side API ở client-side
const { cookies } = await import('next/headers');
const cookieStore = await cookies();
cookieStore.set('access_token', token, { ... });
```

**Sau (đúng):**
```typescript
// ✅ ĐÚNG - Sử dụng client-side storage
// localStorage
if (typeof window !== 'undefined') {
  localStorage.setItem('access_token', token);
  localStorage.setItem('user_role', role);
  localStorage.setItem('user_id', userId);
}

// document.cookie
if (typeof document !== 'undefined') {
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  document.cookie = `client_access_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `user_role=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `user_id=${userId}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
```

### 2. Kiểm tra môi trường trước khi sử dụng

Luôn kiểm tra `typeof window !== 'undefined'` và `typeof document !== 'undefined'` trước khi sử dụng client-side APIs.

### 3. Thêm function registerService

Tạo function `registerService` trong `services/auth.service.ts` để xử lý đăng ký user.

## Cách hoạt động của hệ thống login

### 1. Flow đăng nhập

```
User nhập credentials → NextAuth signIn() → Backend API (port 8001) → 
Nhận access_token → Lưu vào localStorage + cookies → Redirect
```

### 2. Storage Strategy

**localStorage:**
- `access_token`: Token chính để xác thực
- `user_id`: ID của user
- `user_identifier`: Username/email
- `user_role`: Role của user

**Cookies:**
- `client_access_token`: Token cho client-side access
- `user_id`: ID user (để SSR có thể đọc)
- `user_identifier`: Username/email (để SSR có thể đọc)
- `user_role`: Role user (để SSR có thể đọc)

### 3. Server-side cookies

Server-side cookies được set trong API routes (`/api/auth/login/route.ts`):
- `access_token`: HttpOnly cookie cho bảo mật
- `client_access_token`: Non-httpOnly cookie cho client access

## Cách test

1. Chạy ứng dụng: `npm run dev`
2. Truy cập `/login`
3. Đăng nhập với credentials hợp lệ
4. Kiểm tra:
   - localStorage có token không
   - cookies có token không
   - Redirect có hoạt động không

## Lưu ý quan trọng

1. **Không bao giờ** sử dụng `cookies()` từ `next/headers` ở client-side
2. **Luôn kiểm tra** môi trường trước khi sử dụng client-side APIs
3. **Sử dụng cả** localStorage và cookies để đảm bảo tương thích
4. **HttpOnly cookies** cho bảo mật, **non-httpOnly cookies** cho client access
