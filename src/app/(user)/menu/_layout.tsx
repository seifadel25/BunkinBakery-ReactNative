import ProductsList from "@/components/ProductsList";
import { Stack, Link, router, useSegments } from "expo-router";
import product from "./[id]";
import { FontAwesome } from "@expo/vector-icons";
import { Pressable } from "react-native";
import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";

export default function MenuStack() {
  const segments = useSegments();

  return (
    <Stack
      screenOptions={{
        headerLeft: () => (
          <Pressable
            onPress={() =>
              segments.length < 3 ? router.push("/") : router.back()
            }
          >
            {({ pressed }) => (
              <FontAwesome
                name="chevron-circle-left"
                size={25}
                color={Colors.light.tabIconDefault}
                style={{
                  marginLeft: 15,
                  opacity: pressed ? 0.5 : 1,
                }}
              />
            )}
          </Pressable>
        ),
        headerRight: () => (
          <Link href="/cart" asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="shopping-basket"
                  size={25}
                  color={Colors.light.tabIconDefault}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: "Menu" }} />
    </Stack>
  );
}
