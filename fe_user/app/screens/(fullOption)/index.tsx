import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Calendar, MapPin, DollarSign } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "@/components/header";

export default function ComboTourBooking() {
  const router = useRouter();
  const { title } = useLocalSearchParams();
  const [destination, setDestination] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [budget, setBudget] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const budgetOptions = [
    { label: "Dưới 2,000,000 VNĐ", value: "0-2000000" },
    { label: "2,000,000 - 5,000,000 VNĐ", value: "2000000-5000000" },
    { label: "5,000,000 - 10,000,000 VNĐ", value: "5000000-10000000" },
    { label: "10,000,000 - 20,000,000 VNĐ", value: "10000000-20000000" },
    { label: "Trên 20,000,000 VNĐ", value: "20000000+" },
  ];

  const formatDateToVietnamese = (date: Date) => {
    const days = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    const months = [
      "tháng 1",
      "tháng 2",
      "tháng 3",
      "tháng 4",
      "tháng 5",
      "tháng 6",
      "tháng 7",
      "tháng 8",
      "tháng 9",
      "tháng 10",
      "tháng 11",
      "tháng 12",
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${
      months[date.getMonth()]
    }, ${date.getFullYear()}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setSelectedDate(selectedDate);
  };

  const handleSearch = () => {
    console.log("Tìm kiếm tour:", {
      destination,
      selectedDate: formatDateToVietnamese(selectedDate),
      budget,
    });
  };


  return (
    <SafeAreaView className="flex-1 bg-[#f8f9fa]">
      <Header title={title as string || "TOUR TRỌN GÓI"} />

      <ScrollView className="flex-1 px-5 py-6">
        <View className="mb-7">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Bạn muốn đi đâu? <Text className="text-red-500">*</Text>
          </Text>
          <View className="relative bg-white border border-gray-200 rounded-2xl shadow-sm">
            <TextInput
              className="p-4 pr-12 text-gray-800 text-base"
              placeholder="Nhập điểm đến mơ ước của bạn..."
              placeholderTextColor="#9ca3af"
              value={destination}
              onChangeText={setDestination}
            />
            <View className="absolute top-4 right-4">
              <MapPin size={22} color="#08703f" />
            </View>
          </View>
        </View>

        <View className="mb-7">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Ngày khởi hành
          </Text>
          <TouchableOpacity
            className="relative bg-white border border-gray-200 rounded-2xl shadow-sm"
            onPress={() => setShowDatePicker(true)}
          >
            <View className="p-4 pr-12">
              <Text className="text-[#08703f] text-base font-medium">
                {formatDateToVietnamese(selectedDate)}
              </Text>
            </View>
            <View className="absolute top-4 right-4">
              <Calendar size={22} color="#08703f" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="mb-10">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Ngân sách dự kiến
          </Text>
          <TouchableOpacity 
            className="relative bg-white border border-gray-200 rounded-2xl shadow-sm"
            onPress={() => setShowBudgetModal(true)}
          >
            <View className="p-4 pr-12">
              <Text className={`text-base ${budget ? 'text-[#08703f]' : 'text-[#9ca3af]'}`}>
                {budget ? budgetOptions.find(opt => opt.value === budget)?.label : "Chọn mức giá phù hợp"}
              </Text>
            </View>
            <View className="absolute top-4 right-4">
              <DollarSign size={22} color="#08703f" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View className="px-5 pb-8">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSearch}
          className="rounded-2xl py-4 items-center shadow-md"
          style={{
            backgroundColor: "#08703f",
            shadowColor: "#08703f",
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 4,
          }}
        >
          <Text className="text-white text-lg font-semibold tracking-wide">
            🔍 Tìm kiếm tour
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      <Modal
        visible={showBudgetModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBudgetModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
              Chọn mức giá
            </Text>
            <FlatList
              data={budgetOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-4 px-4 border-b border-gray-100"
                  onPress={() => {
                    setBudget(item.value);
                    setShowBudgetModal(false);
                  }}
                >
                  <Text className={`text-base ${budget === item.value ? 'text-[#08703f] font-semibold' : 'text-gray-700'}`}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              className="mt-4 py-3 px-4 bg-gray-200 rounded-xl"
              onPress={() => setShowBudgetModal(false)}
            >
              <Text className="text-center text-gray-600 font-medium">Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
