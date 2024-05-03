import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { Link, router, useSegments } from "expo-router";
import { Tables } from "@/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

type OrderListProp = {
  order: Tables<"orders"> | null | undefined;
};
dayjs.extend(relativeTime);

const OrderList = ({ order }: OrderListProp) => {
  const segments = useSegments();
  const type = segments[0] || "(user)";
  const toOrderItem = () => {
    if (order?.id) {
      router.navigate(`/${type}/orders/${order.id}`);
    } else {
      router.navigate(`/${type}/orders`);
    }
  };
  if (!order) {
    // Render some fallback UI or return null
    return <Text>No orders yet.</Text>;
  }
  return (
    // <Link style={styles.container} href={`/orders/${order.id}`}> Breaks stylings on mobile
    <Pressable onPress={toOrderItem} style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.order}>Order #{order.id}</Text>
        <Text style={styles.date}>{dayjs(order.created_at).fromNow()} </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.status}>{order.status}</Text>
      </View>
    </Pressable>
    // </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 8,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    alignContent: "center",
  },
  link: {
    flex: 1,
  },
  left: {
    flexDirection: "column",
    width: "50%",
  },
  order: {
    fontWeight: "bold",
    fontSize: 18,
  },
  date: {
    fontWeight: "600",
    color: "gray",
    paddingTop: 3,
    fontSize: 14,
  },
  status: {
    fontWeight: "600",
    fontSize: 16,
  },
  right: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    width: "50%",
  },
});

export default OrderList;
