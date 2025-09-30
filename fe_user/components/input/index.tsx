import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface FormInputProps extends TextInputProps {
    label: string;
    icon: LucideIcon;
}

const FormInput: React.FC<FormInputProps> = ({ label, icon: Icon, ...props }) => {
    return (
        <View className="mb-4">
            <Text className="text-base text-gray-600 font-semibold mb-2">{label}</Text>
            <View className="flex-row items-center bg-gray-100 p-3 rounded-lg border border-gray-200">
                <Icon size={20} color="#6b7280" />
                <TextInput
                    className="flex-1 ml-3 text-base text-gray-800"
                    placeholderTextColor="#9ca3af"
                    {...props}
                />
            </View>
        </View>
    );
};

export default FormInput;
