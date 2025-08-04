# Debug Create Site API

## Vấn đề đã được sửa:

1. **Sai endpoint**: `createSite` function đang gọi `/api/sites` thay vì `/api/admin/sites/create`
2. **Thiếu authentication**: Không gửi Authorization header
3. **Thiếu type definition**: `CreateSiteData` interface chưa được định nghĩa
4. **Thiếu validation**: Không validate domain format, model_type, language

## Các thay đổi đã thực hiện:

### 1. Sửa `services/site.service.ts`:
- Thêm `CreateSiteData` interface
- Sửa endpoint từ `/api/sites` thành `/api/admin/sites/create`
- Thêm authentication token từ `getClientAuthToken()`
- Cải thiện error handling

### 2. Cập nhật `app/api/admin/sites/create/route.ts`:
- Hỗ trợ cả Authorization header và cookies
- Thêm validation cho domain, model_type, language
- Cải thiện error logging
- Thêm JSON parsing error handling

### 3. Cập nhật `components/admin/sites/CreateSiteModal.tsx`:
- Thêm domain validation regex
- Cải thiện user feedback

## Cách test:

1. **Chạy development server**:
   ```bash
   npm run dev
   ```

2. **Kiểm tra console logs** khi tạo site để xem:
   - Token authentication
   - Request body
   - Backend response
   - Error messages

3. **Kiểm tra Network tab** trong browser DevTools để xem:
   - Request headers
   - Response status
   - Response body

## Các lỗi có thể gặp:

1. **401 Unauthorized**: Token không hợp lệ hoặc thiếu
2. **400 Bad Request**: Validation errors (domain format, model_type, language)
3. **500 Internal Server Error**: Backend API lỗi

## Debug steps:

1. Kiểm tra token có tồn tại không
2. Kiểm tra backend URL có đúng không
3. Kiểm tra backend API có hoạt động không
4. Kiểm tra request body format
5. Kiểm tra response từ backend 