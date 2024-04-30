import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from "../_utils/stripe.ts";
import { createOrRetrieveProfile } from "../_utils/supabase.ts";

serve(async (req) => {
  try {
    const { amount } = await req.json();
    const customer = await createOrRetrieveProfile(req);
    // Create a PaymentIntent so that the SDK can charge the logged in customer.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 1099,
      currency: "usd",
      customer: customer,
    });
    // Create ephemeral key for the customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer },
      { apiVersion: "2020-08-27" }
    );
    const res = {
      publishableKey: Deno.env.get("EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer,
    };
    return new Response(JSON.stringify(res), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
