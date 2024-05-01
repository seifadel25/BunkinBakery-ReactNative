import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from "../_utils/stripe.ts";
import { createOrRetrieveProfile } from "../_utils/supabase.ts";
//payment-sheet edge function
serve(async (req: Request) => {
  try {
    const { amount } = await req.json();
    const customer = await createOrRetrieveProfile(req);
    // Create ephemeral key for the customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer },
      { apiVersion: "2024-04-10" }
    );
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
    });
    // Create a PaymentIntent so that the SDK can charge the logged in customer.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 1099,
      currency: "usd",
      customer: customer,
      payment_method: savedPaymentMethodId, // The payment method saved from SetupIntent
      confirm: true,
      off_session: true,
      confrmation_method: "manual",
      setup_future_usage: "off_session",
    });

    const res = {
      paymentIntent: paymentIntent,
      setupIntent: setupIntent,
      setupIntentClientSecret: setupIntent.client_secret,
      paymentIntentClientSecret: paymentIntent.client_secret,
      publishableKey: Deno.env.get("EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
      customer: customer,
      ephemeralKey: ephemeralKey.secret,
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
