import React, { useState, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TOURS_DATA } from '@/data/tour';
import CategoryNavbar from './components/categoryNabar';
import TourCard from './components/tourCard';
import Back from "@/components/back";
export default function ToursListScreen() {
    const tourCategories = useMemo(() => {
        const locations = new Set(TOURS_DATA.map(tour => tour.location));
        return ['Tất cả', ...Array.from(locations)];
    }, []);
    const [selectedCategory, setSelectedCategory] = useState(tourCategories[0]);
    const filteredTours = useMemo(() => {
        if (selectedCategory === 'Tất cả') {
            return TOURS_DATA;
        }
        return TOURS_DATA.filter(tour => tour.location === selectedCategory);
    }, [selectedCategory]);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <Back />
            <View className="px-4 ">
                <Text className="text-3xl font-bold text-gray-800">Khám Phá Tour</Text>
                <Text className="text-base text-gray-500 mt-1">Tìm kiếm hành trình mơ ước của bạn</Text>
            </View>

            <CategoryNavbar
                categories={tourCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <FlatList
                data={filteredTours}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <TourCard tour={item} />}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center mt-20">
                        <Text className="text-lg text-gray-500">Không tìm thấy tour nào.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
