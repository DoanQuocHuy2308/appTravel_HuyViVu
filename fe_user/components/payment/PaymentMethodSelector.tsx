import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CreditCard, Smartphone, QrCode, Building2, CheckCircle } from 'lucide-react-native';

export type PaymentMethod = 'direct' | 'qr' | 'momo' | 'bank';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  totalPrice: number;
}

export default function PaymentMethodSelector({ 
  selectedMethod, 
  onSelectMethod, 
  totalPrice 
}: PaymentMethodSelectorProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const paymentMethods = [
    {
      id: 'direct' as PaymentMethod,
      name: 'Thanh toán trực tiếp',
      description: 'Thanh toán tại văn phòng hoặc khi nhận tour',
      icon: CreditCard,
      color: '#10b981',
      bgColor: '#f0fdf4',
      features: ['Không phí', 'An toàn', 'Tiện lợi'],
      isAvailable: true
    },
    {
      id: 'qr' as PaymentMethod,
      name: 'QR Code',
      description: 'Quét mã QR để thanh toán',
      icon: QrCode,
      color: '#1e40af',
      bgColor: '#eff6ff',
      features: ['Nhanh chóng', 'Bảo mật', 'Phí 0%'],
      isAvailable: true
    },
    {
      id: 'momo' as PaymentMethod,
      name: 'MoMo',
      description: 'Thanh toán qua ví MoMo',
      icon: Smartphone,
      color: '#d82d8b',
      bgColor: '#fdf2f8',
      features: ['Tiện lợi', 'Nhanh chóng', 'Phí 0%'],
      isAvailable: true
    },
    {
      id: 'bank' as PaymentMethod,
      name: 'Chuyển khoản ngân hàng',
      description: 'Chuyển khoản trực tiếp',
      icon: Building2,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      features: ['Bảo mật cao', 'Phí thấp', 'Hỗ trợ 24/7'],
      isAvailable: true
    }
  ];

  return (
    <View className="px-4 py-6">
      <Text className="text-lg font-bold text-gray-800 mb-4">PHƯƠNG THỨC THANH TOÁN</Text>
      
      <View className="space-y-3">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <TouchableOpacity
              key={method.id}
              onPress={() => method.isAvailable && onSelectMethod(method.id)}
              disabled={!method.isAvailable}
              className={`rounded-2xl p-4 border-2 ${
                isSelected 
                  ? 'border-green-500 bg-green-50' 
                  : method.isAvailable 
                    ? 'border-gray-200 bg-white' 
                    : 'border-gray-100 bg-gray-50'
              }`}
              style={{
                borderColor: isSelected ? method.color : undefined,
                backgroundColor: isSelected ? method.bgColor : undefined
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center mr-3"
                    style={{ 
                      backgroundColor: isSelected ? method.color : '#f3f4f6'
                    }}
                  >
                    <IconComponent 
                      size={24} 
                      color={isSelected ? 'white' : '#6b7280'} 
                    />
                  </View>
                  
                  <View className="flex-1">
                    <Text className={`text-lg font-bold ${
                      isSelected ? 'text-gray-800' : 'text-gray-700'
                    }`}>
                      {method.name}
                    </Text>
                    <Text className={`text-sm ${
                      isSelected ? 'text-gray-600' : 'text-gray-500'
                    }`}>
                      {method.description}
                    </Text>
                  </View>
                </View>

                {isSelected && (
                  <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center">
                    <CheckCircle size={16} color="white" />
                  </View>
                )}
              </View>

              {/* Features */}
              <View className="flex-row flex-wrap mt-3">
                {method.features.map((feature, index) => (
                  <View 
                    key={index}
                    className="bg-white rounded-full px-3 py-1 mr-2 mb-1"
                    style={{ 
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.8)' : '#f9fafb'
                    }}
                  >
                    <Text className="text-xs font-medium text-gray-600">
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Details when selected */}
              {isSelected && (
                <View className="mt-4 bg-white/80 rounded-xl p-4 border border-white/60">
                  {method.id === 'direct' && (
                    <View>
                      <Text className="text-sm font-semibold text-gray-800 mb-2">Thông tin thanh toán trực tiếp</Text>
                      <Text className="text-sm text-gray-600">- Thanh toán tại văn phòng trong giờ hành chính</Text>
                      <Text className="text-sm text-gray-600">- Hoặc thanh toán cho hướng dẫn viên khi bắt đầu tour</Text>
                      <Text className="text-sm text-gray-600 mt-2">Liên hệ hỗ trợ: 1900 0000</Text>
                    </View>
                  )}
                  {method.id === 'qr' && (
                    <View>
                      <Text className="text-sm font-semibold text-gray-800 mb-2">Quét mã QR để thanh toán</Text>
                      <View className="bg-gray-100 rounded-xl items-center justify-center p-6">
                        <Text className="text-gray-500 text-xs">QR sẽ hiển thị ở bước thanh toán tiếp theo</Text>
                      </View>
                      <Text className="text-xs text-gray-500 mt-2">Gợi ý: Dùng ứng dụng ngân hàng/ ví điện tử để quét mã</Text>
                    </View>
                  )}
                  {method.id === 'momo' && (
                    <View>
                      <Text className="text-sm font-semibold text-gray-800 mb-2">Thanh toán qua MoMo</Text>
                      <Text className="text-sm text-gray-600">- Bạn sẽ được chuyển hướng đến ứng dụng MoMo</Text>
                      <Text className="text-sm text-gray-600">- Kiểm tra nội dung và xác nhận thanh toán</Text>
                    </View>
                  )}
                  {method.id === 'bank' && (
                    <View>
                      <Text className="text-sm font-semibold text-gray-800 mb-2">Chuyển khoản ngân hàng</Text>
                      <View className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <Text className="text-sm text-gray-700">Ngân hàng: Vietinbank (VTB)</Text>
                        <Text className="text-sm text-gray-700">Số tài khoản: 102873813822</Text>
                        <Text className="text-sm text-gray-700">Chủ tài khoản: DOAN QUOC HUY</Text>
                        <Text className="text-sm text-gray-700">Nội dung: Thanh toan tour "MÃ TOUR"</Text>
                      </View>
                      <Text className="text-xs text-gray-500 mt-2">Lưu ý: Giữ biên lai để đối soát khi cần</Text>
                    </View>
                  )}
                </View>
              )}

              {!method.isAvailable && (
                <View className="mt-2">
                  <Text className="text-xs text-red-500 font-medium">
                    Phương thức này tạm thời không khả dụng
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Total Price Display */}
      <View className="mt-6 bg-gray-50 rounded-xl p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-gray-800">Tổng thanh toán:</Text>
          <Text className="text-xl font-bold text-red-600">{formatCurrency(totalPrice)}</Text>
        </View>
        <Text className="text-sm text-gray-600 mt-1">
          {selectedMethod ? `Phương thức: ${paymentMethods.find(m => m.id === selectedMethod)?.name}` : 'Vui lòng chọn phương thức thanh toán'}
        </Text>
      </View>
    </View>
  );
}
