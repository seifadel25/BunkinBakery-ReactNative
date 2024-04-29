// // import {
// //   View,
// //   Text,
// //   FlatList,
// //   StyleSheet,
// //   Pressable,
// //   Alert,
// //   Button,
// // } from "react-native";
// // import React, { useState } from "react";
// import { useCart } from "@/providers/CartProvider";
// // import Button from "@/components/Button";
// import CartListItem from "@/components/CartListItem";
// import DeliveryOptionCard from "@/components/DeliveryOptionCard";
// // import { useStripe } from "@stripe/stripe-react-native";

// // export const payment = () => {
// //   const { initPaymentSheet, presentPaymentSheet } = useStripe();

// //   const handlePayment = async () => {
// //     // Supposing you fetch the client secret from your server:
// //     const clientSecret = await fetchPaymentIntentClientSecret(); // You need to define this function

// //     const { error: initError } = await initPaymentSheet({
// //       paymentIntentClientSecret: clientSecret,
// //     });

// //     if (initError) {
// //       console.error("Error initializing payment sheet:", initError);
// //       return; // Stop further execution in case of error
// //     }

// //     const { error: presentError } = await presentPaymentSheet();
// //     if (presentError) {
// //       console.error("Error presenting payment sheet:", presentError);
// //     } else {
// //       console.log("Payment successful");
// //     }
// //   };

// //   ///////

// //   const { items, total, DeliveryDetails, checkout } = useCart();
// //   const [selectedOption, setSelectedOption] = useState("");
// //   const handleSelectOption = (option: string) => {
// //     setSelectedOption(option);
// //   };
// //   const openPayment = () => {};
// //   // const payWithStripe = async () => {
// //   //   await initialisePaymentSheet(Math.floor(total * 100));
// //   //   const payed = await openPaymentSheet();
// //   //   if (!payed) {
// //   //     return Alert.alert("Payment failed", "Please try again");
// //   //     console.log(payed);
// //   //   }
// //   //   console.log(payed);
// //   // };
// //   // const pay = () => {
// //   //   console.log("test");
// //   //   try {
// //   //     payWithStripe();
// //   //   } catch (error) {
// //   //     console.log(error);
// //   //   }
// //   //   checkout();
// //   // };
// //   const cash = () => {
// //     if (DeliveryDetails.type === "delivery") {
// //       return (
// //         <DeliveryOptionCard
// //           option="CashDelivery"
// //           selectedOption={selectedOption}
// //           handleSelectOption={handleSelectOption}
// //           text="Cash on Delivery"
// //         />
// //       );
// //     }
// //     return (
// //       <DeliveryOptionCard
// //         option="CashPickup"
// //         selectedOption={selectedOption}
// //         handleSelectOption={handleSelectOption}
// //         text="Cash on Pickup"
// //       />
// //     );
// //   };
// //   return (
// //     <View style={styles.container}>
// //       <Pressable>
// //         <DeliveryOptionCard
// //           option="Stripe"
// //           selectedOption={selectedOption}
// //           handleSelectOption={handleSelectOption}
// //           text="Pay with Stripe"
// //         />
// //       </Pressable>
// //       {cash()}
// //       <Button width={"100%"} text="Checkout" onPress={openPayment} />
// //     </View>
// //   );
// // };
// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// // });
