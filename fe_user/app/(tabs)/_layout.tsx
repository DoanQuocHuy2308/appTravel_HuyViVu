import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#318b89",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          bottom: 6,
          margin: 10,
          position: "absolute",
          backgroundColor: "#fff",
          borderRadius: 30,
          height: 90,
          paddingBottom: 10,
          paddingTop: 10,
          borderWidth: 2,
          borderColor: "#318b89",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="contact"
        options={{
          title: "Contact",
          tabBarIcon: ({ size, focused }) => (
            <View
              className={`w-[40px] h-[40px] rounded-full items-center justify-center ${focused ? "bg-[#318b89]" : ""
                }`}
            >
              <Ionicons
                name={focused ? "contract" : "contract-outline"}
                size={size}
                color={focused ? "#fff" : "#9ca3af"}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ size, focused }) => (
            <View
              className={`w-[40px] h-[40px] rounded-full items-center justify-center ${focused ? "bg-[#318b89]" : ""
                }`}
            >
              <Ionicons
                name={focused ? "compass" : "compass-outline"}
                size={size}
                color={focused ? "#fff" : "#9ca3af"}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, focused }) => (
            <View
              className={`w-[40px] h-[40px] rounded-full items-center justify-center ${focused ? "bg-[#318b89]" : ""
                }`}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={focused ? "#fff" : "#9ca3af"}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="follows"
        options={{
          title: "Follows",
          tabBarIcon: ({ size, focused }) => (
            <View
              className={`w-[40px] h-[40px] rounded-full items-center justify-center ${focused ? "bg-[#318b89]" : ""
                }`}
            >
              <Ionicons
                name={focused ? "heart" : "heart-outline"}
                size={size}
                color={focused ? "#fff" : "#9ca3af"}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ size, focused }) => (
            <View
              className={`w-[40px] h-[40px] rounded-full items-center justify-center ${focused ? "bg-[#318b89]" : ""
                }`}
            >
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={focused ? "#fff" : "#9ca3af"}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
