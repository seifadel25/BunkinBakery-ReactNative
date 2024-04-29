import { View, Text, FlatList } from "react-native";
import React from "react";
import { useCart } from "@/providers/CartProvider";
import Button from "@/components/Button";
import CartListItem from "@/components/CartListItem";

const orderPlaced = () => {
  const { items, total } = useCart();
  const placeOrder = () => {};
  return (
    <View>
      <Text>orderPlaced</Text>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{ padding: 10, gap: 10 }}
      />
      <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "600" }}>
        Total:{total.toFixed(2)} EGP
      </Text>
      <Button width={"100%"} text="Pay" onPress={placeOrder} />
    </View>
  );
};

export default orderPlaced;
