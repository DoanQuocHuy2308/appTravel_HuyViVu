# Trang Báo Cáo Thống Kê

## Tổng quan
Trang báo cáo thống kê cung cấp một giao diện chuyên nghiệp để xem và phân tích dữ liệu hệ thống với thiết kế màu xanh lá đậm và trắng ánh be nhẹ.

## Tính năng chính

### 1. Dashboard Tổng quan
- **Thống kê tổng quan**: Hiển thị tổng số tours, khách hàng, doanh thu, và đặt tour
- **Tăng trưởng**: So sánh với tháng trước với chỉ số tăng trưởng
- **Progress bars**: Hiển thị phân bố trạng thái đặt tour

### 2. Biểu đồ và Charts
- **Biểu đồ doanh thu**: Line chart hiển thị doanh thu theo tháng
- **Phân bố tours**: Doughnut chart hiển thị phân bố tours theo loại
- **Tương tác**: Charts có thể zoom, hover để xem chi tiết

### 3. Top Performers
- **Top 5 Tours phổ biến**: Tours được đặt nhiều nhất với doanh thu
- **Top 5 Khách hàng VIP**: Khách hàng chi tiêu nhiều nhất
- **Ranking system**: Hệ thống xếp hạng với màu sắc phân biệt

### 4. Bộ lọc và Xuất báo cáo
- **Lọc theo loại báo cáo**: Tổng quan, Doanh thu, Đặt tour, Khách hàng, Tours
- **Lọc theo thời gian**: Chọn khoảng thời gian cụ thể
- **Xuất Excel**: Xuất dữ liệu ra file Excel
- **Xuất PDF**: (Đang phát triển riêng)

### 5. Bảng chi tiết
- **Chi tiết đặt tour**: Bảng hiển thị các đặt tour gần đây
- **Sắp xếp**: Có thể sắp xếp theo các cột khác nhau
- **Phân trang**: Hiển thị 5-25 records per page

## Cấu trúc Components

### 1. `page.tsx`
- Component chính của trang báo cáo
- Quản lý state và logic chính
- Tích hợp các hooks và services

### 2. `StatsOverview.tsx`
- Hiển thị các thẻ thống kê tổng quan
- Progress bars cho trạng thái booking
- Animation fade-in-up

### 3. `TopPerformers.tsx`
- Hiển thị top tours và khách hàng
- Tính toán ranking và thống kê
- Bảng dữ liệu với sắp xếp

### 4. `baocao.css`
- CSS tùy chỉnh với theme xanh lá và be
- Animations và transitions
- Responsive design

## Hooks được sử dụng

### 1. `useDashboardStats`
- Lấy thống kê tổng quan từ dashboard
- Tính toán tăng trưởng và xu hướng
- Quản lý loading và error states

### 2. `useBookings`
- Quản lý dữ liệu bookings
- Lọc và sắp xếp bookings
- Tính năng export

### 3. `useUsers`
- Quản lý dữ liệu người dùng
- Lấy thông tin khách hàng

### 4. `useTours`
- Quản lý dữ liệu tours
- Phân loại và thống kê tours

## Services được sử dụng

### 1. `exportBookingsToExcel`
- Xuất dữ liệu bookings ra Excel
- Hỗ trợ styling và formatting
- Tự động download file

## Màu sắc và Theme

### Màu chính
- **Xanh lá đậm**: `#065f46`, `#047857`, `#059669`
- **Xanh lá nhạt**: `#10b981`, `#34d399`, `#6ee7b7`
- **Be nhẹ**: `#f5f5dc`, `#faf0e6`, `#fefcf9`
- **Be đậm**: `#d4c4a8`, `#e6ddd4`, `#c4b5a0`

### Gradient
- **Background**: `linear-gradient(135deg, #f5f5dc 0%, #faf0e6 50%, #f5f5dc 100%)`
- **Cards**: `linear-gradient(135deg, #065f46 0%, #047857 100%)`

## Responsive Design

### Breakpoints
- **Mobile**: `< 768px` - 1 cột, stack vertically
- **Tablet**: `768px - 1024px` - 2 cột
- **Desktop**: `> 1024px` - 4 cột cho stats, 2 cột cho charts

### Mobile Optimizations
- Touch-friendly buttons
- Simplified navigation
- Optimized chart sizes
- Readable text sizes

## Performance

### Optimizations
- Lazy loading cho charts
- Memoization cho calculations
- Efficient data filtering
- Minimal re-renders

### Loading States
- Skeleton loaders cho cards
- Progress spinners cho data loading
- Error handling với retry options

## Cách sử dụng

### 1. Truy cập trang
```
/admin/baocao
```

### 2. Lọc dữ liệu
- Chọn loại báo cáo từ dropdown
- Chọn khoảng thời gian từ calendar
- Click "Làm mới" để cập nhật dữ liệu

### 3. Xuất báo cáo
- Click "Xuất Excel" để tải file Excel
- Click "Xuất PDF" (đang phát triển)

### 4. Xem chi tiết
- Hover vào charts để xem tooltips
- Click vào các cột trong bảng để sắp xếp
- Sử dụng pagination để xem thêm dữ liệu

## Troubleshooting

### Lỗi thường gặp
1. **Dữ liệu không hiển thị**: Kiểm tra kết nối API và permissions
2. **Charts không render**: Kiểm tra dữ liệu có hợp lệ không
3. **Export không hoạt động**: Kiểm tra quyền download của browser

### Debug
- Mở Developer Tools để xem console logs
- Kiểm tra Network tab cho API calls
- Xem state trong React DevTools

## Tương lai

### Tính năng sắp tới
- [ ] Export PDF với charts
- [ ] Real-time updates
- [ ] Advanced filtering options
- [ ] Custom date ranges
- [ ] Email reports
- [ ] Scheduled reports
- [ ] More chart types (bar, area, scatter)
- [ ] Drill-down functionality
- [ ] Comparative analysis
- [ ] KPI dashboard
