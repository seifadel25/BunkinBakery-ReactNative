import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { defaultPizzaImg } from "./ProductsList";
import Colors from "@/constants/Colors";
import { Tables } from "@/database.types";
import RemoteImage from "./RemoteImage";

type OrderItemProp = {
  item: Tables<"products"> | null;
  orderItem: Tables<"order_items"> | null;
};
const OrderItem = ({ item, orderItem }: OrderItemProp) => {
  if (!item || !orderItem) {
    // Render some fallback UI or return null
    return <Text>No item details available.</Text>;
  }
  return (
    <View style={styles.container}>
      <RemoteImage
        path={item.image}
        fallback={defaultPizzaImg}
        style={styles.img}
      />
      <View style={styles.left}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.leftDetails}>
          <Text style={styles.price}>{orderItem.comboPrice} EGP</Text>
          <Text style={styles.size}>Size: {orderItem.selectedSize}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.qnt}>{orderItem.quantity}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
  },
  img: {
    width: "20%",
    aspectRatio: 1,
    borderRadius: 10,
  },
  left: {
    flex: 2,
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 10,
  },
  name: {
    color: Colors.light.text,

    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  leftDetails: {
    flexDirection: "row",
  },
  price: {
    fontWeight: "bold",
    color: Colors.light.tint,
    marginRight: 8,
    fontSize: 14,
  },
  size: {
    color: Colors.light.text,
    fontWeight: "600",
    fontSize: 14,
  },
  right: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  qnt: {
    color: Colors.light.text,
    fontWeight: "bold",
    fontSize: 18,
  },
});
export default OrderItem;
