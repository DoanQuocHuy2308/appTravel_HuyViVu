# Màn hình Đơn đặt Tour của User

## Tổng quan
Màn hình đơn đặt tour của user được thiết kế để giúp người dùng xem và quản lý các đơn đặt tour của chính họ một cách thuận tiện và dễ dàng.

## Tính năng chính

### 1. Hiển thị danh sách đơn đặt tour
- Hiển thị tất cả đơn đặt tour với thông tin chi tiết
- Card layout responsive phù hợp với mọi kích thước màn hình
- Hiển thị trạng thái đơn đặt với màu sắc phân biệt

### 2. Tìm kiếm và lọc
- **Tìm kiếm**: Tìm kiếm theo tên tour, tên khách hàng, email
- **Lọc theo trạng thái**: Tất cả, Chờ xác nhận, Đã xác nhận, Đã hủy
- **Sắp xếp**: Sắp xếp theo ngày đặt tour

### 3. Quản lý đơn đặt
- **Hủy đơn đặt**: User có thể hủy đơn đặt khi đang ở trạng thái "Chờ xác nhận"
- **Xem chi tiết**: Hiển thị thông tin đầy đủ của đơn đặt
- **Đánh giá tour**: Đánh giá tour sau khi đã được xác nhận (tính năng sẽ được thêm sau)
- **Xem tour**: Xem thông tin chi tiết tour (tính năng sẽ được thêm sau)

### 4. Giao diện người dùng
- **Responsive Design**: Tối ưu cho mọi kích thước màn hình
- **Dark/Light Mode**: Hỗ trợ cả hai chế độ
- **Pull to Refresh**: Kéo để làm mới dữ liệu
- **Loading States**: Hiển thị trạng thái loading và error

## Cấu trúc file

```
(tour_manager)/
├── index.tsx                    # Màn hình chính
├── components/
│   ├── BookingCard.tsx         # Component hiển thị card đơn đặt
│   └── BookingDetailModal.tsx  # Modal hiển thị chi tiết đơn đặt
└── README.md                   # Tài liệu hướng dẫn
```

## Cách sử dụng

### 1. Import và sử dụng
```tsx
import TourManagerScreen from './app/screens/(tour_manager)/index';

// Trong navigation
<TourManagerScreen />
```

### 2. Hook useBookings
Màn hình sử dụng hook `useBookings` để quản lý dữ liệu:
```tsx
const {
  bookings,
  loading,
  error,
  fetchAllBookings,
  updateBooking,
  deleteBooking,
  filterBookingsByStatus,
  searchBookings,
  sortBookings,
} = useBookings();
```

### 3. Các action chính
- `fetchAllBookings()`: Lấy tất cả đơn đặt tour
- `updateBooking(data)`: Cập nhật thông tin đơn đặt
- `deleteBooking(id)`: Xóa đơn đặt
- `filterBookingsByStatus(status)`: Lọc theo trạng thái
- `searchBookings(keyword)`: Tìm kiếm
- `sortBookings(field, order)`: Sắp xếp

## Thiết kế UI/UX

### 1. Màu sắc
- **Chờ xác nhận**: Màu vàng (#F59E0B)
- **Đã xác nhận**: Màu xanh lá (#10B981)
- **Đã hủy**: Màu đỏ (#EF4444)
- **Nền**: Màu xám nhạt (#F9FAFB)

### 2. Typography
- **Tiêu đề**: Font bold, size 24px
- **Nội dung**: Font medium, size 16px
- **Phụ đề**: Font regular, size 14px

### 3. Spacing
- **Padding**: 16px cho các container chính
- **Margin**: 8px giữa các element
- **Border radius**: 12px cho các card

## Responsive Design

### 1. Mobile (< 768px)
- Card layout dọc
- Button full width
- Font size nhỏ hơn

### 2. Tablet (768px - 1024px)
- Card layout 2 cột
- Button size vừa
- Font size trung bình

### 3. Desktop (> 1024px)
- Card layout 3 cột
- Button size lớn
- Font size lớn

## Performance Optimization

### 1. Lazy Loading
- Chỉ render các component khi cần thiết
- Sử dụng FlatList cho danh sách lớn

### 2. Memoization
- Sử dụng React.memo cho các component
- useMemo cho các tính toán phức tạp

### 3. State Management
- Tối ưu state updates
- Tránh re-render không cần thiết

## Error Handling

### 1. Network Errors
- Hiển thị thông báo lỗi mạng
- Nút "Thử lại" để reload

### 2. Validation Errors
- Validate input trước khi gửi API
- Hiển thị thông báo lỗi cụ thể

### 3. Loading States
- Hiển thị skeleton loading
- Disable button khi đang loading

## Testing

### 1. Unit Tests
```tsx
import { render, fireEvent } from '@testing-library/react-native';
import TourManagerScreen from './index';

test('renders booking list correctly', () => {
  const { getByText } = render(<TourManagerScreen />);
  expect(getByText('Quản lý đơn đặt tour')).toBeTruthy();
});
```

### 2. Integration Tests
- Test các action buttons
- Test search và filter
- Test modal interactions

## Troubleshooting

### 1. Lỗi thường gặp
- **Không load được dữ liệu**: Kiểm tra API endpoint
- **Modal không hiển thị**: Kiểm tra state management
- **Button không hoạt động**: Kiểm tra event handlers

### 2. Debug
- Sử dụng React DevTools
- Console.log để debug state
- Network tab để kiểm tra API calls

## Tương lai

### 1. Tính năng mở rộng
- Export dữ liệu ra Excel/PDF
- Thông báo push khi có đơn đặt mới
- Bulk actions (xác nhận/hủy nhiều đơn cùng lúc)

### 2. Cải thiện UX
- Animation transitions
- Swipe actions
- Voice search

### 3. Analytics
- Tracking user interactions
- Performance metrics
- Error reporting
