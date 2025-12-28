import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Tag, Clock, Trash2, Percent, AlertCircle } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header";
import { PromotionFull } from "@/types";
import usePromotionsUser from "@/hooks/usePromotionsUser";

export default function VoucherStorage() {
  const { promotionsUser, loading } = usePromotionsUser();
    
  const handleDelete = (id: number) => {
    alert("🗑️ Bạn có chắc muốn xóa voucher #" + id + " ?");
  };

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "Chưa cập nhật";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Không hợp lệ";
    return dateObj.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const formatDiscount = (discount: number | string | undefined) => {
    if (discount === undefined || discount === null) return "";
    const num = Number(discount);
    if (Number.isInteger(num)) return `${num}%`;
    return `${num.toFixed(1)}%`;
  };
  const isExpired = (endDate?: string | Date | null) => {
    if (!endDate) return true;
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    return end < now;
  };

  const renderItem = ({ item }: { item: PromotionFull }) => {
    const expired = isExpired(item.end_date);
    return (
      <View
        className={`rounded-2xl mb-4 shadow-sm border overflow-hidden ${
          expired ? "bg-gray-100 border-gray-200" : "bg-white border-[#08703f]"
        }`}
      >
        <View
          className={`px-4 py-3 flex-row justify-between items-center ${
            expired ? "bg-gray-200" : "bg-[#08703f]"
          }`}
        >
          <View className="flex-row items-center">
            <Tag size={18} color={expired ? "#6b7280" : "#ffffff"} />
            <Text
              className={`ml-2 font-bold text-base ${
                expired ? "text-gray-600" : "text-white"
              }`}
            >
              {item.description}
            </Text>
          </View>

          <View
            className={`px-3 py-1 rounded-lg ${
              expired ? "bg-gray-300" : "bg-white"
            }`}
          >
            <Text
              className={`font-semibold text-sm ${
                expired ? "text-gray-600" : "text-emerald-700"
              }`}
            >
              {formatDiscount(item.discount)}
            </Text>
          </View>
        </View>
        <View className="p-4 flex-row justify-between items-center">
          <View>
            <View className="flex-row items-center mb-2">
              <Percent size={15} color={expired ? "#9ca3af" : "#10b981"} />
              <Text className="ml-2 text-gray-600 text-sm">Mã giảm:</Text>
              <Text
                className={`ml-2 font-semibold ${
                  expired ? "text-gray-500" : "text-[#08703f]"
                }`}
              >
                {item.code}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Clock size={15} color={expired ? "#9ca3af" : "#4b5563"} />
              <Text className="ml-2 text-gray-600 text-sm">Hết hạn:</Text>
              <Text
                className={`ml-2 font-medium ${
                  expired ? "text-gray-500" : "text-red-700"
                }`}
              >
                {formatDate(item.end_date)}
              </Text>
            </View>
          </View>
          {expired ? (
            <View className="flex-row items-center bg-gray-300 px-3 py-2 rounded-full">
              <AlertCircle size={16} color="#fff" />
              <Text className="ml-2 text-white font-semibold text-sm">
                Hết hạn
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => handleDelete(item.promotion_id || 0)}
              className="bg-red-50 p-2 rounded-full active:opacity-70"
            >
              <Trash2 size={18} color="#dc2626" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header title="🎟️ Kho Voucher của bạn" />
      <View className="flex-1 p-4">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-400 text-lg text-center">
              Đang tải voucher...
            </Text>
          </View>
        ) : !promotionsUser || promotionsUser.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-400 text-lg text-center">
              Bạn chưa lưu voucher nào cả 🎁{"\n"}Hãy săn khuyến mãi ngay nhé!
            </Text>
          </View>
        ) : (
          <FlatList
            data={promotionsUser as PromotionFull[]}
            renderItem={renderItem}
            keyExtractor={(item) =>
              item.promotion_id?.toString() || Math.random().toString()
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
