import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { parseStripeBody } from "../helpers.js";

const app = new Hono();
app.post("/", async (c) => c.json(await parseStripeBody(c)));
const parse = async (body: string) => (await app.request("/", {
  method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body,
})).json();

describe("Stripe form parsing", () => {
  it("ignores prototype paths without polluting other requests or objects", async () => {
    for (const key of ["__proto__[stripe_polluted]", "metadata[__proto__][stripe_polluted]", "constructor[prototype][stripe_polluted]", "items[0][__proto__][stripe_polluted]"]) {
      const parsed = await parse(`${encodeURIComponent(key)}=yes&email=safe%40example.com`);
      expect(parsed.email).toBe("safe@example.com");
      expect(Object.hasOwn(Object.prototype, "stripe_polluted")).toBe(false);
      expect(({} as Record<string, unknown>).stripe_polluted).toBeUndefined();
    }
    expect(await parse("name=Next")).toEqual({ name: "Next" });
  });
  it("preserves nested fields, arrays, numeric conversion and inherited property names", async () => {
    expect(await parse("items[0][quantity]=2&metadata[order]=abc&expand[]=customer&expand[]=invoice&toString[value]=safe")).toEqual({
      items: [{ quantity: 2 }], metadata: { order: "abc" }, expand: ["customer", "invoice"], toString: { value: "safe" },
    });
  });
});
