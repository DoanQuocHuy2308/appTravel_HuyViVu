import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { CheckCircle2, Home, Ticket } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const formatCurrency = (amount: any) => {
    const numberAmount = parseFloat(String(amount)); 
    if (isNaN(numberAmount)) return "0 VND";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numberAmount);
};

export default function BookingSuccessScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ tourTitle?: string, guestCount?: string, totalPrice?: string }>();

    const { tourTitle = "Không có thông tin", guestCount = "0", totalPrice = "0" } = params;
    const [bookingCode] = React.useState(`VIVU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);

    return (
        // <LinearGradient colors={['#e6f7ff', '#ffffff']} className="flex-1">
            <SafeAreaView className="flex-1">
                <ScrollView contentContainerStyle={{ padding: 24, justifyContent: 'center', flexGrow: 1 }}>
                    <View className="items-center">
                        <CheckCircle2 size={80} color="#08703f" />
                        <Text className="text-3xl font-extrabold text-gray-800 mt-6">Đặt Tour Thành Công!</Text>
                        <Text className="text-base text-gray-600 mt-2 text-center">
                            Cảm ơn bạn đã tin tưởng. Chi tiết đặt tour đã được gửi đến email của bạn.
                        </Text>
                    </View>
                    
                    <View className="bg-white/80 p-6 rounded-2xl border border-gray-200 mt-8">
                        <Text className="text-center text-lg font-semibold text-gray-800">Mã đặt tour của bạn</Text>
                        <View className="bg-green-50 border-2 border-dashed border-green-400 p-3 rounded-lg mt-4">
                            <Text className="text-center text-2xl font-bold text-green-700 tracking-widest">{bookingCode}</Text>
                        </View>
                    </View>

                    <View className="bg-white/80 p-6 rounded-2xl border border-gray-200 mt-6 space-y-4">
                        <Text className="text-xl font-bold text-gray-800 mb-2">Tóm tắt chuyến đi</Text>
                        <View>
                            <Text className="text-sm text-gray-500">Tour</Text>
                            <Text className="text-base font-semibold text-gray-800 mt-1">{tourTitle}</Text>
                        </View>
                        <View>
                            <Text className="text-sm text-gray-500">Số lượng khách</Text>
                            <Text className="text-base font-semibold text-gray-800 mt-1">{guestCount} người</Text>
                        </View>
                         <View>
                            <Text className="text-sm text-gray-500">Tổng thanh toán</Text>
                            <Text className="text-base font-semibold text-gray-800 mt-1">{formatCurrency(totalPrice)}</Text>
                        </View>
                    </View>
                </ScrollView>

                <View className="p-6 flex-row space-x-4">
                    <TouchableOpacity 
                        // Sửa lại đường dẫn cho đúng chuẩn tab
                        onPress={() => router.replace('/screens/(tours)')} 
                        className="flex-1 flex-row items-center justify-center bg-white border border-gray-300 py-3.5 rounded-full"
                    >
                        <Home size={20} color="#374151" />
                        <Text className="text-base font-bold text-gray-800 ml-2">Về trang chủ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        // Sửa lại đường dẫn cho đúng chuẩn tab
                        // onPress={() => router.replace('/(my-bookings)')}
                        className="flex-1 flex-row items-center justify-center bg-[#08703f] py-3.5 rounded-full"
                    >
                        <Ticket size={20} color="#fff" />
                        <Text className="text-base font-bold text-white ml-2">Xem Booking</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        // </LinearGradient>
    );
}