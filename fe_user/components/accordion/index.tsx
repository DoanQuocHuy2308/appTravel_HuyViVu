import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, ScrollView } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";

type AccordionProps = {
  title: string;
  content: string;
};

export default function Accordion({ title, content }: AccordionProps) {
  const [expanded, setExpanded] = useState(true); 
  const animation = useRef(new Animated.Value(1)).current; 

  useEffect(() => {
    Animated.timing(animation, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150], 
  });

  return (
    <View className="border border-green-200 rounded-2xl bg-white overflow-hidden">
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        className="flex-row justify-between items-center px-4 py-3"
      >
        <Text className="text-base font-bold text-[#08703f]">{title}</Text>
        {expanded ? (
          <ChevronUp size={20} color="#16a34a" />
        ) : (
          <ChevronDown size={20} color="#16a34a" />
        )}
      </TouchableOpacity>
      <Animated.View style={{ height }}>
        <ScrollView className="px-4 py-3 mb-3" showsHorizontalScrollIndicator={false}   >
          <Text className="text-base text-gray-600">{content}</Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
