import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Settings,
  Gem,
  HandCoins,
  Building2,
  Headset,
  TicketPercent,
  CircleQuestionMark,
  Gift,
  ScanSearch,
  CircleStar,
  BookText,
  Handshake,
} from "lucide-react-native";
import { User } from "@/types";

export default function SettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const fetchUserData = async () => {
    const userDataString = await AsyncStorage.getItem("user");
    const userData = userDataString ? JSON.parse(userDataString) : null;
    setUser(userData?.user);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Chào buổi sáng";
    if (hour >= 12 && hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <SafeAreaView className="flex-1 bg-[#01681b]">
      <View className="bg-white absolute bottom-0 left-0 right-0 h-20" />
      <View className="px-5 pt-10 mb-5 rounded-b-3xl shadow-md">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="w-20 h-20 rounded-full overflow-hidden items-center justify-center bg-white">
              <Image
                source={require("@/assets/images/iconHuyViVu.png")}
                className="w-20 h-20"
              />
            </View>
            <View className="ml-4">
              <Text className="text-white text-sm">{getGreeting()}</Text>
              <Text className="text-white font-bold text-xl">
                {user?.name || "Quốc Huy Doãn"}
              </Text>
              <TouchableOpacity className="flex-row items-center mt-1" onPress={() => router.push("/screens/(profile)")}>
                <Text className="text-yellow-300 text-sm underline">
                  Quản lý tài khoản của tôi
                </Text>
                <Text className="text-yellow-300 text-xs ml-1">{">"}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/screens/(setting)")}
            className="p-2 rounded-full bg-white/10"
          >
            <Settings size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row justify-center items-center border border-gray-200 bg-white py-5 rounded-3xl mx-5">
        <View className="border-r w-[50%] border-gray-200 flex-col justify-center items-center">
          <Text className="text-gray-700 font-semibold text-base">
            Điểm đổi quà:
          </Text>
          <Text className="text-gray-900 font-bold text-lg mt-1">0</Text>
        </View>
        <View className="border-l w-[50%] border-gray-200 flex-col justify-center items-center">
          <Text className="text-gray-700 font-semibold text-base">
            Điểm vàng:
          </Text>
          <Text className="text-gray-900 font-bold text-lg mt-1">0</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 h-full bg-white px-5 py-5 mt-5 rounded-t-3xl"
        contentContainerStyle={{
          paddingBottom: 112, 
        }}
      >
        <View className="mt-6 flex-row justify-between">
          <TouchableOpacity className="flex-row items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 shadow-sm flex-1 mr-3">
            <Gem size={22} color="#38bdf8" />
            <View>
              <Text className="text-gray-800 font-semibold">Hạng</Text>
              <Text className="text-gray-500 text-sm">Xem thông tin</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 shadow-sm flex-1 ml-3">
            <HandCoins size={22} color="#38bdf8" />
            <View>
              <Text className="text-gray-800 font-semibold">0 Điểm</Text>
              <Text className="text-gray-500 text-sm">Điểm cần nâng hạng</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text className="text-black font-semibold text-xl my-4">
          Tiện ích của tôi
        </Text>

        <View className="flex-row h-[100px] border border-gray-200 rounded-2xl overflow-hidden">
          <TouchableOpacity
            className="flex-1 items-center justify-center px-4 py-3 border-r border-gray-200"
            onPress={() => router.push("/(tabs)")}
          >
            <TicketPercent size={24} color="#f086ac" />
            <Text className="text-gray-800 text-sm font-semibold mt-2">
              Voucher của tôi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 items-center justify-center px-4 py-3"
            onPress={() => router.push("/(tabs)")}
          >
            <Gift size={24} color="#e4b99e" />
            <Text className="text-gray-800 text-sm font-semibold mt-2">
              Đổi quà
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row mt-5 h-[100px] border border-gray-200 rounded-2xl overflow-hidden">
          <TouchableOpacity
            className="flex-1 items-center justify-center px-4 py-3 border-r border-gray-200"
            onPress={() => router.push("/(tabs)")}
          >
            <View className="w-12 h-12 rounded-full bg-[#01681b] items-center justify-center mb-2">
              <Ionicons name="calendar-outline" size={22} color="#fff" />
            </View>
            <Text className="text-gray-800 text-sm font-semibold">
              Booking của tôi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 items-center justify-center px-4 py-3"
            onPress={() => router.push("/(tabs)")}
          >
            <View className="w-12 h-12 rounded-full bg-[#01681b] items-center justify-center mb-2">
              <ScanSearch size={22} color="#fff" />
            </View>
            <Text className="text-gray-800 text-sm font-semibold">
              Tra cứu booking
            </Text>
          </TouchableOpacity>
        </View>
        <Text className="text-black font-semibold text-xl my-4">Điểm thưởng</Text>
        <View className="flex-row flex-wrap border border-gray-200 rounded-2xl">
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-r border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
          >
            <Ionicons name="car-sport" size={25} color="#38bdf8" />
            <Text className="text-gray-800 text-sm text-center font-semibold mt-2">
              Lịch sử đi tour
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-r border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
          >
            <Ionicons name="gift" size={25} color="#feb76c" />
            <Text className="text-gray-800 text-sm text-center font-semibold mt-2">
              Lịch sử đổi quà
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
          >
            <CircleStar size={24} color="#01681b" />
            <Text className="text-gray-800 text-sm text-center font-semibold mt-2">
              Lịch sử điểm
            </Text>
          </TouchableOpacity>
        </View>
        <Text className="text-black font-semibold text-xl my-4">
          Hỗ trợ & pháp lý
        </Text>
        <View className="flex-row flex-wrap border border-gray-200 rounded-2xl">
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-r border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
          >
            <BookText size={25} color="#feb76c" />
            <Text className="text-gray-800 text-sm text-center font-semibold mt-2">
              Chính sách riêng tư
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-r border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
          >
            <CircleQuestionMark size={25} color="#f086ac" />
            <Text className="text-gray-800 text-sm text-center font-semibold mt-2">
              Câu hỏi{"\n"}thường gặp
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
          >
            <Handshake size={24} color="#8eb5cd" />
            <Text className="text-gray-800 text-sm text-center font-semibold mt-2">
              Thỏa thuận{"\n"}sử dụng
            </Text>
          </TouchableOpacity>
        </View>
        <Text className="text-black font-semibold text-xl my-4">Thông tin thêm</Text>
        <View className="flex-row mb-20 border border-gray-200 rounded-2xl">
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-r border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
          >
            <View className="w-12 h-12 border border-gray-200 rounded-full bg-[#01681b] items-center justify-center overflow-hidden">
              <Image className="w-full h-full" source={require("@/assets/images/iconHuyViVu.png")} />
            </View>
            <Text className="text-gray-800 text-sm text-center font-semibold mt-2">
              Giới thiệu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-r border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
          >
            <Headset size={25} color="#56bfe6" />
            <Text className="text-gray-800 text-sm text-center font-semibold mt-2">
              Liên hệ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
          >
            <Building2 size={24} color="#f086ac" />
            <Text className="text-gray-800 text-sm text-center font-semibold mt-2">
              Văn phòng
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
