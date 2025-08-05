# Test Admin API

## 1. Test API lấy danh sách users

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

## 2. Test API tạo subscription cho user

```bash
curl -X POST http://localhost:3000/api/subscriptions/admin \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "plan_id_here",
    "userId": "user_id_here"
  }'
```

## 3. Test với Postman

### GET /api/users
- Method: GET
- URL: http://localhost:3000/api/users
- Headers: 
  - Authorization: Bearer YOUR_ACCESS_TOKEN
  - Content-Type: application/json

### POST /api/subscriptions/admin
- Method: POST
- URL: http://localhost:3000/api/subscriptions/admin
- Headers:
  - Authorization: Bearer YOUR_ACCESS_TOKEN
  - Content-Type: application/json
- Body (JSON):
```json
{
  "planId": "plan_id_here",
  "userId": "user_id_here"
}
```

## 4. Kiểm tra quyền superadmin

- API sẽ trả về 403 nếu user không có role superadmin
- API sẽ trả về 401 nếu không có access token
- API sẽ trả về 400 nếu thiếu planId hoặc userId

## 5. Test giao diện

1. Đăng nhập với tài khoản superadmin
2. Vào trang admin
3. Kiểm tra sidebar có hiển thị "Admin Subscriptions" không
4. Click vào "Admin Subscriptions"
5. Kiểm tra modal tạo subscription có hoạt động không 