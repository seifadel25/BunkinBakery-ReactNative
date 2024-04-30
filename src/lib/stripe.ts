import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { Alert } from "react-native";

const fetchPaymentSheetParams = async (amount: number) => {
  try {
    const { data, error } = await supabase.functions.invoke("payment-sheet", {
      body: { amount },
    });

    if (data) {
      console.log(data);
      return data;
    }
    if (error && error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      console.log("Function returned an error", errorMessage);
    }
    console.error("Error fetching payment sheet params:", error);
  } catch (error) {
    if (error && error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();
      console.log("Function returned an error", errorMessage);
    }
  }
};

export const initialisePaymentSheet = async (amount: number) => {
  console.log("Initialising payment sheet, for: ", amount);

  const { paymentIntent, publishableKey, customer, ephemeralKey } =
    await fetchPaymentSheetParams(amount);

  if (!paymentIntent || !publishableKey) return;

  const result = await initPaymentSheet({
    merchantDisplayName: "Bunkin' Bakery",
    customerId: customer,
    customerEphemeralKeySecret: ephemeralKey.secret,
    paymentIntentClientSecret: paymentIntent,
    defaultBillingDetails: {
      name: "Jane Doe",
    },
    // Define additional configuration options as needed
  });
  console.log("Payment Sheet initialised successfully" + result);
};
export const openPaymentSheet = async () => {
  const { error } = await presentPaymentSheet();
  if (error) {
    Alert.alert(error.message);
    return false;
  }
  Alert.alert("Payment successful");
  return true;
};

// $ curl -i --request POST 'http://127.0.0.1:54321/functions/v1/payment-sheet' -H 'Authorization: Bearer sk_test_51PARzJBmffrbeZXHm9XnI0rs6G8rExBKwYwnyoEV3sRYTLBRbNo2a9IdCo01q5IWnnr6I9ZXruLLecZVtmWlGicC00W9HwY06t' -H 'Content-Type: application/json' -d '{"amount": 1099}'
// $ curl -L -X POST 'http://192.168.1.13:54321/functions/v1/hello-world' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'  --data '{"name": "Functions"}'
// $ curl -i --request POST 'http://192.168.1.13:54321/functions/v1/payment-sheet' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' -H 'Content-Type: application/json' --data '{"amount": 1099}'
// $ curl -i --request POST 'https://mxslyhfedenizvdzutxz.supabase.co/functions/v1/payment-sheet' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14c2x5aGZlZGVuaXp2ZHp1dHh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzY3NDA3NiwiZXhwIjoyMDI5MjUwMDc2fQ.AwpvdpPN80eJPS82tk_t6RD-NUSlnjgBc-PhOQiL-dY' -H 'Content-Type: application/json' --data '{"amount": 109999}'
// $ curl -L -X POST 'https://mxslyhfedenizvdzutxz.supabase.co/functions/v1/hello-world' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14c2x5aGZlZGVuaXp2ZHp1dHh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzY3NDA3NiwiZXhwIjoyMDI5MjUwMDc2fQ.AwpvdpPN80eJPS82tk_t6RD-NUSlnjgBc-PhOQiL-dY' --data '{"name": "Functions"}'
