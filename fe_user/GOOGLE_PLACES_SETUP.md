# 🗺️ Hướng dẫn Setup OpenStreetMap + Nominatim API

## 📋 Yêu cầu

Để sử dụng tính năng tìm kiếm địa chỉ thực tế, bạn cần:

1. **Không cần API Key** - Nominatim API hoàn toàn miễn phí!
2. **Internet Connection** - Chỉ cần kết nối mạng
3. **User Agent** - Bắt buộc phải có User Agent hợp lệ

## 🚀 Các bước setup

### 1. Không cần setup gì!

OpenStreetMap + Nominatim API đã được tích hợp sẵn và hoạt động ngay lập tức!

### 2. Cấu hình User Agent

File `fe_user/services/addressService.ts` đã được cấu hình với User Agent hợp lệ:

```typescript
private readonly USER_AGENT = 'HuyViVu-TourApp/1.0';
```

### 3. Test ngay lập tức

App đã sẵn sàng sử dụng mà không cần cấu hình thêm!

## 🔧 Tính năng có sẵn

### ✅ **Autocomplete Search**
- Tìm kiếm địa chỉ với gợi ý
- Hỗ trợ tiếng Việt
- Giới hạn kết quả trong Việt Nam

### ✅ **Geocoding**
- Chuyển đổi địa chỉ thành tọa độ
- Chính xác cao
- Không giới hạn requests

### ✅ **Reverse Geocoding**
- Chuyển đổi tọa độ thành địa chỉ
- Hiển thị địa chỉ chi tiết

### ✅ **Nearby Search**
- Tìm kiếm địa điểm gần vị trí hiện tại
- Hỗ trợ nhiều loại địa điểm

## 💰 Chi phí

**HOÀN TOÀN MIỄN PHÍ!**

- ✅ **Không giới hạn requests**
- ✅ **Không cần API Key**
- ✅ **Không cần billing account**
- ✅ **Không cần đăng ký**

## 🎯 Lợi ích của OpenStreetMap + Nominatim

### **So với Google Places API:**
- ✅ **Miễn phí hoàn toàn**
- ✅ **Không cần setup phức tạp**
- ✅ **Dữ liệu mở và minh bạch**
- ✅ **Cộng đồng đóng góp**
- ✅ **Không giới hạn usage**

## 🧪 Test API

App đã sẵn sàng sử dụng ngay lập tức:

1. Chạy app: `npm start`
2. Vào tab **Explore**
3. Nhập địa chỉ bất kỳ (ví dụ: "Ho Chi Minh City", "Hanoi", "Da Nang")
4. Xem kết quả tìm kiếm từ OpenStreetMap

## 🚨 Troubleshooting

### Không có kết quả tìm kiếm

- Kiểm tra internet connection
- Thử với từ khóa khác
- Kiểm tra console logs

### Lỗi "Too Many Requests"

- Nominatim có rate limit 1 request/second
- App đã được tối ưu với debounce 300ms
- Nếu vẫn lỗi, thử lại sau vài giây

### Kết quả không chính xác

- Thử với từ khóa cụ thể hơn
- Sử dụng tên tiếng Việt
- Thêm tên thành phố vào từ khóa

## 📱 Tính năng đã tích hợp

✅ **Nominatim Search** - Tìm kiếm địa chỉ miễn phí
✅ **OpenStreetMap Data** - Dữ liệu mở và chính xác
✅ **Vietnamese Support** - Hỗ trợ tiếng Việt
✅ **Geocoding** - Chuyển đổi địa chỉ thành tọa độ
✅ **Reverse Geocoding** - Chuyển đổi tọa độ thành địa chỉ
✅ **Nearby Search** - Tìm kiếm địa điểm gần đây
✅ **Error Handling** - Xử lý lỗi và thông báo
✅ **UI Integration** - Giao diện giống Google Maps

## 🔄 Cập nhật

Không cần cập nhật gì! App tự động sử dụng OpenStreetMap + Nominatim API miễn phí.

## 🌟 Ưu điểm

- **Miễn phí hoàn toàn**
- **Không cần API Key**
- **Dữ liệu mở và minh bạch**
- **Cộng đồng đóng góp**
- **Không giới hạn usage**
- **Setup đơn giản**

---

**Chúc bạn sử dụng thành công! 🎉**