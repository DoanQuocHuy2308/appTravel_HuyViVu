import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

interface CategoryNavbarProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

const CategoryNavbar: React.FC<CategoryNavbarProps> = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 12 }}
            >
                {categories.map((category, index) => {
                    const isSelected = selectedCategory === category;
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => onSelectCategory(category)}
                            className={`px-4 py-2 rounded-full border ${isSelected ? 'bg-[#08703f] border-[#08703f]' : 'bg-white border-gray-300'}`}
                        >
                            <Text className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default CategoryNavbar;
