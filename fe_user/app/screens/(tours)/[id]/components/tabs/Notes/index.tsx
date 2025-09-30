import React from 'react';
import { View, Text } from 'react-native';
import { Note } from '@/types/tourType';

interface NotesTabProps {
    data: Note[];
}

const NotesTab: React.FC<NotesTabProps> = ({ data }) => (
    <View className="space-y-5">
        {data.map((note, index) => (
            <View key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <Text className="text-lg font-bold text-blue-800 mb-2">{note.title}</Text>
                <Text className="text-base text-blue-700 leading-6">{note.content}</Text>
            </View>
        ))}
    </View>
);

export default NotesTab;
