# VietQR Integration

Tích hợp VietQR API để tạo QR code thanh toán với thông tin tour.

## 🚀 Tính năng

- ✅ **QR Code thực tế** từ VietQR API
- ✅ **Thông tin tour** được truyền vào `addInfo`
- ✅ **Cấu hình linh hoạt** cho nhiều ngân hàng
- ✅ **UI/UX chuyên nghiệp** với NativeWind
- ✅ **Test component** để kiểm tra API

## 📱 Cách sử dụng

### 1. Import VietQR Helper

```typescript
import { generateVietQRUrl, getBankInfo } from '@/components/payment/VietQRHelper';
```

### 2. Tạo QR Code URL

```typescript
const qrUrl = generateVietQRUrl(
  amount,        // Số tiền (VND)
  tourTitle,     // Tên tour
  bookingCode    // Mã đặt tour
);
```

### 3. Hiển thị QR Code

```tsx
<Image
  source={{ uri: qrUrl }}
  style={{ width: 200, height: 200 }}
  resizeMode="contain"
/>
```

## 🔧 Cấu hình

### VietQR Config

```typescript
export const vietQRConfig: VietQRConfig = {
  bankCode: '970415',                    // Mã ngân hàng
  accountNumber: '102873813822',         // Số tài khoản
  accountName: 'DOAN QUOC HUY',         // Tên chủ tài khoản
  baseUrl: 'https://api.vietqr.io/image/970415-102873813822-05v1T7u.jpg'
};
```

### URL Template

```
https://api.vietqr.io/image/970415-102873813822-05v1T7u.jpg?accountName=DOAN%20QUOC%20HUY&amount={amount}&addInfo={tourInfo}
```

**Parameters:**
- `accountName`: Tên chủ tài khoản (cố định)
- `amount`: Số tiền thanh toán (VND)
- `addInfo`: Tên tour và mã đơn hàng (ví dụ: "Tour: Tour Đà Lạt 3N2Đ - VIVU-123456")

## 🏦 Ngân hàng hỗ trợ

| Mã | Tên ngân hàng | Viết tắt |
|----|---------------|----------|
| 970415 | Vietcombank | VCB |
| 970422 | VietinBank | CTG |
| 970436 | BIDV | BIDV |
| 970416 | Agribank | AGB |
| 970403 | Techcombank | TCB |
| 970428 | MB Bank | MBB |
| 970441 | VPBank | VPB |
| 970405 | Sacombank | STB |
| 970429 | ACB | ACB |
| 970414 | TPBank | TPB |

## 📋 Ví dụ sử dụng

### Trong PaymentScreen

```tsx
const renderQRPayment = () => {
  const qrUrl = generateVietQRUrl(parseFloat(totalPrice), tourTitle, bookingCode);
  const bankInfo = getBankInfo();

  return (
    <View>
      <Image source={{ uri: qrUrl }} style={{ width: 200, height: 200 }} />
      <Text>Ngân hàng: {bankInfo.bankName}</Text>
      <Text>Số tài khoản: {bankInfo.accountNumber}</Text>
      <Text>Chủ tài khoản: {bankInfo.accountName}</Text>
    </View>
  );
};
```

### Test Component

```tsx
import VietQRTest from '@/components/payment/VietQRTest';

// Sử dụng trong app để test VietQR API
<VietQRTest />
```

## 🔍 Debug

### Console Log

```typescript
const qrUrl = generateVietQRUrl(2500000, 'Tour Đà Lạt 3N2Đ', 'VIVU-123456');
console.log('VietQR URL:', qrUrl);
// Output: https://api.vietqr.io/image/970415-102873813822-05v1T7u.jpg?accountName=DOAN%20QUOC%20HUY&amount=2500000&addInfo=Tour%3A%20Tour%20Da%20Lat%203N2D%20-%20VIVU-123456
```

### Test URL

Mở URL này trong browser để kiểm tra:
```
https://api.vietqr.io/image/970415-102873813822-05v1T7u.jpg?accountName=DOAN%20QUOC%20HUY&amount=2500000&addInfo=Tour%3A%20Tour%20Da%20Lat%203N2D%20-%20VIVU-123456
```

## 🎯 Lợi ích

- **QR Code thực tế** từ API VietQR
- **Tên tour và mã đơn hàng** được mã hóa trong QR
- **Dễ dàng tích hợp** với hệ thống thanh toán
- **Hỗ trợ đa ngân hàng** linh hoạt
- **Test component** để kiểm tra API

## 📞 Hỗ trợ

Nếu có vấn đề với VietQR API, kiểm tra:

1. **URL có đúng format** không
2. **Parameters** có được encode đúng không
3. **Network connection** có ổn định không
4. **API VietQR** có hoạt động không

---

**VietQR API**: [https://api.vietqr.io/](https://api.vietqr.io/)
