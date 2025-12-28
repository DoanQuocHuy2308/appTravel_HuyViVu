import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTours } from '@/hooks/useTour';
import useLocation from '@/hooks/useLocation';
import CategoryNavbar from './components/categoryNabar';
import TourCard from './components/tourCard';
import Back from "@/components/back";
import { useLocalSearchParams } from 'expo-router';

export default function ToursListScreen() {
    const { title } = useLocalSearchParams();
    const { tours} = useTours();
    const { locations } = useLocation();
    const [selected, setSelected] = useState(0);
    const newlocations = useMemo(() => {
        return [
            { id: 0, name: "Tất cả", created_at: new Date().toISOString() },
            ...locations,
        ];
    }, [locations]);
    const filteredTours = selected === 0 ? tours : tours.filter(tour => tour.location_id === selected);
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <Back />
            <View className="px-4 ">
                <Text className="text-3xl font-bold text-gray-800">{!title ? "Danh sách tour" : title}</Text>
                <Text className="text-base text-gray-500 mt-1">Tìm kiếm hành trình mơ ước của bạn</Text>
            </View>

            <CategoryNavbar
                location={newlocations}
                selectedLocation={selected}
                onSelectLocation={setSelected}  
            />

            <ScrollView className="px-4 py-4">
                {filteredTours?.map((item, index) => (
                    <TourCard key={item.id || index} tour={item} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
