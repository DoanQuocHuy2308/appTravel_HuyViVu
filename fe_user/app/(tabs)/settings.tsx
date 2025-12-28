import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
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
import useUser from "@/hooks/useUser";
import {API_URL} from "@/types/url";
import RankInfoModal, { getUserRank } from "@/components/rankInfo";
import { LinearGradient } from "expo-linear-gradient";

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [showRankModal, setShowRankModal] = React.useState(false);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Chào buổi sáng";
    if (hour >= 12 && hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  // Lấy thông tin hạng của user
  const userPoints = user?.points || 0;
  const userRank = getUserRank(userPoints);

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-[#01681b]">
        <LinearGradient colors={["#01681b", "#098b4e"]} start={{x:0,y:0}} end={{x:1,y:1}} className="absolute inset-0" />
        <View className="flex-1 items-center justify-center px-6">
          <View className="items-center mb-8">
            <View className="w-28 h-28 rounded-full bg-white/10 items-center justify-center mb-4 border-2 border-white/30">
              <Ionicons name="person-circle-outline" size={84} color="#ffffff" />
            </View>
            <Text className="text-white text-3xl font-extrabold mb-2">Chào mừng đến Huy Vi Vu</Text>
            <Text className="text-white/90 text-center">Đăng nhập để khám phá ưu đãi, tích điểm và quản lý chuyến đi</Text>
          </View>
          <View className="w-full">
            <TouchableOpacity
              className="bg-white py-4 rounded-2xl mb-3 items-center shadow"
              onPress={() => router.push('/screens/(intro)')}
              activeOpacity={0.9}
            >
              <Text className="text-[#01681b] font-bold text-lg">Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-transparent border-2 border-white py-4 rounded-2xl items-center"
              onPress={() => router.push('/screens/(acc)/register')}
              activeOpacity={0.9}
            >
              <Text className="text-white font-bold text-lg">Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#01681b]">
      <LinearGradient colors={["#01681b", "#098b4e"]} start={{x:0,y:0}} end={{x:1,y:1}} className="absolute top-0 left-0 right-0 h-60 rounded-b-[32px]" />
      <View className="px-5 pt-10 mb-5">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="w-20 h-20 rounded-full overflow-hidden items-center justify-center bg-white border-4 border-white/30">
              <Image
                source={user?.image ? { uri: API_URL + user.image } : require("@/assets/images/iconHuyViVu.png")}
                className="w-20 h-20"
              />
            </View>
            <View className="ml-4">
              <Text className="text-white/90 text-sm">{getGreeting()}</Text>
              <Text className="text-white font-extrabold text-2xl">
                {user?.name || "Khách hàng"}
              </Text>
              <TouchableOpacity className="flex-row items-center mt-1" onPress={() => router.push("/screens/(profile)")} activeOpacity={0.8}>
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
            activeOpacity={0.8}
          >
            <Settings size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row justify-center items-center border border-gray-100 bg-white/95 py-5 rounded-3xl mx-5 shadow">
        <View className="border-r w-[50%] border-gray-200 flex-col justify-center items-center">
          <Text className="text-gray-700 font-semibold text-base">
            Điểm đổi quà:
          </Text>
          <Text className="text-gray-900 font-bold text-lg mt-1">{user?.points ? Number(user?.points).toLocaleString() : 0}</Text>
        </View>
        <View className="border-l w-[50%] border-gray-200 flex-col justify-center items-center">
          <Text className="text-gray-700 font-semibold text-base">
            Điểm vàng:
          </Text>
          <Text className="text-gray-900 font-bold text-lg mt-1">0</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 h-full bg-white/95 px-5 py-5 mt-5 rounded-t-3xl"
        contentContainerStyle={{
          paddingBottom: 112,
        }}
      >
        <View className="mt-6 flex-row justify-between">
          <TouchableOpacity 
            className="flex-row items-center gap-3 bg-gray-50 rounded-2xl px-4 py-4 shadow flex-1 mr-3"
            onPress={() => setShowRankModal(true)}
            activeOpacity={0.85}
          >
            <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: userRank.color + '20' }}>
              <Text className="text-lg">{userRank.icon}</Text>
            </View>
            <View>
              <Text className="text-gray-800 font-semibold">{userRank.rank}</Text>
              <Text className="text-gray-500 text-sm">Xem thông tin</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-3 bg-gray-50 rounded-2xl px-4 py-4 shadow flex-1 ml-3" activeOpacity={0.85}>
            <HandCoins size={22} color="#38bdf8" />
            <View>
              <Text className="text-gray-800 font-semibold">
                {userRank.pointsNeeded > 0 ? `${Number(userRank.pointsNeeded).toLocaleString()} điểm` : 'Đã đạt hạng cao nhất'}
              </Text>
              <Text className="text-gray-500 text-sm">
                {userRank.nextRank ? `Cần để lên ${userRank.nextRank}` : 'Hạng tối đa'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text className="text-black font-semibold text-xl my-4">
          Tiện ích của tôi
        </Text>

        <View className="flex-row h-[100px] border border-gray-100 bg-white rounded-2xl overflow-hidden shadow">
          <TouchableOpacity
            className="flex-1 items-center justify-center px-4 py-3 border-r border-gray-200"
            onPress={() => router.push("/screens/(myVouchers)")}
            activeOpacity={0.85}
          >
            <TicketPercent size={24} color="#f086ac" />
            <Text className="text-gray-800 text-sm font-semibold mt-2">
              Voucher của tôi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 items-center justify-center px-4 py-3"
            onPress={() => router.push("/(tabs)")}
            activeOpacity={0.85}
          >
            <Gift size={24} color="#e4b99e" />
            <Text className="text-gray-800 text-sm font-semibold mt-2">
              Đổi quà
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row mt-5 h-[100px] border border-gray-100 bg-white rounded-2xl overflow-hidden shadow">
          <TouchableOpacity
            className="flex-1 items-center justify-center px-4 py-3 border-r border-gray-200"
            onPress={() => router.push("/screens/(tour_manager)")}
            activeOpacity={0.85}
          >
            <View className="w-12 h-12 rounded-full bg-[#01681b] items-center justify-center mb-2 shadow">
              <Ionicons name="calendar-outline" size={22} color="#fff" />
            </View>
            <Text className="text-gray-800 text-sm font-semibold">
              Booking của tôi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 items-center justify-center px-4 py-3"
            onPress={() => router.push("/screens/(booking_manager)")}
            activeOpacity={0.85}
          >
            <View className="w-12 h-12 rounded-full bg-[#01681b] items-center justify-center mb-2 shadow">
              <ScanSearch size={22} color="#fff" />
            </View>
            <Text className="text-gray-800 text-sm font-semibold">
              Tra cứu booking
            </Text>
          </TouchableOpacity>
        </View>
        <Text className="text-black font-semibold text-xl my-4">Điểm thưởng</Text>
        <View className="flex-row flex-wrap border border-gray-100 rounded-2xl bg-white shadow">
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-r border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
            activeOpacity={0.85}
          >
            <Ionicons name="car-sport" size={25} color="#38bdf8" />
            <Text className="text-gray-800 text-sm text-center font-semibold mt-2">
              Lịch sử đi tour
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-r border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
            activeOpacity={0.85}
          >
            <Ionicons name="gift" size={25} color="#feb76c" />
            <Text className="text-gray-800 text-sm text-center font-semibold mt-2">
              Lịch sử đổi quà
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
            activeOpacity={0.85}
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
        <View className="flex-row flex-wrap border border-gray-100 rounded-2xl bg-white shadow">
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-r border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
            activeOpacity={0.85}
          >
            <BookText size={25} color="#feb76c" />
            <Text className="text-gray-800 text-sm text-center font-semibold mt-2">
              Chính sách riêng tư
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-r border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
            activeOpacity={0.85}
          >
            <CircleQuestionMark size={25} color="#f086ac" />
            <Text className="text-gray-800 text-sm text-center font-semibold mt-2">
              Câu hỏi{"\n"}thường gặp
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
            activeOpacity={0.85}
          >
            <Handshake size={24} color="#8eb5cd" />
            <Text className="text-gray-800 text-sm text-center font-semibold mt-2">
              Thỏa thuận{"\n"}sử dụng
            </Text>
          </TouchableOpacity>
        </View>
        <Text className="text-black font-semibold text-xl my-4">Thông tin thêm</Text>
        <View className="flex-row mb-20 border border-gray-100 rounded-2xl bg-white shadow">
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-r border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
            activeOpacity={0.85}
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
            activeOpacity={0.85}
          >
            <Headset size={25} color="#56bfe6" />
            <Text className="text-gray-800 text-sm text-center font-semibold mt-2">
              Liên hệ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-1/3 items-center justify-center px-4 py-4 border-b border-gray-200"
            onPress={() => router.push("/(tabs)")}
            activeOpacity={0.85}
          >
            <Building2 size={24} color="#f086ac" />
            <Text className="text-gray-800 text-sm text-center font-semibold mt-2">
              Văn phòng
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Rank Info Modal */}
      <RankInfoModal
        visible={showRankModal}
        onClose={() => setShowRankModal(false)}
        userPoints={userPoints}
      />
    </SafeAreaView>
  );
}
