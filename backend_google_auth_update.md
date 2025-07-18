# Cập nhật Backend cho Google OAuth

Backend của bạn đã được cấu hình đúng để redirect về `/auth/success` với token trong query params.

## Cấu hình hiện tại (đã đúng):

```python
# Backend sẽ redirect như thế này:
redirect_url = (
    "http://localhost:3000/auth/success?"
    f"token={access_token}"
    f"&token_type=bearer"
    f"&expired_at={expired_at}"
    f"&state={request.query_params.get('state')}"
)
return RedirectResponse(url=redirect_url)
```

## Frontend đã được cấu hình để xử lý:

1. **Trang `/auth/success`** - Xử lý callback từ Google OAuth
2. **Lưu token** vào localStorage và cookies
3. **Tự động redirect** về `/admin` sau khi xử lý xong
4. **Xử lý lỗi** và hiển thị thông báo phù hợp

## Lưu ý quan trọng:

1. **CORS**: Đảm bảo backend có cấu hình CORS cho phép frontend gọi API
2. **Redirect URI**: Trong Google Console, thêm `http://localhost:3000/api/auth/google/callback` vào danh sách redirect URIs
3. **Environment**: Cập nhật URL cho production environment

## Kiểm tra Google Console

Đảm bảo trong Google Cloud Console > APIs & Services > Credentials:
- Authorized redirect URIs có: `http://localhost:8001/auth/google/callback` (backend callback)
- Authorized JavaScript origins có: `http://localhost:3000` và `http://localhost:8001`

## Flow hoạt động:

1. User click "Continue with Google" → redirect đến `http://localhost:8001/auth/google`
2. Google OAuth → callback về `http://localhost:8001/auth/google/callback`
3. Backend xử lý token → redirect về `http://localhost:3000/auth/success?token=...`
4. Frontend xử lý token → lưu vào localStorage/cookies → redirect về `/admin`

## Test:

1. Vào `/test-google-auth` để test
2. Click "Test Google Login"
3. Sau khi login thành công sẽ tự redirect về `/admin`
