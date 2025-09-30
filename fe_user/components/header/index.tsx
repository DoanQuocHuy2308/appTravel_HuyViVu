import { View, Text } from "react-native";
import Back from "@/components/back";
type Props = {
    title: string
};
export default function index({ title }: Props) {
    return (
        <View className="flex-row items-center border-b border-gray-500">
            <Back />
            <View className="flex-1 items-center justify-center">
                <Text className="text-2xl font-semibold text-[#318b89]">{title}</Text>
            </View>
        </View>
    )
};
