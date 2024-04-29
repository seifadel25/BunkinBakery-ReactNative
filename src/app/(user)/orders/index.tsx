import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import OrderList from "@/components/OrderList";
import { useOrderStatusSubs, useUserOrderList } from "@/api/orders";
import { Stack } from "expo-router";

const index = () => {
  const { data: orders, isLoading, error } = useUserOrderList();
  useOrderStatusSubs();
  if (isLoading) {
    <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch: {error.message}</Text>;
  }
  return (
    <View>
      <Stack.Screen
        options={{ title: "Orders List", headerBackButtonMenuEnabled: false }}
      />
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderList order={item} />}
      />
    </View>
  );
};

export default index;
