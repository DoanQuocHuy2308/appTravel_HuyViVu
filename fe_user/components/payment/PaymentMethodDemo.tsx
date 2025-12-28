import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaymentMethodSelector, { PaymentMethod } from './PaymentMethodSelector';

export default function PaymentMethodDemo() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [demoPrice] = useState(2500000); // 2.5 triệu VND

  const handleSelectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
    console.log('Selected payment method:', method);
  };

  const getMethodDescription = (method: PaymentMethod) => {
    switch (method) {
      case 'direct':
        return 'Thanh toán trực tiếp tại văn phòng hoặc khi nhận tour';
      case 'qr':
        return 'Quét mã QR bằng ứng dụng ngân hàng';
      case 'momo':
        return 'Thanh toán qua ví MoMo';
      case 'bank':
        return 'Chuyển khoản trực tiếp đến tài khoản ngân hàng';
      default:
        return 'Vui lòng chọn phương thức thanh toán';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Demo Phương Thức Thanh Toán
          </Text>
          <Text className="text-gray-600 mb-6">
            Chọn phương thức thanh toán phù hợp với bạn
          </Text>
        </View>

        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onSelectMethod={handleSelectMethod}
          totalPrice={demoPrice}
        />

        {/* Selected Method Info */}
        {selectedMethod && (
          <View className="px-4 py-6">
            <View className="bg-white rounded-2xl p-6 shadow-lg">
              <Text className="text-lg font-bold text-gray-800 mb-4">
                Phương thức đã chọn
              </Text>
              
              <View className="bg-blue-50 rounded-xl p-4 mb-4">
                <Text className="text-base font-semibold text-blue-800 mb-2">
                  {selectedMethod === 'direct' && 'Thanh toán trực tiếp'}
                  {selectedMethod === 'qr' && 'QR Code'}
                  {selectedMethod === 'momo' && 'MoMo'}
                  {selectedMethod === 'bank' && 'Chuyển khoản ngân hàng'}
                </Text>
                <Text className="text-sm text-blue-700">
                  {getMethodDescription(selectedMethod)}
                </Text>
              </View>

              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Tổng tiền:</Text>
                  <Text className="font-bold text-red-600">
                    {new Intl.NumberFormat('vi-VN', { 
                      style: 'currency', 
                      currency: 'VND' 
                    }).format(demoPrice)}
                  </Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Trạng thái:</Text>
                  <Text className="font-semibold text-green-600">Sẵn sàng thanh toán</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Test Buttons */}
        <View className="px-4 py-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Test Actions</Text>
          
          <View className="space-y-3">
            <TouchableOpacity
              onPress={() => setSelectedMethod(null)}
              className="bg-gray-600 py-3 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                Reset Selection
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedMethod('direct')}
              className="bg-green-600 py-3 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                Test Direct Payment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedMethod('qr')}
              className="bg-blue-600 py-3 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                Test QR Payment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedMethod('momo')}
              className="bg-pink-600 py-3 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                Test MoMo Payment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedMethod('bank')}
              className="bg-orange-600 py-3 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                Test Bank Transfer
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Section */}
        <View className="px-4 py-6">
          <View className="bg-gray-100 rounded-2xl p-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Thông tin Demo
            </Text>
            <View className="space-y-2">
              <Text className="text-sm text-gray-600">
                • <Text className="font-semibold">Trực tiếp:</Text> Thanh toán tại văn phòng
              </Text>
              <Text className="text-sm text-gray-600">
                • <Text className="font-semibold">QR Code:</Text> Quét mã bằng app ngân hàng
              </Text>
              <Text className="text-sm text-gray-600">
                • <Text className="font-semibold">MoMo:</Text> Thanh toán qua ví MoMo
              </Text>
              <Text className="text-sm text-gray-600">
                • <Text className="font-semibold">Ngân hàng:</Text> Chuyển khoản trực tiếp
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
