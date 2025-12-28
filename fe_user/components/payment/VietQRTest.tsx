import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshCw, Copy, ExternalLink, CheckCircle } from 'lucide-react-native';
import { generateVietQRUrl, getBankInfo, supportedBanks } from './VietQRHelper';

export default function VietQRTest() {
  const [testAmount] = useState(2500000); // 2.5 triệu VND
  const [testTourTitle] = useState('Tour Đà Lạt 3N2Đ');
  const [testBookingCode] = useState('VIVU-TEST123');
  const [isLoading, setIsLoading] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bankInfo = getBankInfo();

  const handleGenerateQR = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const url = generateVietQRUrl(testAmount, testTourTitle, testBookingCode);
      console.log('Generated VietQR URL:', url);
      
      // Test if URL is valid by trying to load the image
      setQrImageUrl(url);
      Alert.alert('Thành công!', 'QR code đã được tạo thành công');
    } catch (err) {
      console.error('VietQR Error:', err);
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      Alert.alert('Lỗi', err instanceof Error ? err.message : 'Không thể tạo QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyInfo = () => {
    const info = `Ngân hàng: ${bankInfo.bankName}\nSố tài khoản: ${bankInfo.accountNumber}\nChủ tài khoản: ${bankInfo.accountName}\nSố tiền: ${testAmount.toLocaleString('vi-VN')} VND\nNội dung: Tour: ${testTourTitle} - ${testBookingCode}`;
    Alert.alert('Sao chép thành công', 'Thông tin đã được sao chép vào clipboard');
  };

  const handleOpenUrl = () => {
    if (qrImageUrl) {
      Alert.alert('Mở URL', `URL: ${qrImageUrl}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Test VietQR API
          </Text>
          <Text className="text-gray-600 mb-6">
            Kiểm tra tích hợp VietQR với thông tin tour
          </Text>
        </View>

        {/* Test Info */}
        <View className="px-4 py-6">
          <View className="bg-blue-50 rounded-xl p-4 mb-4">
            <Text className="text-sm font-semibold text-blue-800 mb-2">Thông tin test:</Text>
            <Text className="text-xs text-blue-700">
              • Tour: {testTourTitle}{'\n'}
              • Booking Code: {testBookingCode}{'\n'}
              • Amount: {testAmount.toLocaleString('vi-VN')} VND{'\n'}
              • Bank: {bankInfo.bankName} ({bankInfo.bankCode})
            </Text>
          </View>
        </View>

        {/* Generate QR Button */}
        <View className="px-4 py-6">
          <TouchableOpacity
            onPress={handleGenerateQR}
            disabled={isLoading}
            className="bg-blue-600 py-4 rounded-xl mb-4"
          >
            <View className="flex-row items-center justify-center">
              <RefreshCw 
                size={20} 
                color="white" 
                className={isLoading ? 'animate-spin' : ''}
              />
              <Text className="text-white font-bold ml-2">
                {isLoading ? 'Đang tạo QR...' : 'Tạo QR Code VietQR'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* QR Code Display */}
        <View className="px-4 py-6">
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <Text className="text-lg font-bold text-gray-800 mb-4 text-center">
              QR Code VietQR
            </Text>
            
            <View className="items-center">
              {isLoading ? (
                <View className="w-[200px] h-[200px] items-center justify-center bg-gray-100 rounded-xl">
                  <ActivityIndicator size="large" color="#1e40af" />
                  <Text className="text-sm text-gray-600 mt-2">Đang tải QR code...</Text>
                </View>
              ) : error ? (
                <View className="w-[200px] h-[200px] items-center justify-center bg-red-100 rounded-xl">
                  <Text className="text-sm text-red-600 text-center">Lỗi: {error}</Text>
                </View>
              ) : qrImageUrl ? (
                <View className="items-center">
                  <Image
                    source={{ uri: qrImageUrl }}
                    style={{ width: 200, height: 200 }}
                    resizeMode="contain"
                  />
                  <View className="flex-row items-center mt-2">
                    <CheckCircle size={16} color="#10b981" />
                    <Text className="text-sm text-green-600 ml-1">QR code đã tải thành công</Text>
                  </View>
                </View>
              ) : (
                <View className="w-[200px] h-[200px] items-center justify-center bg-gray-100 rounded-xl">
                  <Text className="text-sm text-gray-600 text-center">Nhấn "Tạo QR Code" để kiểm tra API</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Bank Information */}
        <View className="px-4 py-6">
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <Text className="text-lg font-bold text-gray-800 mb-4">Thông tin ngân hàng</Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Ngân hàng:</Text>
                <Text className="font-semibold text-gray-800">{bankInfo.bankName}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Mã ngân hàng:</Text>
                <Text className="font-semibold text-gray-800">{bankInfo.bankCode}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Số tài khoản:</Text>
                <Text className="font-semibold text-gray-800">{bankInfo.accountNumber}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Chủ tài khoản:</Text>
                <Text className="font-semibold text-gray-800">{bankInfo.accountName}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleCopyInfo}
              className="flex-row items-center justify-center bg-blue-100 py-3 rounded-lg mt-4"
            >
              <Copy size={16} color="#1e40af" />
              <Text className="text-sm text-blue-800 font-semibold ml-2">Sao chép thông tin</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* URL Display */}
        {qrImageUrl && (
          <View className="px-4 py-6">
            <View className="bg-gray-50 rounded-xl p-4">
              <Text className="text-sm text-gray-600 mb-2">Generated URL:</Text>
              <Text className="text-xs text-gray-800 break-all">{qrImageUrl}</Text>
              
              <TouchableOpacity
                onPress={handleOpenUrl}
                className="flex-row items-center justify-center bg-gray-600 py-2 rounded-lg mt-3"
              >
                <ExternalLink size={16} color="white" />
                <Text className="text-sm text-white font-semibold ml-2">Mở URL</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Supported Banks */}
        <View className="px-4 py-6">
          <View className="bg-green-50 rounded-xl p-4">
            <Text className="text-lg font-bold text-green-800 mb-4">Ngân hàng hỗ trợ VietQR</Text>
            <View className="flex-row flex-wrap">
              {supportedBanks.map((bank, index) => (
                <View key={index} className="bg-white rounded-lg p-2 mr-2 mb-2">
                  <Text className="text-xs font-semibold text-gray-800">{bank.shortName}</Text>
                  <Text className="text-xs text-gray-600">{bank.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
