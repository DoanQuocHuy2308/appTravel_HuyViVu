import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image,  Alert } from 'react-native';
import { MOCK_TOUR_DETAILS } from '../../../data/data';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Mail, Phone, Users, Minus, Plus } from 'lucide-react-native';
import FormInput from '@/components/input';
import PriceSummaryCard from './components/priceSummaryCard';
import { useRouter } from 'expo-router';
import Back from '@/components/back';
export default function BookingScreen() {
    const router = useRouter();
    const [guestCount, setGuestCount] = useState(1);

    const handleGuestChange = (amount: number) => {
        setGuestCount(prev => Math.max(1, prev + amount));
    };

    const handleConfirmBooking = () => {
        Alert.alert(
            "Xác nhận Đặt Tour",
            "Bạn có chắc chắn muốn tiến hành thanh toán và đặt tour này không?",
            [
                { text: "Hủy bỏ", style: "cancel" },
                { 
                    text: "Xác nhận", 
                    onPress: () => router.push({
                        pathname: '/screens/(payment)',
                        params: { 
                            tourTitle: MOCK_TOUR_DETAILS.title,
                            guestCount: guestCount,
                            totalPrice: MOCK_TOUR_DETAILS.pricePerPerson * guestCount * 1.05 
                        }
                    }) 
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
                <Back />
                <Text className="flex-1 text-center text-xl font-bold text-gray-800 -ml-10">Xác nhận & Đặt chỗ</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View className="flex-row bg-white p-4 rounded-xl border border-gray-200">
                    <Image source={{ uri: MOCK_TOUR_DETAILS.image }} className="w-24 h-24 rounded-lg" />
                    <View className="flex-1 ml-4 justify-center">
                        <Text className="text-lg font-bold text-gray-800" numberOfLines={2}>{MOCK_TOUR_DETAILS.title}</Text>
                        <Text className="text-sm text-gray-500 mt-1">{MOCK_TOUR_DETAILS.duration}</Text>
                    </View>
                </View>
                <View className="mt-6">
                    <Text className="text-xl font-bold text-gray-800 mb-2">Thông tin liên hệ</Text>
                    <FormInput label="Họ và tên" icon={User} placeholder="Nguyễn Văn A" />
                    <FormInput label="Email" icon={Mail} placeholder="email@example.com" keyboardType="email-address" />
                    <FormInput label="Số điện thoại" icon={Phone} placeholder="09xxxxxxxx" keyboardType="phone-pad" />
                </View>
                <View className="mt-6">
                    <Text className="text-xl font-bold text-gray-800 mb-2">Số lượng khách</Text>
                    <View className="flex-row items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
                        <Users size={24} color="#374151" />
                        <View className="flex-row items-center">
                            <TouchableOpacity onPress={() => handleGuestChange(-1)} className="p-2 bg-gray-100 rounded-full">
                                <Minus size={20} color="#374151" />
                            </TouchableOpacity>
                            <Text className="text-xl font-bold w-16 text-center">{guestCount}</Text>
                             <TouchableOpacity onPress={() => handleGuestChange(1)} className="p-2 bg-[#08703f] rounded-full">
                                <Plus size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <PriceSummaryCard 
                    pricePerPerson={MOCK_TOUR_DETAILS.pricePerPerson} 
                    guestCount={guestCount}
                />
            </ScrollView>
            <View className="p-4 border-t border-gray-200 bg-white">
                <TouchableOpacity 
                    onPress={handleConfirmBooking}
                    className="bg-[#08703f] py-4 rounded-full"
                >
                    <Text className="text-white text-center text-lg font-bold">Thanh toán & Đặt ngay</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
