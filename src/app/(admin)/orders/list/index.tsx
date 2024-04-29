import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import OrderList from "@/components/OrderList";
import { useAdminOrderList, useOrderListSubs } from "@/api/orders";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

const index = () => {
  const { data: orders, isLoading, error } = useAdminOrderList();
  const cookingOrders = orders?.filter((order) => order.status !== "Delivered");
  useOrderListSubs();

  if (isLoading) {
    <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch: {error.message}</Text>;
  }

  return (
    <View>
      <FlatList
        data={cookingOrders}
        renderItem={({ item }) => <OrderList order={item} />}
      />
    </View>
  );
};

export default index;
