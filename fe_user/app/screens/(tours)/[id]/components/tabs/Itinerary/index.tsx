import React, { useState } from "react";
import { View, Text, TouchableOpacity, LayoutAnimation, UIManager, Platform, ScrollView } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TimelineAccordion({ data }: { data: any[] }) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <ScrollView className="flex-1 bg-gray-50 p-4" showsVerticalScrollIndicator={false}>
            {data.map((item, index) => {
                const isExpanded = expandedIndex === index;
                return (
                    <View key={index} className="flex-row items-start mb-6">
                        <View className="w-8 items-center">
                            <View className="w-4 h-4 bg-emerald-500 rounded-full mt-1" />
                            {index < data.length - 1 && <View className="w-0.5 bg-gray-300 flex-1 mt-1" />}
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => toggleExpand(index)}
                            className={`flex-1 bg-white p-4 rounded-2xl shadow-md ml-3 border ${isExpanded ? "border-emerald-400" : "border-transparent"
                                }`}
                        >
                            <View className="flex-row justify-between items-center">
                                <View className="flex-1 pr-2">
                                    <Text className="text-sm text-emerald-700 font-bold mb-1">
                                        Ngày {item.day_number}
                                    </Text>
                                    <Text className="text-base font-semibold text-gray-900">
                                        Địa điểm: {item.title}
                                    </Text>
                                </View>
                                {isExpanded ? (
                                    <ChevronUp size={20} color="#065f46" />
                                ) : (
                                    <ChevronDown size={20} color="#065f46" />
                                )}
                            </View>
                            {isExpanded && (
                                <View className="mt-3 border-t border-gray-200 pt-3">
                                    <Text className="text-gray-700 leading-6 text-sm">
                                        {item.description}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                );
            })}
        </ScrollView>
    );
}
