import { Alert } from "react-native";
import { supabase } from "@/lib/supabase";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";

const fetchPaymentSheetParams = async (amount: number) => {
  try {
    const { data, error } = await supabase.functions.invoke("payment-sheet", {
      body: JSON.stringify({ amount }), // Ensure the body is stringified if needed
    });

    if (error) {
      console.error("Error fetching payment sheet params:", error.message);
      Alert.alert("Error", error.message);
      return null; // Return null to indicate failure
    }

    if (data) {
      console.log("Fetched payment sheet params:", data);
      return data;
    } else {
      Alert.alert("Error", "No data received");
      return null;
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    Alert.alert("Error", "An unexpected error occurred");
    return null;
  }
};

export const initialisePaymentSheet = async (amount: number) => {
  console.log("Initialising payment sheet, for:", amount);

  const params = await fetchPaymentSheetParams(amount);
  if (!params) return; // Check if params is null and abort if so

  const { paymentIntent, publishableKey, customer, ephemeralKey } = params;

  if (!paymentIntent || !publishableKey) {
    Alert.alert("Error", "Required payment information is missing");
    return;
  }

  const result = await initPaymentSheet({
    merchantDisplayName: "notJust.dev",
    paymentIntentClientSecret: paymentIntent,
    customerId: customer || 2,
    customerEphemeralKeySecret: ephemeralKey || 1,
    defaultBillingDetails: {
      name: "Jane Doe", // Consider using actual user data
    },
  });

  if (result.error) {
    console.error("Failed to initialize payment sheet:", result.error);
    Alert.alert("Error", result.error.message);
  } else {
    console.log("Payment sheet initialized:", result);
  }
};

export const openPaymentSheet = async () => {
  const { error } = await presentPaymentSheet();

  if (error) {
    console.error("Error presenting payment sheet:", error);
    Alert.alert("Payment Error", error.message);
    return false;
  }
  console.log("Payment successful");
  return true;
};
