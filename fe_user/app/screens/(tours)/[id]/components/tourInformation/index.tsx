import React from 'react';
import { View, Text } from 'react-native';
import { MapPin, Clock, Star } from 'lucide-react-native';

interface TourInformationProps {
    title: string;
    location: string;
    duration: string;
    rating: number;
    reviews: number;
}

const TourInformation: React.FC<TourInformationProps> = ({ title, location, duration, rating, reviews }) => {
    return (
        <View className="bg-white p-5 rounded-t-3xl -mt-8 z-10 shadow-lg">
            <Text className="text-3xl font-extrabold text-gray-800 tracking-tight">{title}</Text>
            <View className="flex-row items-center mt-3 space-x-4 text-gray-500">
                <View className="flex-row items-center">
                    <MapPin size={16} color="#6b7280" />
                    <Text className="ml-1.5 text-base text-gray-600">{location}</Text>
                </View>
                <View className="flex-row items-center">
                    <Clock size={16} color="#6b7280" />
                    <Text className="ml-1.5 text-base text-gray-600">{duration}</Text>
                </View>
            </View>
            <View className="flex-row items-center mt-3">
                <View className="flex-row items-center bg-yellow-400 px-2 py-1 rounded-full">
                    <Star size={16} color="#fff" fill="#fff" />
                    <Text className="ml-1.5 text-base font-bold text-white">{rating}</Text>
                </View>
                <Text className="ml-3 text-base text-gray-600">({reviews} đánh giá)</Text>
            </View>
        </View>
    );
};

export default TourInformation;
