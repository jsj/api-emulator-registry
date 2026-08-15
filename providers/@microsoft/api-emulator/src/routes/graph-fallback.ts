import type { RouteContext } from "@api-emulator/core";
import { generateOid } from "../helpers.js";

function contextUrl(baseUrl: string, path: string): string {
  const resource = path.replace(/^\/v1\.0\/?/, "").replace(/\?.*$/, "") || "$entity";
  return `${baseUrl}/v1.0/$metadata#${resource}`;
}

export function graphFallbackRoutes({ app, baseUrl }: RouteContext): void {
  app.get("/v1.0/*", (c) => {
    if (c.req.path.endsWith("/$count")) return c.text("0");
    if (c.req.path.endsWith("/$value")) return new Response(null, { status: 200 });
    return c.json({ "@odata.context": contextUrl(baseUrl, c.req.path), value: [] });
  });

  app.post("/v1.0/*", async (c) => {
    const input: Record<string, unknown> = await c.req.json<Record<string, unknown>>().catch(() => ({}));
    return c.json({ "@odata.context": contextUrl(baseUrl, c.req.path), id: generateOid(), ...input }, 201);
  });

  app.patch("/v1.0/*", () => new Response(null, { status: 204 }));
  app.put("/v1.0/*", () => new Response(null, { status: 204 }));
  app.delete("/v1.0/*", () => new Response(null, { status: 204 }));
}
