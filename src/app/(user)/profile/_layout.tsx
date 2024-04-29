import { Stack } from "expo-router";

export default function OrdersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: "Orders List",
      }}
    />
  );
}
