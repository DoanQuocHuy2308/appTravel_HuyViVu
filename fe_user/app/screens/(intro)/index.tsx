import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

type Slide = {
  key: string;
  title: string;
  text: string;
  image: any;
};

const slides: Slide[] = [
  {
    key: "1",
    title: "CHÀO MỪNG ĐẾN VỚI HUY VI VU",
    text: "Bắt đầu hành trình của bạn cùng Huy Vi Vu – nơi việc du lịch không chỉ là di chuyển từ nơi này đến nơi khác, mà còn là hành trình khám phá, trải nghiệm và tạo nên những kỷ niệm khó quên. Chúng tôi ở đây để trở thành người bạn đồng hành đáng tin cậy của bạn trên mọi chuyến đi.",
    image: require("@/assets/images/bg1.png"),
  },
  {
    key: "2",
    title: "Khám Phá Thế Giới",
    text: "Từ những khu rừng nguyên sinh, bãi biển trong xanh cho đến các thành phố hiện đại và sôi động nhất trên thế giới – hãy lựa chọn trong hơn 1.000 tour độc đáo trên 5 châu lục. Mỗi điểm đến đều đang chờ bạn khám phá.",
    image: require("@/assets/images/index1.jpg"),
  },
  {
    key: "3",
    title: "Đặt Tour Dễ Dàng",
    text: "Việc đặt chuyến đi mơ ước chưa bao giờ đơn giản đến thế. Chỉ với vài thao tác, bạn có thể tìm kiếm, so sánh và đặt ngay tour phù hợp nhất. Ứng dụng của chúng tôi được thiết kế để tiết kiệm thời gian và mang đến cho bạn những lựa chọn tốt nhất.",
    image: require("@/assets/images/bg2.png"),
  },
  {
    key: "4",
    title: "Ưu Đãi Hấp Dẫn",
    text: "Tận hưởng chuyến du lịch mà không lo về chi phí. Nhận ngay những ưu đãi độc quyền, combo du lịch đặc biệt và quà tặng hấp dẫn dành riêng cho bạn. Với Huy Vi Vu, mỗi hành trình không chỉ đáng nhớ mà còn thật tiết kiệm.",
    image: require("@/assets/images/index2.jpg"),
  },
];


export default function Index() {
  const router = useRouter();
  const renderItem = ({ item }: { item: Slide }) => (
    <ImageBackground
      source={item.image}
      style={{ width, height }}
      resizeMode="cover"
    >
      <View className="absolute bottom-0 w-full h-1/2 bg-white/90 rounded-t-[40px] items-center py-8 px-6">
        <Image
          source={require("@/assets/images/iconHuyViVu.png")}
          className="w-32 h-32 mb-4 rounded-full border-4 border-[#00523f]"
          resizeMode="contain"
        />
        <Text className="text-3xl font-extrabold text-[#00523f] mb-4 text-center">
          {item.title}
        </Text>
        <Text className="text-base text-gray-700 text-center mb-6 px-2">
          {item.text}
        </Text>
      </View>
    </ImageBackground>
  );

  const renderNextButton = () => (
    <View className="bg-[#00523f] px-8 py-5 rounded-full">
      <Text className="text-white font-medium">Next</Text>
    </View>
  );

  const renderDoneButton = () => (
    <TouchableOpacity
      className="bg-[#00523f] px-8 py-5 rounded-full"
      onPress={() => router.push("/screens/(acc)/login")}
    >
      <Text className="text-white font-medium">Explore Now!</Text>
    </TouchableOpacity>
  );

  const renderSkipButton = () => (
    <TouchableOpacity
      className="bg-[#00523f] px-8 py-5 rounded-full"
      onPress={() => router.push("/screens/(acc)/login")}
    >
      <Text className="text-white font-medium">Skip</Text>
    </TouchableOpacity>
  );

  return (
    <AppIntroSlider
      data={slides}
      renderItem={renderItem}
      renderNextButton={renderNextButton}
      renderDoneButton={renderDoneButton}
      renderSkipButton={renderSkipButton}
      keyExtractor={(item) => item.key}
      showNextButton
      showDoneButton
      showSkipButton
      dotStyle={{ backgroundColor: "#d1d5db" }}
      activeDotStyle={{ backgroundColor: "#00523f" }}
      onDone={() => router.push("/screens/(acc)/login")}
      onSkip={() => router.push("/screens/(acc)/login")}
    />
  );
}
