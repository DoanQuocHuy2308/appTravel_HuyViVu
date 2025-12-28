import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { newTour } from '@/types';
import { MapPin, Clock, Star, Hash, User, Users, Bus, Navigation, Flag, ArrowRight, Circle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Swiper from 'react-native-swiper';
import { API_URL } from '@/types/url';

export default function TourCard({ tour }: { tour: newTour }) {
    const router = useRouter();

    const startDate = tour.start_date
        ? new Date(tour.start_date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
        : 'Chưa có';

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
                router.push({
                    pathname: '/screens/(tours)/[id]',
                    params: { id: tour.id },
                })
            }
            className="mb-6 bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100"
        >
            {/* ========== ẢNH TOUR ========== */}
            <View className="h-56 relative">
                <Swiper
                    autoplay
                    autoplayTimeout={3}
                    loop
                    showsPagination={true}
                    dotColor="rgba(255,255,255,0.4)"
                    activeDotColor="#10b981"
                    dotStyle={{ width: 6, height: 6, borderRadius: 3, marginHorizontal: 2 }}
                >
                    {(tour.images?.length ? tour.images : [
                        'https://cdn.pixabay.com/photo/2016/11/29/04/08/beach-1867271_1280.jpg'
                    ]).map((image: string, index: number) => (
                        <Image
                            key={index}
                            source={{ uri: `${API_URL}${image}` }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ))}
                </Swiper>

                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                    className="absolute bottom-0 left-0 right-0 h-2/3"
                />

                <View className="absolute top-3 right-3 flex-row items-center bg-white/95 px-2.5 py-1 rounded-full shadow-sm">
                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                    <Text className="ml-1 text-sm font-semibold text-gray-800">
                        {tour.rating || '5.0'}
                    </Text>
                </View>

                <View className="absolute bottom-4 left-4 right-4">
                    <Text
                        className="text-white text-xl font-extrabold drop-shadow-lg"
                        numberOfLines={2}
                    >
                        {tour.name}
                    </Text>

                    <View className="flex-row flex-wrap items-center gap-2 mt-1">
                        <View className="flex-row items-center">
                            <MapPin size={14} color="#fff" />
                            <Text className="text-white text-sm ml-1.5 opacity-90">
                                {tour.city || 'Đang cập nhật'}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Hash size={14} color="#fff" />
                            <Text className="text-white text-sm ml-1.5 opacity-90">
                                {tour.name_type || 'Nghỉ dưỡng'}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <User size={14} color="#fff" />
                            <Text className="text-white text-sm ml-1.5 opacity-90">
                                {tour.suitable_for || 'Gia đình, bạn bè'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="border-t border-gray-100 bg-emerald-50">
                <View className="flex-row items-center justify-between px-6 py-3">
                    <View className="flex-row mr-2 items-center">
                        <View className="bg-emerald-100 p-1.5 rounded-full">
                            <MapPin size={16} color="#047857" />
                        </View>
                        <Text className="ml-2 text-emerald-700 text-sm font-semibold">
                            {tour.start_location || "Điểm đi"}
                        </Text>
                    </View>
                    <Circle size={12} color="#E53935" fill="#E53935" />
                    <View className="flex-1 mx-1 border-t border-dashed border-gray-400" />
                    <Circle size={12} color="#08703f" fill="#08703f" />
                    <View className="flex-row ml-2 items-center">
                        <View className="bg-orange-100 p-1.5 rounded-full">
                            <Flag size={16} color="#ea580c" />
                        </View>
                        <Text className="ml-2 text-orange-700 text-sm font-semibold">
                            {tour.end_location || "Điểm đến"}
                        </Text>
                    </View>
                </View>
            </View>
            <View className="px-5 py-3 flex-row justify-between items-start bg-white">
                <View className="flex-1">
                    <InfoRow icon={<Clock size={14} color="#6b7280" />} label="Ngày đi" value={startDate} />
                    <InfoRow icon={<Clock size={14} color="#6b7280" />} label="Thời gian lý tưởng" value={tour.ideal_time || 'Quanh năm'} />
                    <InfoRow icon={<Bus size={14} color="#6b7280" />} label="Di chuyển" value={tour.transportation || 'Xe du lịch đời mới'} />
                    <InfoRow icon={<Users size={14} color="#6b7280" />} label="Số chỗ còn lại" value={`${tour.max_customers || '—'} khách`} />
                </View>

                <View className="items-end mt-1">
                    <Text className="text-gray-500 text-sm mb-0.5">Giá chỉ từ</Text>
                    <Text className="text-[#08703f] text-xl font-extrabold">
                        {Number(tour.price).toLocaleString('vi-VN')} ₫
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const InfoRow = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) => (
    <View className="flex-row items-center mt-1.5">
        <View className="mr-2">{icon}</View>
        <Text className="text-gray-500 text-xs">{label}:</Text>
        <Text className="ml-1 text-gray-900 font-semibold text-xs">{value}</Text>
    </View>
);
