import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { ArrowLeft, CheckCircle2, CreditCard, Smartphone, QrCode, Building2, Home, Ticket, Copy, RefreshCw } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/header';
import { ToastContext } from '@/contexts/ToastContext';
import { useContext } from 'react';
import { generateVietQRUrl, getBankInfo } from '@/components/payment/VietQRHelper';

const formatCurrency = (amount: any) => {
    const numberAmount = parseFloat(String(amount)); 
    if (isNaN(numberAmount)) return "0 VND";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numberAmount);
};

export default function PaymentScreen() {
    const router = useRouter();
    const { showToast } = useContext(ToastContext);
    const [checkPayment, setCheckPayment] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const params = useLocalSearchParams<{ 
        tourTitle?: string, 
        guestCount?: string, 
        totalPrice?: string,
        bookingId?: string,
        adults?: string,
        children?: string,
        infants?: string,
        paymentMethod?: string
    }>();

    const { 
        tourTitle = "Không có thông tin", 
        guestCount = "0", 
        totalPrice = "0",
        bookingId,
        adults = "0",
        children = "0", 
        infants = "0",
        paymentMethod = "direct"
    } = params;

    const [bookingCode] = useState(bookingId || `VIVU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    const [isLoading, setIsLoading] = useState(false);

    const handlePaymentSuccess = () => {
        setCheckPayment(true);
        showToast('success', 'Thanh toán thành công!');
        // Có thể thêm logic xử lý thanh toán thành công ở đây
    };

    const handleCopyInfo = () => {
        showToast('success', 'Thông tin đã được sao chép');
    };

    const renderDirectPayment = () => (
        <View className="px-4 py-6">
            <View className="items-center mb-8">
                <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
                    <CheckCircle2 size={40} color="#10b981" />
                </View>
                <Text className="text-3xl font-bold text-gray-800 mb-2">Đặt Tour Thành Công!</Text>
                <Text className="text-gray-600 text-center">
                    Bạn đã chọn thanh toán trực tiếp. Vui lòng thanh toán khi nhận tour.
                </Text>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <Text className="text-center text-lg font-semibold text-gray-800 mb-4">
                    Mã đặt tour của bạn
                </Text>
                <View className="bg-green-50 border-2 border-dashed border-green-400 p-4 rounded-lg">
                    <Text className="text-center text-2xl font-bold text-green-700 tracking-widest">
                        {bookingCode}
                    </Text>
                </View>
            </View>

            <View className="bg-blue-50 rounded-2xl p-6 mb-6">
                <Text className="text-lg font-bold text-blue-800 mb-4">Hướng dẫn thanh toán</Text>
                <View className="space-y-3">
                    <View className="flex-row items-start">
                        <Text className="text-blue-600 font-bold mr-2">1.</Text>
                        <Text className="text-blue-700 flex-1">Thanh toán tại văn phòng HuyViVu Travel</Text>
                    </View>
                    <View className="flex-row items-start">
                        <Text className="text-blue-600 font-bold mr-2">2.</Text>
                        <Text className="text-blue-700 flex-1">Hoặc thanh toán khi nhận tour</Text>
                    </View>
                    <View className="flex-row items-start">
                        <Text className="text-blue-600 font-bold mr-2">3.</Text>
                        <Text className="text-blue-700 flex-1">Mang theo mã đặt tour để xác nhận</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => {setPaymentSuccess(true); handlePaymentSuccess();}}
                    className="bg-green-600 py-4 rounded-xl mb-4"
                >
                    <Text className="text-white text-center text-lg font-bold">
                        Xác nhận đặt tour
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderQRPayment = () => {
        // Sử dụng totalPrice trực tiếp từ params (đã được tính toán từ booking)
        const amount = parseFloat(totalPrice) || 0;
        const qrUrl = generateVietQRUrl(amount, tourTitle, bookingCode);
        const bankInfo = getBankInfo();

        return (
            <View className="px-4 py-6">
                <View className="items-center mb-6">
                    <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                        <QrCode size={32} color="#1e40af" />
                    </View>
                    <Text className="text-2xl font-bold text-gray-800 mb-2">Thanh toán QR Code</Text>
                    <Text className="text-gray-600 text-center">
                        Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                    </Text>
                </View>

                <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                    <View className="items-center">
                        <Image
                            source={{ uri: qrUrl }}
                            style={{ width: 200, height: 200 }}
                            resizeMode="contain"
                        />
                        <Text className="text-sm text-gray-600 text-center mt-4">
                            Số tiền: {formatCurrency(amount)}
                        </Text>
                        <Text className="text-xs text-gray-500 text-center mt-2">
                            Nội dung: Tour: {tourTitle} - {bookingCode}
                        </Text>
                    </View>
                </View>

                {/* Bank Information */}
                <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Thông tin ngân hàng</Text>
                    
                    <View className="space-y-3">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Ngân hàng:</Text>
                            <Text className="font-semibold text-gray-800">{bankInfo.bankName}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Số tài khoản:</Text>
                            <Text className="font-semibold text-gray-800">{bankInfo.accountNumber}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Chủ tài khoản:</Text>
                            <Text className="font-semibold text-gray-800">{bankInfo.accountName}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Số tiền:</Text>
                            <Text className="font-bold text-red-600">{formatCurrency(amount)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Nội dung:</Text>
                            <Text className="font-semibold text-gray-800">Tour: {tourTitle} - {bookingCode}</Text>
                        </View>
                    </View>
                </View>

                <View className="bg-blue-50 rounded-2xl p-6 mb-6">
                    <Text className="text-lg font-bold text-blue-800 mb-4">Hướng dẫn thanh toán</Text>
                    <View className="space-y-3">
                        <View className="flex-row items-start">
                            <Text className="text-blue-600 font-bold mr-2">1.</Text>
                            <Text className="text-blue-700 flex-1">Mở ứng dụng ngân hàng</Text>
                        </View>
                        <View className="flex-row items-start">
                            <Text className="text-blue-600 font-bold mr-2">2.</Text>
                            <Text className="text-blue-700 flex-1">Chọn "Quét mã QR"</Text>
                        </View>
                        <View className="flex-row items-start">
                            <Text className="text-blue-600 font-bold mr-2">3.</Text>
                            <Text className="text-blue-700 flex-1">Quét mã QR bên trên</Text>
                        </View>
                        <View className="flex-row items-start">
                            <Text className="text-blue-600 font-bold mr-2">4.</Text>
                            <Text className="text-blue-700 flex-1">Xác nhận thanh toán</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => {setPaymentSuccess(true); handlePaymentSuccess();}}
                    className="bg-green-600 py-4 rounded-xl mb-4"
                >
                    <Text className="text-white text-center text-lg font-bold">
                        Tôi đã thanh toán thành công
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderMoMoPayment = () => {
        const amount = parseFloat(totalPrice) || 0;
        
        return (
            <View className="px-4 py-6">
                <View className="items-center mb-6">
                    <View className="w-16 h-16 bg-pink-100 rounded-full items-center justify-center mb-4">
                        <Smartphone size={32} color="#d82d8b" />
                    </View>
                    <Text className="text-2xl font-bold text-gray-800 mb-2">Thanh toán MoMo</Text>
                    <Text className="text-gray-600 text-center">
                        Thanh toán qua ví MoMo
                    </Text>
                </View>

                <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                    <View className="items-center">
                        <View className="w-48 h-48 bg-pink-100 rounded-xl items-center justify-center mb-4">
                            <Text className="text-gray-500">MoMo QR Code sẽ được tạo ở đây</Text>
                        </View>
                        <Text className="text-sm text-gray-600 text-center">
                            Số tiền: {formatCurrency(amount)}
                        </Text>
                    </View>
                </View>

                <View className="bg-pink-50 rounded-2xl p-6 mb-6">
                    <Text className="text-lg font-bold text-pink-800 mb-4">Hướng dẫn thanh toán</Text>
                    <View className="space-y-3">
                        <View className="flex-row items-start">
                            <Text className="text-pink-600 font-bold mr-2">1.</Text>
                            <Text className="text-pink-700 flex-1">Mở ứng dụng MoMo</Text>
                        </View>
                        <View className="flex-row items-start">
                            <Text className="text-pink-600 font-bold mr-2">2.</Text>
                            <Text className="text-pink-700 flex-1">Chọn "Quét mã"</Text>
                        </View>
                        <View className="flex-row items-start">
                            <Text className="text-pink-600 font-bold mr-2">3.</Text>
                            <Text className="text-pink-700 flex-1">Quét mã QR bên trên</Text>
                        </View>
                        <View className="flex-row items-start">
                            <Text className="text-pink-600 font-bold mr-2">4.</Text>
                            <Text className="text-pink-700 flex-1">Xác nhận thanh toán</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => {setPaymentSuccess(false); handlePaymentSuccess();}}
                    className="bg-green-600 py-4 rounded-xl mb-4"
                >
                    <Text className="text-white text-center text-lg font-bold">
                        Tôi đã thanh toán thành công
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderBankPayment = () => {
        const amount = parseFloat(totalPrice) || 0;
        
        return (
            <View className="px-4 py-6">
                <View className="items-center mb-6">
                    <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center mb-4">
                        <Building2 size={32} color="#f59e0b" />
                    </View>
                    <Text className="text-2xl font-bold text-gray-800 mb-2">Chuyển khoản ngân hàng</Text>
                    <Text className="text-gray-600 text-center">
                        Chuyển khoản trực tiếp đến tài khoản ngân hàng
                    </Text>
                </View>

                <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Thông tin chuyển khoản</Text>
                    
                    <View className="space-y-4">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Ngân hàng:</Text>
                            <Text className="font-semibold text-gray-800">Vietcombank</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Số tài khoản:</Text>
                            <View className="flex-row items-center">
                                <Text className="font-semibold text-gray-800 mr-2">102873813822</Text>
                                <TouchableOpacity onPress={handleCopyInfo}>
                                    <Copy size={16} color="#6b7280" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Chủ tài khoản:</Text>
                            <Text className="font-semibold text-gray-800">DOAN QUOC HUY</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Số tiền:</Text>
                            <Text className="font-bold text-red-600">{formatCurrency(amount)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Nội dung:</Text>
                            <Text className="font-semibold text-gray-800">Tour: {tourTitle} - {bookingCode}</Text>
                        </View>
                    </View>
                </View>

                <View className="bg-orange-50 rounded-2xl p-6 mb-6">
                    <Text className="text-lg font-bold text-orange-800 mb-4">Hướng dẫn chuyển khoản</Text>
                    <View className="space-y-3">
                        <View className="flex-row items-start">
                            <Text className="text-orange-600 font-bold mr-2">1.</Text>
                            <Text className="text-orange-700 flex-1">Mở ứng dụng ngân hàng</Text>
                        </View>
                        <View className="flex-row items-start">
                            <Text className="text-orange-600 font-bold mr-2">2.</Text>
                            <Text className="text-orange-700 flex-1">Chọn "Chuyển khoản"</Text>
                        </View>
                        <View className="flex-row items-start">
                            <Text className="text-orange-600 font-bold mr-2">3.</Text>
                            <Text className="text-orange-700 flex-1">Nhập thông tin bên trên</Text>
                        </View>
                        <View className="flex-row items-start">
                            <Text className="text-orange-600 font-bold mr-2">4.</Text>
                            <Text className="text-orange-700 flex-1">Ghi nội dung: Tour: {tourTitle} - {bookingCode}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => {setPaymentSuccess(false); handlePaymentSuccess();}}
                    className="bg-green-600 py-4 rounded-xl mb-4"
                >
                    <Text className="text-white text-center text-lg font-bold">
                        Tôi đã chuyển khoản thành công
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderContent = () => {
        switch (paymentMethod) {
            case 'direct':
                return renderDirectPayment();
            case 'qr':
                return renderQRPayment();
            case 'momo':
                return renderMoMoPayment();
            case 'bank':
                return renderBankPayment();
            default:
                return renderDirectPayment();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <Header title="Thanh toán" />
            
            <ScrollView className="flex-1">
                {renderContent()}
            </ScrollView>

            {/* Action Buttons */}
            <View className="p-6 flex-row space-x-4" style={{ display: checkPayment ? 'flex' : 'none' }}>
                <TouchableOpacity 
                    onPress={() => router.replace('/(tabs)')} 
                    className="flex-1 flex-row items-center justify-center bg-white border border-gray-300 py-4 rounded-xl"
                >
                    <Home size={20} color="#374151" />
                    <Text className="text-base font-bold text-gray-800 ml-2">Về trang chủ</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => router.push('/screens/(tour_manager)')}
                    className="flex-1 flex-row items-center justify-center bg-[#08703f] py-4 rounded-xl"
                >
                    <Ticket size={20} color="#fff" />
                    <Text className="text-base font-bold text-white ml-2">Xem Booking</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
