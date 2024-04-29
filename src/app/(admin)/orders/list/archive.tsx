import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import OrderList from "@/components/OrderList";
import { useAdminOrderList } from "@/api/orders";

const index = () => {
  const { data: orders, isLoading, error } = useAdminOrderList();

  const archiveOrders = orders?.filter((order) => order.status === "Delivered");
  if (isLoading) {
    <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch: {error.message}</Text>;
  }
  return (
    <View>
      <FlatList
        data={archiveOrders}
        renderItem={({ item }) => <OrderList order={item} />}
      />
    </View>
  );
};

export default index;
