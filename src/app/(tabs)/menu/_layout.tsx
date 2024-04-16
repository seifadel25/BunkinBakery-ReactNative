import ProductsList from "@/components/ProductsList";
import { Stack } from "expo-router";
import product from "./[id]";

export default function MenuStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Menu" }} />
    </Stack>
  );
}
