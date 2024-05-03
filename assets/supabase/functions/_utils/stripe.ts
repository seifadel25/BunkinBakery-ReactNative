// esm.sh is used to compile stripe-node to be compatible with ES modules.
import Stripe from "https://esm.sh/stripe@13.10.0?target=deno&deno-std=0.132.0&no-check";

export const stripe = Stripe(
  Deno.env.get(
    "sk_test_51PARzJBmffrbeZXHm9XnI0rs6G8rExBKwYwnyoEV3sRYTLBRbNo2a9IdCo01q5IWnnr6I9ZXruLLecZVtmWlGicC00W9HwY06t"
  ),
  {
    httpClient: Stripe.createFetchHttpClient(),
  }
);
