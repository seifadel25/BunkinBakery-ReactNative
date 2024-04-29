import ProductsList from "@/components/ProductsList";
import { Stack, Link, useSegments, router } from "expo-router";
import product from "./[id]";
import { FontAwesome } from "@expo/vector-icons";
import { Pressable } from "react-native";
import Colors from "@/constants/Colors";

export default function MenuStack() {
  const segments = useSegments();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Menu",
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
                  style={{ marginLeft: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
          headerRight: () => (
            <Link href="/(admin)/menu/create" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="plus-square-o"
                    size={25}
                    color={Colors.light.tabIconDefault}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Stack>
  );
}
