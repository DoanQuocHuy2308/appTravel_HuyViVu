import React from 'react';
import { View, Text } from 'react-native';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { Tour } from '@/types/tourType';

type OverviewData = Pick<Tour, 'description' | 'highlights' | 'includes' | 'excludes'>;

interface OverviewTabProps {
    data: OverviewData;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ data }) => (
    <View className="space-y-6">
        <View>
            <Text className="text-xl font-bold text-gray-800 mb-2">Tổng quan</Text>
            <Text className="text-base text-gray-600 leading-6">{data.description}</Text>
        </View>
        <View>
            <Text className="text-xl font-bold text-gray-800 mb-3">Điểm nổi bật</Text>
            <View className="space-y-3">
                {data.highlights.map((item, index) => (
                    <View key={index} className="flex-row items-start">
                        <CheckCircle2 size={18} color="#08703f" className="mt-1 mr-3" />
                        <Text className="text-base text-gray-600 flex-1">{item}</Text>
                    </View>
                ))}
            </View>
        </View>
        <View className="flex-row space-x-4">
            <View className="flex-1 space-y-3">
                <Text className="text-lg font-semibold text-gray-800">Bao gồm</Text>
                {data.includes.map((item, index) => (
                    <View key={index} className="flex-row items-start">
                        <CheckCircle2 size={16} color="#22c55e" className="mt-1 mr-2" />
                        <Text className="text-base text-gray-600 flex-1">{item}</Text>
                    </View>
                ))}
            </View>
            <View className="flex-1 space-y-3">
                <Text className="text-lg font-semibold text-gray-800">Không bao gồm</Text>
                {data.excludes.map((item, index) => (
                    <View key={index} className="flex-row items-start">
                        <XCircle size={16} color="#ef4444" className="mt-1 mr-2" />
                        <Text className="text-base text-gray-600 flex-1">{item}</Text>
                    </View>
                ))}
            </View>
        </View>
    </View>
);

export default OverviewTab;
