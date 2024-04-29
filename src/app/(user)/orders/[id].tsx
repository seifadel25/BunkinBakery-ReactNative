import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import OrderList from "@/components/OrderList";
import OrderItem from "@/components/OrderItem";
import { OrderStatus } from "@/types";
import Colors from "@/constants/Colors";
import {
  useOrderDetails,
  useOrderItemsList,
  useUpdateOrderStatusSubs,
} from "@/api/orders";
import { FontAwesome } from "@expo/vector-icons";

const status: OrderStatus[] = ["New", "Cooking", "Delivering", "Delivered"];
const orderItem = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  const { data: order, isLoading, error } = useOrderDetails(id);
  const { data: order_items } = useOrderItemsList(id);

  useUpdateOrderStatusSubs(id);

  const [orderStatus, setOrderStatus] = useState(order?.status);
  useEffect(() => {
    setOrderStatus(order?.status);
  }, [order]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch: {error.message}</Text>;
  }
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Order #${order?.id}` || "Order #",
          headerLeft: () => (
            <Pressable onPress={() => router.push("/(user)/orders")}>
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
        }}
      />

      <View>
        <FlatList
          data={order_items}
          renderItem={({ item: orderItem }) => (
            <OrderItem item={orderItem.products} orderItem={orderItem} />
          )}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={<OrderList order={order} />}
          ListFooterComponent={
            <View>
              <View style={styles.statuses}>
                {status.map((s) => (
                  <Pressable
                    key={s}
                    style={[
                      styles.status,
                      {
                        backgroundColor:
                          orderStatus === s ? Colors.light.Sec : "white",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: orderStatus === s ? "black" : "gray" },
                      ]}
                    >
                      {s}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.total}>
                <Text style={styles.totalText}>Total: {order?.total || 0}</Text>
              </View>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statuses: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    width: "100%",
    marginHorizontal: "auto",
  },
  status: {
    width: "auto",
    margin: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
  },
  total: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
export default orderItem;
