import React, { useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Back from "@/components/back";
import { useRouter } from "expo-router";
import { ToastContext } from "@/contexts/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "@/components/header";

const menuItems = [
  { id: 1, title: "Thông báo", url: "/(tabs)/home" },
  { id: 2, title: "Xoá tài khoản", url: "/(tabs)/home" },
  { id: 3, title: "Ngôn ngữ", url: "/(tabs)/home" },
  { id: 4, title: "Đơn vị tiền tệ", url: "/(tabs)/home" },
  { id: 5, title: "Đăng xuất", url: "/screens/(acc)/login" },
];

export default function Setting() {
  const router = useRouter();
  const { showToast } = useContext(ToastContext);

  const logout = async () => {
    Alert.alert("Xác nhận", "Bạn có muốn đăng xuất không?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("user");
            router.replace("/screens/(acc)/login");
            showToast("success", "Đăng xuất thành công");
          } catch (error) {
            showToast("error", "Đăng xuất thất bại");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Cài Đặt" />
      <ScrollView className="flex-1">
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="flex-row justify-between items-center px-4 py-4 border-b border-gray-200"
            onPress={() =>
              item.title === "Đăng xuất"
                ? logout()
                : router.push(item.url as any)
            }
          >
            <Text className="text-base text-black">{item.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
