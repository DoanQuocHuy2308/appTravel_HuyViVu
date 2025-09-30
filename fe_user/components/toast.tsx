// components/TravelToast.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type ToastType = 'success' | 'error' | 'info';

type TravelToastProps = {
  type: ToastType;
  message: string;
  duration?: number;
  onHide?: () => void;
};

export default function TravelToast({ type, message, duration = 3000, onHide }: TravelToastProps) {
  const [visible, setVisible] = useState(true);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-80)).current;

  const gradients: Record<ToastType, readonly [string, string]> = {
    success: ['#4ade80', '#16a34a'],
    error: ['#f87171', '#b91c1c'],
    info: ['#60a5fa', '#2563eb'],
  };


  const icons: Record<ToastType, string> = {
    success: 'check-circle',
    error: 'times-circle',
    info: 'info-circle',
  };

  useEffect(() => {
    // Show animation
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, friction: 7, useNativeDriver: true }),
    ]).start();

    // Hide after duration
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -80, duration: 400, useNativeDriver: true }),
      ]).start(() => {
        setVisible(false);
        onHide?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        opacity,
        transform: [{ translateY }],
        zIndex: 9999,
      }}
    >
      <LinearGradient
        colors={gradients[type] as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 14,
          paddingHorizontal: 18,
          borderRadius: 25,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <Icon name={icons[type]} size={26} color="white" style={{ marginRight: 12 }} />
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', flex: 1 }}>
          {message}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}
