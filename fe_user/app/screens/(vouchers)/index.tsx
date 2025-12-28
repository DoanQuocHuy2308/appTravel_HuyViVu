import React, { useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Swiper from "react-native-swiper";
import Back from "@/components/back";
import { usePromotions } from "@/hooks/usePromotions";
import  usePromotionsUser  from "@/hooks/usePromotionsUser";
import { ToastContext } from "@/contexts/ToastContext";
const banner = [
  {
    id: 1,
    img: {
      uri: "https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/10_2019/ngay-hoi-khuyen-mai-du-lich-khuyen-mai-gia-tour-len-den-45-chi-con-tu-650.000vnd.jpg",
    },
  },
  {
    id: 2,
    img: {
      uri: "https://media.vietravel.com/images/news/KV-Thu_Pc-960x640px.jpg",
    },
  },
  {
    id: 3,
    img: {
      uri: "https://media.vietravel.com/images/news/KM-NgayHoi_ThaiLan_960x640px.jpg",
    },
  },
  {
    id: 4,
    img: {
      uri: "https://media.vietravel.com/images/news/960-x-640-v2.png",
    },
  },
];

export default function VoucherScreen() {
  const router = useRouter();
  const { promotions, loading, getAllPromotions } = usePromotions();
  const { promotionsUser, createUserVoucher } = usePromotionsUser();
  const { showToast } = useContext(ToastContext);
  const saveVoucher = async (promotion_id: number) => {
    const success = await createUserVoucher(promotion_id);
    if (success) {
      showToast('success', 'Lưu voucher thành công!');
    } else {
      showToast('error', 'Có lỗi xảy ra khi lưu voucher');
    }
  };

  // Function format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const isActive = (status: string | undefined) => status === "active";
  
  const hasStock = (maxCount: number | undefined) => (maxCount && maxCount > 0 ? true : false);

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
        <View className="h-[200px] mt-3">
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
        <View className="px-4 mt-2">
          {promotions.map((item) => {
            // Kiểm tra voucher đã được user lưu chưa
            const userVoucher = promotionsUser.find((userItem) => userItem.promotion_id === item.id);
            const isSaved = !!userVoucher;
            const isUsed = userVoucher?.used || false;
            
            const active = isActive(item.status);
            const available = hasStock(item.max_count);
            // Nếu đã lưu voucher thì coi như đã sử dụng
            const disabled = isSaved || isUsed || !active || !available;

            return (
              <View
                key={item.id}
                className={`rounded-2xl p-5 mb-5 shadow-md ${
                  disabled
                    ? "bg-gray-100 border border-gray-300"
                    : "bg-[#f0fdfa] border border-[#0f766e]"
                }`}
              >
                <View className="flex-row items-center mb-3">
                  <Ionicons
                    name="gift-outline"
                    size={22}
                    color={disabled ? "#6b7280" : "#0f766e"}
                  />
                  <Text
                    className={`ml-2 text-lg font-bold ${
                      disabled ? "text-gray-500" : "text-[#065f46]"
                    }`}
                  >
                    {item.description}
                  </Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Ionicons
                    name="pricetag-outline"
                    size={20}
                    color={disabled ? "#9ca3af" : "#14b8a6"}
                  />
                  <Text
                    className={`ml-2 text-base font-semibold ${
                      disabled ? "text-gray-500" : "text-[#065f46]"
                    }`}
                  >
                    Mã: {item.code}
                  </Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={disabled ? "#9ca3af" : "#6b7280"}
                  />
                  <Text
                    className={`ml-2 text-sm ${
                      disabled ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {formatDate(item.start_date)} → {formatDate(item.end_date)}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons
                    name="people-outline"
                    size={18}
                    color={disabled ? "#9ca3af" : "#10b981"}
                  />
                  <Text
                    className={`ml-2 text-sm ${
                      disabled ? "text-gray-400" : "text-[#065f46]"
                    }`}
                  >
                    Còn lại: {item.max_count ?? 0} lượt
                  </Text>
                </View>

                {disabled ? (
                  <View className="mt-5 flex-row items-center justify-center bg-gray-300 rounded-full py-3">
                    <Ionicons name="alert-circle-outline" size={18} color="#fff" />
                    <Text className="text-white font-semibold text-base ml-2">
                      {isSaved
                        ? "Đã sử dụng"
                        : isUsed
                        ? "Đã sử dụng"
                        : !available
                        ? "Hết lượt sử dụng"
                        : "Không khả dụng"}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    className="mt-5 flex-row items-center justify-center bg-[#065f46] rounded-full py-3 active:opacity-80 shadow-md"
                    onPress={() => saveVoucher(item.id)}
                  >
                    <Ionicons name="bookmark-outline" size={18} color="#fff" />
                    <Text className="text-white font-semibold text-base ml-2">
                      Lưu voucher
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
