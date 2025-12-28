import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Heart, ChevronRight } from 'lucide-react-native';

interface BookingFooterProps {
    price: number;
    isWishlisted: boolean;
    onPressBooking: () => void;
    onPressWishlist: () => void;
}

const BookingFooter: React.FC<BookingFooterProps> = ({ price, isWishlisted, onPressBooking, onPressWishlist }) => {
    return (
        <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
            <View
                className="px-4 py-5 flex-row items-center justify-between"
            >
                <View className="flex-row items-center">
                    <TouchableOpacity 
                        onPress={onPressWishlist}
                        className="p-3 rounded-full border border-gray-200 bg-white active:bg-gray-100"
                    >
                        <Heart 
                            size={24} 
                            color={isWishlisted ? "#ef4444" : "#6b7280"} 
                            fill={isWishlisted ? "#ef4444" : "none"}     
                        />
                    </TouchableOpacity>
                    <View className="ml-4">
                        <Text className="text-gray-500 text-sm">Giá mỗi khách</Text>
                        <Text className="text-2xl font-bold text-[#08703f]">{price.toLocaleString('vi-VN')} ₫</Text>
                    </View>
                </View>
                <TouchableOpacity
                    className="py-3 px-5 rounded-full bg-[#08703f] shadow-md flex-row items-center active:bg-green-800"
                    onPress={onPressBooking}
                >
                    <Text className="text-white text-lg font-bold">Đặt ngay</Text>
                    <ChevronRight size={20} color="#fff" className="ml-1" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BookingFooter;
