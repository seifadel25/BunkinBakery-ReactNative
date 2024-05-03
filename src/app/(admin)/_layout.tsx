import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Redirect, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useAuth } from "@/providers/AuthProvider";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={25} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Redirect href={"/"} />;
  }
  const { profile } = useAuth();
  if (!profile || profile.group !== "ADMIN") {
    return <Redirect href="/" />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        tabBarInactiveTintColor: Colors.light.Sec,
        tabBarStyle: {
          borderTopWidth: 0,
          paddingBottom: 10,
          elevation: 0,
          shadowOpacity: 0,
          zIndex: 1000,
        },

        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="menu"
        options={{
          headerShown: false,
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="cutlery" color={color} />
          ),
          tabBarStyle: {
            zIndex: 1000,
          },
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          headerShown: false,
          title: "Orders",
          tabBarStyle: {
            zIndex: 1000,
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
    </Tabs>
  );
}
