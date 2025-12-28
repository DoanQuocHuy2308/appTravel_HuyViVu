import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Calendar, MapPin, Plane, Car, Building, RotateCcw, Plus, Minus } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "@/components/header";
import { useContext } from "react";
import { ToastContext } from "@/contexts/ToastContext";   
export default function ComboBooking() {
  const router = useRouter();
  const { showToast } = useContext(ToastContext);
  const { title } = useLocalSearchParams();
  const [comboType, setComboType] = useState("flight-hotel"); 
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [toddlers, setToddlers] = useState(0);
  const [infants, setInfants] = useState(0);

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
      "tháng 1", "tháng 2", "tháng 3", "tháng 4", "tháng 5", "tháng 6",
      "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12",
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setSelectedDate(selectedDate);
  };

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    showToast('success', 'Tìm kiếm combo thành công');
    router.push('/screens/(booking)');
  };

  const updateGuestCount = (type: string, delta: number) => {
    switch (type) {
      case "adults":
        setAdults(Math.max(1, adults + delta)); 
        break;
      case "children":
        setChildren(Math.max(0, children + delta));
        break;
      case "toddlers":
        setToddlers(Math.max(0, toddlers + delta));
        break;
      case "infants":
        setInfants(Math.max(0, infants + delta));
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={title as string || "COMBO"} />

      <ScrollView className="flex-1 px-5 py-4">
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <View className="mb-6">
            <View className="flex-row bg-gray-100 rounded-xl p-1">
              <TouchableOpacity
                className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-lg ${
                  comboType === "flight-hotel" ? "bg-blue-500" : "bg-transparent"
                }`}
                onPress={() => setComboType("flight-hotel")}
              >
                <View className="items-center">
                  <View className={`w-8 h-8 rounded-lg items-center justify-center mb-1 ${
                    comboType === "flight-hotel" ? "bg-white" : "bg-blue-500"
                  }`}>
                    <Plane size={16} color={comboType === "flight-hotel" ? "#3B82F6" : "white"} />
                  </View>
                  <View className={`w-8 h-8 rounded-lg items-center justify-center ${
                    comboType === "flight-hotel" ? "bg-white" : "bg-blue-500"
                  }`}>
                    <Building size={16} color={comboType === "flight-hotel" ? "#3B82F6" : "white"} />
                  </View>
                </View>
                <Text className={`ml-2 text-sm font-medium ${
                  comboType === "flight-hotel" ? "text-white" : "text-gray-600"
                }`}>
                  Vé máy bay + khách sạn
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-lg ${
                  comboType === "car-hotel" ? "bg-blue-500" : "bg-transparent"
                }`}
                onPress={() => setComboType("car-hotel")}
              >
                <View className="items-center">
                  <View className={`w-8 h-8 rounded-lg items-center justify-center mb-1 ${
                    comboType === "car-hotel" ? "bg-white" : "bg-gray-400"
                  }`}>
                    <Car size={16} color={comboType === "car-hotel" ? "#3B82F6" : "white"} />
                  </View>
                  <View className={`w-8 h-8 rounded-lg items-center justify-center ${
                    comboType === "car-hotel" ? "bg-white" : "bg-gray-400"
                  }`}>
                    <Building size={16} color={comboType === "car-hotel" ? "#3B82F6" : "white"} />
                  </View>
                </View>
                <Text className={`ml-2 text-sm font-medium ${
                  comboType === "car-hotel" ? "text-white" : "text-gray-600"
                }`}>
                  Xe + Khách sạn
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-6">
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">
                Từ <Text className="text-red-500">*</Text>
              </Text>
              <View className="relative bg-gray-50 border border-gray-200 rounded-xl">
                <TextInput
                  className="p-4 pr-12 text-gray-800 text-base"
                  placeholder="Thành phố, sân bay"
                  placeholderTextColor="#9ca3af"
                  value={origin}
                  onChangeText={setOrigin}
                />
                <View className="absolute top-4 right-4">
                  <MapPin size={20} color="#9ca3af" />
                </View>
              </View>
            </View>

            <View className="items-center mb-4">
              <TouchableOpacity
                className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center"
                onPress={swapLocations}
              >
                <RotateCcw size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">
                Đến
              </Text>
              <View className="relative bg-gray-50 border border-gray-200 rounded-xl">
                <TextInput
                  className="p-4 pr-12 text-gray-800 text-base"
                  placeholder="Thành phố, sân bay"
                  placeholderTextColor="#9ca3af"
                  value={destination}
                  onChangeText={setDestination}
                />
                <View className="absolute top-4 right-4">
                  <MapPin size={20} color="#9ca3af" />
                </View>
              </View>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-2">
              Ngày đi
            </Text>
            <TouchableOpacity
              className="relative bg-gray-50 border border-gray-200 rounded-xl"
              onPress={() => setShowDatePicker(true)}
            >
              <View className="p-4 pr-12">
                <Text className="text-gray-800 text-base">
                  {formatDateToVietnamese(selectedDate)}
                </Text>
              </View>
              <View className="absolute top-4 right-4">
                <Calendar size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-4">
              Số khách
            </Text>

            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-base font-medium text-gray-800">Người lớn</Text>
                <Text className="text-sm text-gray-500">Từ 12 tuổi trở lên</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                  onPress={() => updateGuestCount("adults", -1)}
                >
                  <Minus size={16} color="#666" />
                </TouchableOpacity>
                <Text className="mx-4 text-lg font-medium text-gray-800">{adults}</Text>
                <TouchableOpacity
                  className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
                  onPress={() => updateGuestCount("adults", 1)}
                >
                  <Plus size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-base font-medium text-gray-800">Trẻ em</Text>
                <Text className="text-sm text-gray-500">Từ 5 – 11 tuổi</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                  onPress={() => updateGuestCount("children", -1)}
                >
                  <Minus size={16} color="#666" />
                </TouchableOpacity>
                <Text className="mx-4 text-lg font-medium text-gray-800">{children}</Text>
                <TouchableOpacity
                  className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
                  onPress={() => updateGuestCount("children", 1)}
                >
                  <Plus size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-base font-medium text-gray-800">Trẻ nhỏ</Text>
                <Text className="text-sm text-gray-500">Từ 2 - 4 tuổi</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                  onPress={() => updateGuestCount("toddlers", -1)}
                >
                  <Minus size={16} color="#666" />
                </TouchableOpacity>
                <Text className="mx-4 text-lg font-medium text-gray-800">{toddlers}</Text>
                <TouchableOpacity
                  className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
                  onPress={() => updateGuestCount("toddlers", 1)}
                >
                  <Plus size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-base font-medium text-gray-800">Em bé</Text>
                <Text className="text-sm text-gray-500">Dưới 2 tuổi</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
                  onPress={() => updateGuestCount("infants", -1)}
                >
                  <Minus size={16} color="#666" />
                </TouchableOpacity>
                <Text className="mx-4 text-lg font-medium text-gray-800">{infants}</Text>
                <TouchableOpacity
                  className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
                  onPress={() => updateGuestCount("infants", 1)}
                >
                  <Plus size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Search Button */}
      <View className="px-5 pb-6">
        <TouchableOpacity
          className="bg-gray-300 rounded-xl py-4 items-center"
          onPress={handleSearch}
        >
          <Text className="text-gray-800 text-lg font-medium">
            Tìm kiếm
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
}
