import React from 'react';
import { View, Text, SectionList } from 'react-native';
import { ItineraryDay } from '@/types/tourType';

interface ItineraryTabProps {
    data: ItineraryDay[];
}

const ItineraryTab: React.FC<ItineraryTabProps> = ({ data }) => (
    <SectionList
        sections={data}
        keyExtractor={(item, index) => item.time + index}
        scrollEnabled={false}
        renderSectionHeader={({ section: { day, title } }) => (
            <View className="mb-4 mt-2">
                <Text className="text-xl font-bold text-gray-800">{day}: {title}</Text>
                <View className="h-0.5 bg-gray-200 mt-2" />
            </View>
        )}
        renderItem={({ item, index, section }) => (
            <View className="flex-row mb-4">
                <View className="items-center mr-4">
                    <View className="w-4 h-4 rounded-full bg-[#08703f] border-2 border-white shadow" />
                    {index < section.data.length - 1 && <View className="w-0.5 flex-1 bg-gray-300" />}
                </View>
                <View className="flex-1 pb-4">
                    <Text className="text-base font-semibold text-[#08703f]">{item.time}</Text>
                    <Text className="text-base text-gray-600 mt-1">{item.activity}</Text>
                </View>
            </View>
        )}
    />
);

export default ItineraryTab;
