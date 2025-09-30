import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
} from "react-native";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import Header from "@/components/header";
import { SafeAreaView } from "react-native-safe-area-context";
export default function App() {
    const [date, setDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [budget, setBudget] = useState<string | null>(null);

    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 bg-white">
                <Header title="Tour Trọn Gói" />
                <View className="p-4 space-y-6">
                    <View>
                        <Text className="font-semibold text-base text-black mb-1">
                            Bạn muốn đi đâu? <Text className="text-red-500">*</Text>
                        </Text>
                        <TextInput
                            placeholder="Khám phá cuộc phiêu lưu tiếp theo của bạn..."
                            className="border-b border-gray-300 pb-2 text-gray-500"
                        />
                    </View>
                    <View>
                        <Text className="font-semibold text-base text-black mb-1">
                            Ngày đi
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="border-b border-gray-300 pb-2"
                        >
                            <Text className="text-gray-600">{formatDate(date)}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                onChange={onChangeDate}
                            />
                        )}
                    </View>
                    <View>
                        <Text className="font-semibold text-base text-black mb-1">
                            Ngân sách
                        </Text>
                        <RNPickerSelect
                            onValueChange={(value: string) => setBudget(value)}
                            items={[
                                { label: "Dưới 5 triệu", value: "under5" },
                                { label: "5 - 10 triệu", value: "5to10" },
                                { label: "Trên 10 triệu", value: "over10" },
                            ]}
                            placeholder={{ label: "Chọn mức giá", value: null }}
                            style={{
                                inputIOS: {
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#ccc",
                                    paddingVertical: 8,
                                    color: budget ? "#000" : "#888",
                                },
                                inputAndroid: {
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#ccc",
                                    paddingVertical: 8,
                                    color: budget ? "#000" : "#888",
                                },
                            }}
                        />
                    </View>
                </View>

                <View className="px-4 py-6">
                    <TouchableOpacity className="bg-gray-200 py-3 rounded-full">
                        <Text className="text-center text-gray-600 font-semibold">
                            Tìm kiếm
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
