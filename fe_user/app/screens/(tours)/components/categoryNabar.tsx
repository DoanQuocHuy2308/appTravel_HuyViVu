import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Location } from '@/types';
interface LocationProps{
    location: Location[];
    selectedLocation: number;
    onSelectLocation: (id: number) => void;
}
const CategoryNavbar: React.FC<LocationProps> = ({ location, selectedLocation, onSelectLocation }) => {
    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 12 }}
            >
                {location?.map((item, index) => {
                    const isSelected = selectedLocation === item.id;
                    return (
                        <TouchableOpacity
                            key={item.id || index}
                            onPress={() => onSelectLocation(item.id)}
                            className={`px-4 py-2 rounded-full border ${isSelected ? 'bg-[#08703f] border-[#08703f]' : 'bg-white border-gray-300'}`}
                        >
                            <Text className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};


export default CategoryNavbar;
