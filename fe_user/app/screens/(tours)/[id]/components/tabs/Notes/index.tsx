import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Info } from 'lucide-react-native';
import { TourNote } from '@/types';
interface NotesTabProps {
  data: TourNote[];
}

const NotesTab: React.FC<NotesTabProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-gray-50">
        <Text className="text-lg text-gray-400">
          Không có ghi chú nào cho tour này.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 " showsVerticalScrollIndicator={false}>
      {data.map((note, index) => (
        <View
          key={index}
          className="bg-white p-3 rounded-2xl shadow-md mb-2 border border-gray-200"
        >
          <View className="flex-row gap-2 items-center mb-2">
            <Info size={20} color="#10b981" className="mr-2" />
            <Text className="text-lg font-bold text-emerald-700">{note.title}</Text>
          </View>
          <Text className="text-gray-700 text-base leading-6">{note.note}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default NotesTab;
