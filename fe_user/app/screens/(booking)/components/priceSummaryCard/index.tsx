import React from 'react';
import { View, Text } from 'react-native';

interface PriceSummaryCardProps {
    pricePerPerson: number;
    guestCount: number;
}

const PriceSummaryCard: React.FC<PriceSummaryCardProps> = ({ pricePerPerson, guestCount }) => {
    const subtotal = pricePerPerson * guestCount;
    const serviceFee = subtotal * 0.05; 
    const total = subtotal + serviceFee;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <View className="bg-white p-5 rounded-xl border border-gray-200 mt-5">
            <Text className="text-xl font-bold text-gray-800 mb-4">Tóm tắt chi phí</Text>
            <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                    <Text className="text-base text-gray-600">{`${formatCurrency(pricePerPerson)} x ${guestCount} khách`}</Text>
                    <Text className="text-base text-gray-800 font-semibold">{formatCurrency(subtotal)}</Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="text-base text-gray-600">Phí dịch vụ</Text>
                    <Text className="text-base text-gray-800 font-semibold">{formatCurrency(serviceFee)}</Text>
                </View>
                 <View className="border-t border-dashed border-gray-300 my-2" />
                <View className="flex-row justify-between items-center">
                    <Text className="text-lg font-bold text-gray-800">Tổng cộng</Text>
                    <Text className="text-xl font-bold text-[#08703f]">{formatCurrency(total)}</Text>
                </View>
            </View>
        </View>
    );
};

export default PriceSummaryCard;
