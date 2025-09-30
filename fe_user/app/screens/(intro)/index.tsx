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
    title: "WELCOME TO HUY VI VU",
    text: "Start your journey with Huy Vi Vu – where traveling is not just about moving from place to place, but about discovering, experiencing, and creating unforgettable memories. We are here to be your trusted companion on every adventure.",
    image: require("@/assets/images/bg1.png"),
  },
  {
    key: "2",
    title: "Explore the World",
    text: "From untouched rainforests and crystal-clear beaches to the most vibrant and modern cities across the globe – choose from over 1,000 unique tours across 5 continents. Every destination is waiting to be explored by you.",
    image: require("@/assets/images/index1.jpg"),
  },
  {
    key: "3",
    title: "Easy Tour Booking",
    text: "Booking your dream trip has never been easier. With just a few taps, you can search, compare, and reserve the perfect tour. Our app is designed to save you time while giving you the best options at your fingertips.",
    image: require("@/assets/images/bg2.png"),
  },
  {
    key: "4",
    title: "Attractive Deals",
    text: "Enjoy your travels without breaking the bank. Take advantage of exclusive discounts, special travel combos, and unique gifts crafted just for you. With Huy Vi Vu, every trip is not only memorable but also affordable.",
    image: require("@/assets/images/index2.jpg"),
  },
];

export default function index() {
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
