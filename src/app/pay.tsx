import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  FlatList,
} from "react-native";
import Button from "@/components/Button";
import { initialisePaymentSheet, openPaymentSheet } from "@/lib/stripe"; // Adjust the path as necessary
import { useCart } from "@/providers/CartProvider";
import DeliveryOptionCard from "@/components/DeliveryOptionCard";
import CartListItem from "@/components/CartListItem";

const pay = () => {
  const { total, DeliveryDetails, checkout, items, setpaymentMethod } =
    useCart();
  const amount = total; // This could be dynamic based on the product or service
  const [selectedOption, setSelectedOption] = useState("");
  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    setpaymentMethod(option.toString());
  };
  const payStripe = async () => {
    await initialisePaymentSheet(Math.floor(amount * 100));
    const payed = await openPaymentSheet();
    if (!payed) {
      return;
    }
    checkout();
    Alert.alert("Payment successful", "Thank you for your purchase");
  };
  const CashDelivery = async () => {
    checkout();
    Alert.alert("Payment successful", "Thank you for your purchase");
  };
  const CashPickup = async () => {
    checkout();
    Alert.alert("Payment successful", "Thank you for your purchase");
  };
  const handlePaymentPress = () => {
    if (selectedOption === "Stripe") {
      return payStripe();
    } else if (selectedOption === "CashDelivery") {
      return CashDelivery();
    } else if (selectedOption === "CashPickup") {
      return CashPickup();
    } else {
      return Alert.alert("Please select a payment option");
    }
  };
  const cash = () => {
    if (DeliveryDetails.type === "delivery") {
      return (
        <DeliveryOptionCard
          option="CashDelivery"
          selectedOption={selectedOption}
          handleSelectOption={handleSelectOption}
          text="Cash on Delivery"
        />
      );
    }
    return (
      <DeliveryOptionCard
        option="CashPickup"
        selectedOption={selectedOption}
        handleSelectOption={handleSelectOption}
        text="Cash on Pickup"
      />
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.items}
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{ padding: 10, gap: 10 }}
      />
      <DeliveryOptionCard
        option="Stripe"
        selectedOption={selectedOption}
        handleSelectOption={handleSelectOption}
        text="Pay with Stripe"
      />
      {cash()}
      <Button width={"100%"} text="Checkout" onPress={handlePaymentPress} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  items: {
    width: "100%",
  },
  amount: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default pay;
// curl -X POST 'https://mxslyhfedenizvdzutxz.supabase.co/functions/v1/payment-sheet' \
// -H 'Content-Type: application/json' \
// -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14c2x5aGZlZGVuaXp2ZHp1dHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM2NzQwNzYsImV4cCI6MjAyOTI1MDA3Nn0.YhTS4gooTa3s1Hq-XWiyAOZwRgKJkc2OSmnRpS7vL-8' \
// -d '{"amount": 1099}'
