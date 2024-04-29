import { View, Text, Platform, FlatList } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useCart } from "@/providers/CartProvider";
import CartListItem from "@/components/CartListItem";
import Button from "@/components/Button";
import { router } from "expo-router";

const CartScreen = () => {
  const { items, total } = useCart();
  const handleCheckout = () => {
    router.push("/delivery");
  };

  return (
    <View style={{ paddingTop: Platform.OS === "android" ? 25 : 0 }}>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{ padding: 10, gap: 10 }}
      />
      <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "600" }}>
        Total:{total.toFixed(2)} EGP
      </Text>
      <Button width={"100%"} text="Checkout" onPress={handleCheckout} />
      <StatusBar style="auto" />
    </View>
  );
};

export default CartScreen;
