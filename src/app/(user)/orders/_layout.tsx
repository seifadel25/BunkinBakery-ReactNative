import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, router, useSegments } from "expo-router";
import { Button, Pressable } from "react-native";

export default function OrdersLayout() {
  const segments = useSegments();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: "Orders List",
      }}
    />
  );
}
