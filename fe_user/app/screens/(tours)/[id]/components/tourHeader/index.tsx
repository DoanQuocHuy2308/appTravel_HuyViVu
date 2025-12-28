import React from 'react';
import { View, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '@/types/url';
export default function index({ images }: { images: string[] }) {
    return (
        <View className="h-[350px]">
            <Swiper autoplay={true} loop showsPagination={true}
                autoplayTimeout={3}
                dotStyle={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                activeDotStyle={{ backgroundColor: "#fff" }}
                paginationStyle={{ bottom: 15 }}
            >
                {images.map((imgUrl, index) => (
                    <View key={index} className="w-full h-full">
                        <Image source={{ uri: `${API_URL}${imgUrl}` }} className="w-full h-full" resizeMode="cover" />
                    </View>
                ))}
            </Swiper>
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                className="absolute bottom-0 left-0 right-0 h-1/3"
            />
        </View>
    );
};

