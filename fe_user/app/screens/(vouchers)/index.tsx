import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Swiper from "react-native-swiper";
import Back from "@/components/back";

const vouchers = [
  { id: 1, title: "Giảm 20% đơn hàng", code: "SALE20", expiry: "HSD: 30/09/2025" },
  { id: 2, title: "Freeship toàn quốc", code: "SHIPFREE", expiry: "HSD: 15/10/2025" },
  { id: 3, title: "Giảm 50K cho đơn từ 500K", code: "DISCOUNT50", expiry: "HSD: 31/12/2025" },
];

const banner = [
  { id: 1, img: { uri: "https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/10_2019/ngay-hoi-khuyen-mai-du-lich-khuyen-mai-gia-tour-len-den-45-chi-con-tu-650.000vnd.jpg" } },
  { id: 2, img: { uri: "https://media.vietravel.com/images/news/KV-Thu_Pc-960x640px.jpg" } },
  { id: 3, img: { uri: "https://media.vietravel.com/images/news/KM-NgayHoi_ThaiLan_960x640px.jpg" } },
  { id: 4, img: { uri: "https://media.vietravel.com/images/news/960-x-640-v2.png" } },
];

export default function VoucherScreen() {
  const router = useRouter();

  const saveVoucher = (voucher: string) => {
    alert(`Bạn đã chọn voucher: ${voucher}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-3 py-3 border-b border-gray-200 bg-[#f9f9f9] shadow-sm">
        <Back />
        <Text className="flex-1 text-center text-2xl font-semibold text-[#318b89]">
          🎁 Voucher
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1">
        <View className="h-[180px] mt-3">
          <Swiper loop autoplay autoplayTimeout={3} showsPagination={true}>
            {banner.map((item) => (
              <View key={item.id} className="px-3">
                <Image
                  source={item.img}
                  className="w-full h-44 rounded-2xl shadow-md"
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>
        </View>
        <View className="mt-5 px-4">
          {vouchers.map((item) => (
            <View
              key={item.id}
              className="bg-[#f0fdfa] border border-[#0f766e] rounded-2xl p-5 mb-5 shadow-md"
            >
              <View className="flex-row items-center mb-3">
                <Ionicons name="gift-outline" size={22} color="#0f766e" />
                <Text className="ml-2 text-lg font-bold text-[#065f46]">
                  {item.title}
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="pricetag-outline" size={20} color="#14b8a6" />
                <Text className="ml-2 text-base font-semibold text-[#065f46]">
                  Mã: {item.code}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={18} color="#6b7280" />
                <Text className="ml-2 text-sm text-gray-500">{item.expiry}</Text>
              </View>
              <TouchableOpacity
                className="mt-5 flex-row items-center justify-center bg-[#065f46] rounded-full py-3 active:opacity-80 shadow-md"
                onPress={() => saveVoucher(item.code)}
              >
                <Text className="text-white font-semibold text-base mr-2">
                  Dùng ngay
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
