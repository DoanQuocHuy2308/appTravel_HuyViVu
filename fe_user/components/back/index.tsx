import React from "react";
import { TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from "expo-router";
export default function ButtonBack() {
  const router = useRouter();

  return (
      <TouchableOpacity
        className="m-4 w-10 h-10 border-2 rounded-full items-center justify-center border-[#318b89]"
        onPress={() => router.back()}
      >
        <Icon name="arrow-left" size={20} color="#00523f" />
      </TouchableOpacity>
  );
}
