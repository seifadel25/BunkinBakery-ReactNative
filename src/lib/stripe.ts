// // import { Alert } from "react-native";
// // import { supabase } from "./supabase";
// // import {
// //   initPaymentSheet,
// //   presentPaymentSheet,
// // } from "@stripe/stripe-react-native";

import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { Alert } from "react-native";

// // const fetchPaymentSheetParams = async (amount: number) => {
// //   const { data, error } = await supabase.functions.invoke("payment-sheet", {
// //     body: { amount },
// //   });
// //   if (data) {
// //     console.log(data);
// //     return data;
// //   }
// //   Alert.alert("Error fetching payment sheet params");
// //   console.log(error);
// //   return {};
// // };

// // export const initialisePaymentSheet = async (amount: number) => {
// //   console.log("Initialising payment sheet, for: ", amount);

// //   const { paymentIntent, publishableKey, customer, ephemeralKey } =
// //     await fetchPaymentSheetParams(amount);
// //   console.log(paymentIntent, publishableKey, customer, ephemeralKey);
// //   if (!paymentIntent || !publishableKey) return;

// //   const result = await initPaymentSheet({
// //     merchantDisplayName: "notJust.dev",
// //     paymentIntentClientSecret: paymentIntent,
// //     customerId: customer,
// //     customerEphemeralKeySecret: ephemeralKey,
// //     defaultBillingDetails: {
// //       name: "Jane Doe",
// //     },
// //   });
// //   console.log(result);
// // };

// // export const openPaymentSheet = async () => {
// //   const { error } = await presentPaymentSheet();

// //   if (error) {
// //     Alert.alert(error.message);
// //     console.log(error);
// //     return false;
// //   }
// //   return true;
// // };
// import { useStripe } from "@stripe/stripe-react-native";

// const { initPaymentSheet, presentPaymentSheet } = useStripe();

// const initializePaymentSheet = async (clientSecret: any) => {
//   const { error } = await initPaymentSheet({
//     paymentIntentClientSecret: clientSecret,
//     merchantDisplayName: "Your Merchant Name", // Replace with your actual merchant name
//     // Define additional configuration options as needed
//     customerEphemeralKeySecret: "your_customer_ephemeral_key_secret", // if applicable
//     customerId: "your_customer_id", // if applicable
//   });
//   if (error) {
//     console.error("Error initializing payment sheet:", error);
//   }
// };

// const openPaymentSheet = async () => {
//   const { error } = await presentPaymentSheet();
//   if (error) {
//     console.error("Error presenting payment sheet:", error);
//   } else {
//     console.log("Payment successful");
//   }
// };

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
  // const clientSecret = await fetchPaymentIntentClientSecret(amount);
  // await initializePaymentSheet(clientSecret);
  // await openPaymentSheet();
  console.log("Initialising payment sheet, for: ", amount);
  const { paymentIntent, publishableKey, customer, ephemeralKey } =
    await fetchPaymentSheetParams(amount);
  if (!paymentIntent || !publishableKey) return;
  await initPaymentSheet({
    paymentIntentClientSecret: paymentIntent,
    customerEphemeralKeySecret: ephemeralKey.secret,
    customerId: customer,
    merchantDisplayName: "Bunkin' Bakery",
    defaultBillingDetails: {
      name: "Jane Doe",
    },
    // Define additional configuration options as needed
  });
  console.log("Payment Sheet initialised successfully");
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

// export const fetchPaymentIntentClientSecret = async (amount: number) => {
//   try {
//     const response = await fetch(
//       "http://127.0.0.1:54321/functions/v1/payment-sheet",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           apikey:
//             "sk_test_51PARzJBmffrbeZXHm9XnI0rs6G8rExBKwYwnyoEV3sRYTLBRbNo2a9IdCo01q5IWnnr6I9ZXruLLecZVtmWlGicC00W9HwY06t", // Public anon key for Supabase
//         },
//         body: JSON.stringify({ amount }),
//       }
//     );

//     const data = await response.json();
//     return data.clientSecret; // This should be the client secret from the payment intent
//   } catch (error) {
//     console.error("Error fetching payment intent:", error);
//     throw error; // Optionally rethrow to handle it in the calling component
//   }
// };
// $ curl -i --request POST 'http://127.0.0.1:54321/functions/v1/payment-sheet' -H 'Authorization: Bearer sk_test_51PARzJBmffrbeZXHm9XnI0rs6G8rExBKwYwnyoEV3sRYTLBRbNo2a9IdCo01q5IWnnr6I9ZXruLLecZVtmWlGicC00W9HwY06t' -H 'Content-Type: application/json' -d '{"amount": 1099}'
// $ curl -L -X POST 'http://192.168.1.13:54321/functions/v1/hello-world' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'  --data '{"name": "Functions"}'
// $ curl -i --request POST 'http://192.168.1.13:54321/functions/v1/payment-sheet' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' -H 'Content-Type: application/json' --data '{"amount": 1099}'
// $ curl -i --request POST 'https://mxslyhfedenizvdzutxz.supabase.co/functions/v1/payment-sheet' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14c2x5aGZlZGVuaXp2ZHp1dHh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzY3NDA3NiwiZXhwIjoyMDI5MjUwMDc2fQ.AwpvdpPN80eJPS82tk_t6RD-NUSlnjgBc-PhOQiL-dY' -H 'Content-Type: application/json' --data '{"amount": 109999}'
// $ curl -L -X POST 'https://mxslyhfedenizvdzutxz.supabase.co/functions/v1/hello-world' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14c2x5aGZlZGVuaXp2ZHp1dHh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzY3NDA3NiwiZXhwIjoyMDI5MjUwMDc2fQ.AwpvdpPN80eJPS82tk_t6RD-NUSlnjgBc-PhOQiL-dY' --data '{"name": "Functions"}'
