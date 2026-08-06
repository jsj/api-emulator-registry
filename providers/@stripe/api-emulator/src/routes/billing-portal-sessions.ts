import type { RouteContext } from "@api-emulator/core";
import { getStripeStore } from "../store.js";
import { parseStripeBody, stripeError, stripeId, toUnixTimestamp } from "../helpers.js";

export function billingPortalSessionRoutes({ app, store, baseUrl }: RouteContext): void {
  const stripe = getStripeStore(store);

  app.post("/v1/billing_portal/sessions", async (context) => {
    const body = await parseStripeBody(context);
    if (!body.customer) {
      return stripeError(context, 400, "invalid_request_error", "Missing required param: customer.", undefined, "customer");
    }
    if (!stripe.customers.findOneBy("stripe_id", body.customer as string)) {
      return stripeError(context, 400, "invalid_request_error", `No such customer: '${body.customer}'`, "resource_missing", "customer");
    }
    const id = stripeId("bps");
    return context.json({
      id,
      object: "billing_portal.session",
      configuration: null,
      created: toUnixTimestamp(new Date().toISOString()),
      customer: body.customer,
      livemode: false,
      locale: null,
      on_behalf_of: null,
      return_url: body.return_url ?? null,
      url: `${baseUrl}/billing-portal/${id}`,
    });
  });
}
