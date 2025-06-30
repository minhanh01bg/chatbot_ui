# Document Pagination Feature

## Tính năng đã thêm

### 1. **Pagination State**
- `currentPage`: Trang hiện tại (mặc định: 1)
- `itemsPerPage`: Số items trên mỗi trang (mặc định: 10)

### 2. **Pagination Logic**
- Tính toán tổng số trang: `Math.ceil(filteredDocuments.length / itemsPerPage)`
- Slice documents theo trang: `filteredDocuments.slice(startIndex, endIndex)`
- Auto reset về trang 1 khi search term thay đổi

### 3. **Pagination Controls**
- **Items per page selector**: Dropdown với options 5, 10, 20, 50
- **Page navigation**: Previous/Next buttons với ChevronLeft/ChevronRight icons
- **Page numbers**: Hiển thị tối đa 5 page numbers với smart pagination
- **Page info**: "Showing X to Y of Z documents" và "Page X of Y"

### 4. **Smart Page Number Display**
- Nếu ≤ 5 trang: Hiển thị tất cả
- Nếu current page ≤ 3: Hiển thị 1-5
- Nếu current page ≥ (total-2): Hiển thị (total-4) đến total
- Ngược lại: Hiển thị (current-2) đến (current+2)

## UI Components sử dụng

- `Button` với variants outline/default
- `Select` với SelectTrigger, SelectContent, SelectItem
- `ChevronLeft`, `ChevronRight` icons từ lucide-react

## Cách sử dụng

1. **Thay đổi items per page**: Chọn từ dropdown (5, 10, 20, 50)
2. **Navigate pages**: Click Previous/Next hoặc click số trang cụ thể
3. **Search**: Tự động reset về trang 1 khi search
4. **Responsive**: Pagination chỉ hiển thị khi có > 1 trang

## Code Structure

```typescript
// State
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);

// Logic
const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

// Handlers
const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
```

## Benefits

1. **Performance**: Chỉ render documents của trang hiện tại
2. **UX**: Easy navigation với visual feedback
3. **Flexibility**: User có thể chọn số items per page
4. **Responsive**: Tự động ẩn/hiện pagination controls
5. **Smart**: Auto reset khi search, smart page number display
