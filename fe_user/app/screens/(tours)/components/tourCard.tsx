import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Tour } from '@/data/tour';
import { MapPin, Clock, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

interface TourCardProps {
    tour: Tour;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
    const router = useRouter();

    return (
        <TouchableOpacity 
            onPress={() => router.push('/screens/(tours)/[id]')}
            className="mb-6 bg-white rounded-2xl shadow-lg overflow-hidden"
        >
            <View className="h-52">
                <Image source={{ uri: tour.image }} className="w-full h-full" />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    className="absolute bottom-0 left-0 right-0 h-2/3"
                />
                <View className="absolute top-3 right-3 flex-row items-center bg-white/90 px-2 py-1 rounded-full">
                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                    <Text className="ml-1 text-sm font-bold text-gray-800">{tour.rating}</Text>
                </View>

                 <View className="absolute bottom-3 left-4">
                    <Text className="text-white text-xl font-bold" numberOfLines={2}>{tour.title}</Text>
                    <View className="flex-row items-center mt-1">
                        <MapPin size={14} color="#fff" />
                        <Text className="text-white text-sm ml-1.5">{tour.location}</Text>
                    </View>
                </View>
            </View>
            <View className="p-4 flex-row justify-between items-center">
                <View>
                    <Text className="text-gray-500 text-sm">Thời gian</Text>
                    <Text className="text-gray-800 font-semibold">{tour.duration}</Text>
                </View>
                <View className="items-end">
                    <Text className="text-gray-500 text-sm">Giá chỉ từ</Text>
                    <Text className="text-[#08703f] text-lg font-bold">{tour.price}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default TourCard;
