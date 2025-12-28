import React from 'react';
import { View, Text } from 'react-native';
import { MapPin, Clock, Star, User } from 'lucide-react-native';
import { newTour } from '@/types';

export default function index({ tour }: { tour: newTour  }) {
    if (!tour) {
        return (
            <View className="bg-white p-6 rounded-t-3xl -mt-10">
                <Text className="text-2xl font-bold text-gray-400">Đang tải thông tin tour...</Text>
            </View>
        );
    }

    return (
        <View className="bg-white p-6 rounded-t-3xl -mt-10 shadow-2xl shadow-black">
            <View className="pb-4 border-b border-gray-200">
                <Text className="text-2xl font-bold text-gray-900 tracking-tight leading-snug">{tour.name}</Text>
                
                <View className="flex-row items-center mt-4 gap-x-5">
                    <View className="flex-row items-center">
                        <MapPin size={18} className="text-gray-500" />
                        <Text className="ml-2 text-base text-gray-700 font-medium">{tour.city}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Clock size={18} className="text-gray-500" />
                        <Text className="ml-2 text-base text-gray-700">{tour.duration_days}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <User size={18} className="text-gray-500" />
                        <Text className="ml-2 text-base text-gray-700">
                                {tour.suitable_for || 'Gia đình, bạn bè'}
                            </Text>
                        </View>
                </View>
            </View>
            <View className="flex-row justify-between items-center pt-4 mt-2">
                <View className="flex-col items-start">
                    <View className="flex-row items-center bg-blue-500 px-3 py-1.5 rounded-full">
                        <Star size={16} color="#fff" fill="#fff" />
                        <Text className="ml-2 text-lg font-bold text-white">{tour.rating}</Text>
                    </View>
                    <Text className="mt-2 text-sm text-gray-500">{tour.review_count} đánh giá</Text>
                </View>
                <View className="flex-col items-end">
                    <Text className="text-3xl font-extrabold text-green-600">
                        {Number(tour.price).toLocaleString('vi-VN')} ₫
                    </Text>
                    <Text className="text-sm text-gray-500 -mt-1">/ người</Text>
                </View>
            </View>
        </View>
    );
};

