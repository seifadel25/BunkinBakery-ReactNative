import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from "../_utils/stripe.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { "Content-Type": "application/json" },
      status: 405,
    });
  }

  try {
    const { amount } = await req.json();
    if (!amount) {
      return new Response(JSON.stringify({ error: "Amount is required" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 1099,
      currency: "usd",
    });

    const publishableKey =
      Deno.env.get(
        "pk_test_51PARzJBmffrbeZXHP1E2KNRRiypcsunYY3Tw3uAiwgGq7c7UXy2RKnAYpiNf76jy4YSpSR7cvaOoCVWfptfExDIF00DKbU7UyB"
      ) || "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY";
    const res = {
      publishableKey: publishableKey,
      paymentIntent: paymentIntent.client_secret,
    };
    return new Response(JSON.stringify(res), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// curl -i --request POST 'https://mxslyhfedenizvdzutxz.supabase.co/functions/v1/payment-sheet' \
// --header 'Authorization: Bearer sk_test_51PARzJBmffrbeZXHm9XnI0rs6G8rExBKwYwnyoEV3sRYTLBRbNo2a9IdCo01q5IWnnr6I9ZXruLLecZVtmWlGicC00W9HwY06t' \
// --header 'Content-Type: application/json' \
// --data '{"amount": 1099}'

// curl -i --request POST 'http://127.0.0.1:54321/functions/v1/payment-sheet' \
// -H 'Authorization: Bearer sk_test_51PARzJBmffrbeZXHm9XnI0rs6G8rExBKwYwnyoEV3sRYTLBRbNo2a9IdCo01q5IWnnr6I9ZXruLLecZVtmWlGicC00W9HwY06t' \
// -H 'Content-Type: application/json' \
// -d '{"amount": 1099}'
