import { Stack } from "expo-router";
import "../global.css";
import { ToastProvider } from '@/contexts/ToastContext';
// import "react-native-reanimated";
export default function RootLayout() {
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ToastProvider>
  );
}
