import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface Tab {
    id: number;
    name: string;
    icon: React.ElementType;
}

interface TourTabsProps {
    tabs: Tab[];
    activeTab: number;
    onTabPress: (id: number) => void;
}

const TourTabs: React.FC<TourTabsProps> = ({ tabs, activeTab, onTabPress }) => {
    return (
        <View className="flex-row border-t border-b border-gray-200 bg-white shadow-sm mt-1 sticky top-0 z-10">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <TouchableOpacity
                        key={tab.id}
                        className={`flex-1 items-center py-4 border-b-2 ${isActive ? "border-[#08703f]" : "border-transparent"}`}
                        onPress={() => onTabPress(tab.id)}
                    >
                        <Icon size={22} color={isActive ? "#08703f" : "#6b7280"} />
                        <Text className={`mt-1 text-sm ${isActive ? "text-[#08703f] font-semibold" : "text-gray-500"}`}>
                            {tab.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default TourTabs;
