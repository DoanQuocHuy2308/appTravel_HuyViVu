import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

interface CountdownProps {
  startDate: string | Date;
}

const Countdown: React.FC<CountdownProps> = ({ startDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const start = new Date(startDate).getTime();

    const diff = start - now;

    if (diff <= 0) return "Đã khởi hành";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft()); 
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval); 
  }, [startDate]);

  return (
    
    <View className="absolute bottom-3 right-3 bg-red-600/90 px-3 py-1 rounded-full shadow-md">
    <Text className="text-white font-bold">{timeLeft}</Text>
</View>
  );
};

export default Countdown;
